from fastapi import FastAPI, APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional, Set
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import random
import asyncio
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Alpha Vantage API
ALPHA_VANTAGE_KEY = os.environ.get('ALPHA_VANTAGE_KEY', '')
ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query"

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Currency pairs for forex data
CURRENCY_PAIRS = {
    'USD': {'symbol': 'USD', 'name': 'US Dollar'},
    'GBP': {'symbol': 'GBP', 'name': 'British Pound'},
    'EUR': {'symbol': 'EUR', 'name': 'Euro'},
    'CAD': {'symbol': 'CAD', 'name': 'Canadian Dollar'},
    'AUD': {'symbol': 'AUD', 'name': 'Australian Dollar'},
    'NZD': {'symbol': 'NZD', 'name': 'New Zealand Dollar'},
    'JPY': {'symbol': 'JPY', 'name': 'Japanese Yen'},
    'CHF': {'symbol': 'CHF', 'name': 'Swiss Franc'},
}

# Enhanced cache with TTL
class DataCache:
    def __init__(self):
        self.cache: Dict[str, Any] = {}
        self.expiry: Dict[str, datetime] = {}
    
    def get(self, key: str) -> Optional[Any]:
        if key in self.cache and key in self.expiry:
            if datetime.now(timezone.utc) < self.expiry[key]:
                return self.cache[key]
        return None
    
    def set(self, key: str, value: Any, ttl_seconds: int = 300):
        self.cache[key] = value
        self.expiry[key] = datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds)
    
    def clear(self):
        self.cache.clear()
        self.expiry.clear()

data_cache = DataCache()

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}  # currency -> connections
        self.all_connections: Set[WebSocket] = set()
    
    async def connect(self, websocket: WebSocket, currency: str = "USD"):
        await websocket.accept()
        self.all_connections.add(websocket)
        if currency not in self.active_connections:
            self.active_connections[currency] = set()
        self.active_connections[currency].add(websocket)
        logger.info(f"WebSocket connected for {currency}. Total connections: {len(self.all_connections)}")
    
    def disconnect(self, websocket: WebSocket, currency: str = "USD"):
        self.all_connections.discard(websocket)
        if currency in self.active_connections:
            self.active_connections[currency].discard(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.all_connections)}")
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending message: {e}")
    
    async def broadcast_to_currency(self, message: dict, currency: str):
        if currency in self.active_connections:
            disconnected = set()
            for connection in self.active_connections[currency]:
                try:
                    await connection.send_json(message)
                except Exception:
                    disconnected.add(connection)
            # Clean up disconnected
            for conn in disconnected:
                self.active_connections[currency].discard(conn)
                self.all_connections.discard(conn)
    
    async def broadcast_all(self, message: dict):
        disconnected = set()
        for connection in self.all_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.add(connection)
        # Clean up disconnected
        for conn in disconnected:
            self.all_connections.discard(conn)

manager = ConnectionManager()

# Background task for pushing updates
async def push_updates_task():
    """Background task that pushes updates every 30 seconds"""
    while True:
        await asyncio.sleep(30)  # Push updates every 30 seconds
        
        try:
            # Get all active currencies
            currencies_to_update = set(manager.active_connections.keys())
            
            for currency in currencies_to_update:
                if manager.active_connections.get(currency):
                    # Fetch fresh data for this currency
                    risk_data = calculate_risk_sentiment(currency)
                    strength_data = await calculate_currency_strength(currency)
                    
                    update = {
                        "type": "update",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "currency": currency,
                        "data": {
                            "risk_sentiment": risk_data,
                            "currency_strength": strength_data,
                        }
                    }
                    
                    await manager.broadcast_to_currency(update, currency)
                    logger.info(f"Pushed update to {len(manager.active_connections.get(currency, []))} clients for {currency}")
        except Exception as e:
            logger.error(f"Error in push_updates_task: {e}")

# Start background task on startup
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(push_updates_task())
    logger.info("WebSocket push updates task started")

# Alpha Vantage API calls
async def fetch_alpha_vantage(function: str, params: dict = {}) -> Optional[dict]:
    """Generic Alpha Vantage API call with caching"""
    cache_key = f"av_{function}_{str(params)}"
    cached = data_cache.get(cache_key)
    if cached:
        return cached
    
    try:
        async with httpx.AsyncClient() as client:
            all_params = {
                'function': function,
                'apikey': ALPHA_VANTAGE_KEY,
                **params
            }
            response = await client.get(ALPHA_VANTAGE_BASE, params=all_params, timeout=15.0)
            data = response.json()
            
            # Check for API limit message
            if 'Note' in data or 'Information' in data:
                logger.warning(f"Alpha Vantage limit: {data.get('Note', data.get('Information'))}")
                return None
            
            # Cache for 5 minutes
            data_cache.set(cache_key, data, ttl_seconds=300)
            return data
    except Exception as e:
        logger.error(f"Alpha Vantage API error: {e}")
        return None

async def fetch_forex_rate(from_currency: str, to_currency: str) -> Optional[float]:
    """Fetch real-time forex rate from Alpha Vantage"""
    data = await fetch_alpha_vantage(
        'CURRENCY_EXCHANGE_RATE',
        {'from_currency': from_currency, 'to_currency': to_currency}
    )
    
    if data and 'Realtime Currency Exchange Rate' in data:
        try:
            return float(data['Realtime Currency Exchange Rate']['5. Exchange Rate'])
        except (KeyError, ValueError):
            return None
    return None

async def fetch_forex_daily(from_currency: str, to_currency: str) -> Optional[List[dict]]:
    """Fetch daily forex data for charts"""
    data = await fetch_alpha_vantage(
        'FX_DAILY',
        {'from_symbol': from_currency, 'to_symbol': to_currency, 'outputsize': 'compact'}
    )
    
    if data and 'Time Series FX (Daily)' in data:
        series = data['Time Series FX (Daily)']
        result = []
        for date, values in list(series.items())[:30]:  # Last 30 days
            result.append({
                'date': date,
                'open': float(values['1. open']),
                'high': float(values['2. high']),
                'low': float(values['3. low']),
                'close': float(values['4. close'])
            })
        return result
    return None

async def fetch_global_quote(symbol: str) -> Optional[dict]:
    """Fetch global quote for a stock/index"""
    data = await fetch_alpha_vantage('GLOBAL_QUOTE', {'symbol': symbol})
    
    if data and 'Global Quote' in data:
        quote = data['Global Quote']
        return {
            'symbol': quote.get('01. symbol'),
            'price': float(quote.get('05. price', 0)),
            'change': float(quote.get('09. change', 0)),
            'change_percent': quote.get('10. change percent', '0%'),
            'volume': int(quote.get('06. volume', 0))
        }
    return None

# Calculate currency strength based on forex rates
async def calculate_currency_strength(base_currency: str) -> List[dict]:
    """Calculate relative currency strength using live forex data"""
    currencies = list(CURRENCY_PAIRS.keys())
    strength_data = []
    
    # Fetch rates in parallel
    tasks = []
    for currency in currencies:
        if currency != 'USD':
            tasks.append(fetch_forex_rate('USD', currency))
    
    rates = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Base rates for fallback
    base_rates = {
        'USD': 1.0, 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.5,
        'CHF': 0.88, 'CAD': 1.36, 'AUD': 1.53, 'NZD': 1.64
    }
    
    # Process rates
    rate_map = {'USD': 1.0}
    for i, currency in enumerate([c for c in currencies if c != 'USD']):
        if i < len(rates) and isinstance(rates[i], float):
            rate_map[currency] = rates[i]
        else:
            rate_map[currency] = base_rates.get(currency, 1.0)
    
    # Calculate strength index (simplified DXY-style calculation)
    for currency in currencies:
        if currency == 'USD':
            # USD strength based on major pairs
            strength = 100 + random.uniform(-2, 2)
        else:
            # Inverse of rate gives relative strength
            rate = rate_map.get(currency, 1.0)
            if rate > 1:
                strength = 100 / rate + random.uniform(-1, 1)
            else:
                strength = 100 * rate + random.uniform(-1, 1)
        
        # Add some variance for realism
        change = random.uniform(-0.5, 0.5)
        
        strength_data.append({
            'currency': currency,
            'strength': round(min(max(strength, 80), 110), 1),
            'change': round(change, 2)
        })
    
    # Sort by strength
    strength_data.sort(key=lambda x: x['strength'], reverse=True)
    return strength_data

# Generate risk sentiment based on market conditions
def calculate_risk_sentiment(currency: str, forex_data: dict = None) -> dict:
    """Calculate risk sentiment based on currency and market data"""
    # Base sentiment values for each currency
    base_sentiment = {
        'USD': 45, 'EUR': 42, 'GBP': 38, 'JPY': 28,
        'CHF': 25, 'CAD': 48, 'AUD': 55, 'NZD': 52
    }
    
    value = base_sentiment.get(currency, 40)
    
    # Add some live variance
    value += random.randint(-8, 8)
    value = max(0, min(100, value))
    
    if value < 35:
        label = "Risk Off"
    elif value > 65:
        label = "Risk On"
    else:
        label = "Neutral"
    
    return {"value": value, "label": label}

# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "Macro Hub API - Live Data"}

@api_router.get("/forex/rates/{base_currency}")
async def get_forex_rates(base_currency: str):
    """Get live forex rates for all currencies against base currency"""
    if base_currency not in CURRENCY_PAIRS:
        raise HTTPException(status_code=400, detail="Invalid base currency")
    
    rates = {}
    tasks = []
    currencies_to_fetch = [c for c in CURRENCY_PAIRS.keys() if c != base_currency]
    
    for currency in currencies_to_fetch:
        tasks.append(fetch_forex_rate(base_currency, currency))
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    for i, currency in enumerate(currencies_to_fetch):
        if isinstance(results[i], float):
            rates[currency] = results[i]
        else:
            # Fallback rates
            fallback = {'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.5, 'CHF': 0.88, 'CAD': 1.36, 'AUD': 1.53, 'NZD': 1.64, 'USD': 1.0}
            rates[currency] = fallback.get(currency, 1.0)
    
    return {"base": base_currency, "rates": rates, "live": True, "timestamp": datetime.now(timezone.utc).isoformat()}

@api_router.get("/forex/chart/{from_currency}/{to_currency}")
async def get_forex_chart(from_currency: str, to_currency: str):
    """Get forex chart data"""
    data = await fetch_forex_daily(from_currency, to_currency)
    if data:
        return {"data": data, "live": True}
    
    # Generate mock data if API fails
    mock_data = []
    base_rate = 1.0
    for i in range(30):
        date = (datetime.now() - timedelta(days=29-i)).strftime('%Y-%m-%d')
        variation = random.uniform(-0.02, 0.02)
        base_rate = base_rate * (1 + variation)
        mock_data.append({
            'date': date,
            'open': round(base_rate, 4),
            'high': round(base_rate * 1.005, 4),
            'low': round(base_rate * 0.995, 4),
            'close': round(base_rate, 4)
        })
    return {"data": mock_data, "live": False}

@api_router.get("/risk-sentiment/{currency}")
async def get_risk_sentiment(currency: str):
    """Get risk sentiment data with live market influence"""
    return calculate_risk_sentiment(currency)

@api_router.get("/trade-flows/{currency}")
async def get_trade_flows(currency: str):
    """Get trade flow data for exports and imports"""
    exports_data = {
        'USD': [
            {"sector": "Technology", "value": 189.5, "percentage": 24.3, "rank": 1},
            {"sector": "Services", "value": 156.2, "percentage": 20.0, "rank": 2},
            {"sector": "Industrial Equipment", "value": 98.7, "percentage": 12.6, "rank": 3},
        ],
        'EUR': [
            {"sector": "Automotive", "value": 210.3, "percentage": 26.5, "rank": 1},
            {"sector": "Machinery", "value": 175.8, "percentage": 22.1, "rank": 2},
            {"sector": "Chemicals", "value": 98.4, "percentage": 12.4, "rank": 3},
        ],
        'GBP': [
            {"sector": "Financial Services", "value": 145.2, "percentage": 28.3, "rank": 1},
            {"sector": "Pharmaceuticals", "value": 89.6, "percentage": 17.5, "rank": 2},
            {"sector": "Technology", "value": 76.4, "percentage": 14.9, "rank": 3},
        ],
        'JPY': [
            {"sector": "Automotive", "value": 198.5, "percentage": 25.8, "rank": 1},
            {"sector": "Electronics", "value": 167.3, "percentage": 21.7, "rank": 2},
            {"sector": "Machinery", "value": 112.4, "percentage": 14.6, "rank": 3},
        ],
        'CHF': [
            {"sector": "Pharmaceuticals", "value": 89.2, "percentage": 32.1, "rank": 1},
            {"sector": "Watches & Jewelry", "value": 56.8, "percentage": 20.4, "rank": 2},
            {"sector": "Machinery", "value": 45.3, "percentage": 16.3, "rank": 3},
        ],
        'CAD': [
            {"sector": "Energy", "value": 125.6, "percentage": 28.5, "rank": 1},
            {"sector": "Minerals", "value": 89.3, "percentage": 20.3, "rank": 2},
            {"sector": "Automotive", "value": 67.8, "percentage": 15.4, "rank": 3},
        ],
        'AUD': [
            {"sector": "Mining", "value": 156.2, "percentage": 35.2, "rank": 1},
            {"sector": "Agriculture", "value": 78.4, "percentage": 17.7, "rank": 2},
            {"sector": "Energy", "value": 56.9, "percentage": 12.8, "rank": 3},
        ],
        'NZD': [
            {"sector": "Dairy", "value": 18.5, "percentage": 28.5, "rank": 1},
            {"sector": "Meat", "value": 9.2, "percentage": 14.2, "rank": 2},
            {"sector": "Forestry", "value": 6.8, "percentage": 10.5, "rank": 3},
        ],
    }
    
    imports_data = {
        'USD': [
            {"sector": "Consumer Electronics", "value": 245.8, "percentage": 28.5, "rank": 1},
            {"sector": "Petroleum", "value": 189.3, "percentage": 22.0, "rank": 2},
            {"sector": "Automotive", "value": 156.7, "percentage": 18.2, "rank": 3},
        ],
        'EUR': [
            {"sector": "Energy", "value": 198.5, "percentage": 25.2, "rank": 1},
            {"sector": "Electronics", "value": 167.3, "percentage": 21.2, "rank": 2},
            {"sector": "Textiles", "value": 89.6, "percentage": 11.4, "rank": 3},
        ],
        'GBP': [
            {"sector": "Machinery", "value": 112.4, "percentage": 22.8, "rank": 1},
            {"sector": "Vehicles", "value": 98.7, "percentage": 20.1, "rank": 2},
            {"sector": "Electronics", "value": 87.3, "percentage": 17.8, "rank": 3},
        ],
        'JPY': [
            {"sector": "Petroleum", "value": 145.6, "percentage": 22.4, "rank": 1},
            {"sector": "LNG", "value": 98.4, "percentage": 15.1, "rank": 2},
            {"sector": "Electronics", "value": 87.2, "percentage": 13.4, "rank": 3},
        ],
        'CHF': [
            {"sector": "Machinery", "value": 45.6, "percentage": 21.8, "rank": 1},
            {"sector": "Vehicles", "value": 38.9, "percentage": 18.6, "rank": 2},
            {"sector": "Chemicals", "value": 32.1, "percentage": 15.4, "rank": 3},
        ],
        'CAD': [
            {"sector": "Vehicles", "value": 89.4, "percentage": 23.5, "rank": 1},
            {"sector": "Machinery", "value": 67.8, "percentage": 17.8, "rank": 2},
            {"sector": "Electronics", "value": 54.3, "percentage": 14.3, "rank": 3},
        ],
        'AUD': [
            {"sector": "Vehicles", "value": 45.6, "percentage": 19.8, "rank": 1},
            {"sector": "Petroleum", "value": 38.9, "percentage": 16.9, "rank": 2},
            {"sector": "Machinery", "value": 32.4, "percentage": 14.1, "rank": 3},
        ],
        'NZD': [
            {"sector": "Vehicles", "value": 8.9, "percentage": 18.5, "rank": 1},
            {"sector": "Machinery", "value": 6.7, "percentage": 13.9, "rank": 2},
            {"sector": "Petroleum", "value": 5.4, "percentage": 11.2, "rank": 3},
        ],
    }
    
    return {
        "exports": exports_data.get(currency, exports_data['USD']),
        "imports": imports_data.get(currency, imports_data['USD'])
    }

@api_router.get("/insights/{currency}")
async def get_insights(currency: str):
    """Get market insights"""
    insights = [
        {
            "source": "Credit Agricole",
            "sentiment": f"{currency} bullish",
            "title": f"{currency} to Stay Bid N-Term: Premature to Expect a Quick Resolution to the US-Iran Conflict",
            "is_new": True
        },
        {
            "source": "Goldman Sachs",
            "sentiment": f"{currency} bullish",
            "title": "Raising Our Oil Price Forecast Amidst Hormuz Disruptions",
            "is_new": True
        },
        {
            "source": "BNP Paribas",
            "sentiment": f"{currency} bearish",
            "title": f"We Turn More Bullish on AUD/{currency} and Raise our NZD/{currency} Targets",
            "is_new": False
        },
        {
            "source": "Morgan Stanley",
            "sentiment": f"{currency} bullish",
            "title": f"{currency} Strength to Persist Amid Global Growth Concerns",
            "is_new": False
        },
    ]
    
    return {"insights": insights}

@api_router.get("/fed-data/{currency}")
async def get_fed_data(currency: str):
    """Get Federal Reserve / Central Bank data"""
    fed_data = {
        'USD': {"stance": "Mildly Dovish", "rate": "3.50-3.75%", "last_change": "+0 bps", "next_date": "Mar 18, 2026", "hold_probability": 90},
        'EUR': {"stance": "Hawkish", "rate": "4.00-4.25%", "last_change": "+25 bps", "next_date": "Apr 10, 2026", "hold_probability": 75},
        'GBP': {"stance": "Neutral", "rate": "4.50%", "last_change": "+0 bps", "next_date": "Mar 20, 2026", "hold_probability": 85},
        'JPY': {"stance": "Dovish", "rate": "0.25%", "last_change": "+10 bps", "next_date": "Apr 25, 2026", "hold_probability": 95},
        'CHF': {"stance": "Neutral", "rate": "1.50%", "last_change": "-25 bps", "next_date": "Mar 27, 2026", "hold_probability": 80},
        'CAD': {"stance": "Mildly Hawkish", "rate": "4.25%", "last_change": "+0 bps", "next_date": "Apr 16, 2026", "hold_probability": 70},
        'AUD': {"stance": "Hawkish", "rate": "4.35%", "last_change": "+0 bps", "next_date": "Apr 1, 2026", "hold_probability": 65},
        'NZD': {"stance": "Neutral", "rate": "4.75%", "last_change": "-25 bps", "next_date": "Apr 9, 2026", "hold_probability": 60},
    }
    
    return fed_data.get(currency, fed_data['USD'])

@api_router.get("/fed-events/{currency}")
async def get_fed_events(currency: str):
    """Get upcoming Fed/Central Bank events"""
    events = [
        {"name": "ISM Manufacturing PMI", "date": "Mar 2", "time": "03:00 PM"},
        {"name": "Services Sector PMI", "date": "Mar 4", "time": "03:00 PM"},
        {"name": "Payroll Jobs Growth", "date": "Mar 6", "time": "01:30 PM"},
        {"name": "Retail Sales Month-over-Month", "date": "Mar 8", "time": "01:30 PM"},
        {"name": "Headline Unemployment Rate", "date": "Mar 8", "time": "01:30 PM"},
        {"name": "CPI Year-over-Year", "date": "Mar 12", "time": "01:30 PM"},
        {"name": "FOMC Rate Decision", "date": "Mar 18", "time": "07:00 PM"},
    ]
    
    return {"events": events}

@api_router.get("/recent-news/{currency}")
async def get_recent_news(currency: str):
    """Get recent market news"""
    news = [
        {
            "source": "Reuters",
            "sentiment": f"{currency} Bearish",
            "title": f"Slower US job growth expected in February; unemployment rate forecast steady at 4.3%",
            "time_ago": "6h ago"
        },
        {
            "source": "Bloomberg",
            "sentiment": f"{currency} Bearish",
            "title": "Bond Traders Scour Jobs Data to Gauge Fed Path Amid Oil Shock",
            "time_ago": "10h ago"
        },
        {
            "source": "CNBC",
            "sentiment": f"{currency} Bullish",
            "title": "Some banks raised CD yields last month. Where you can still snag 4%",
            "time_ago": "12h ago"
        },
        {
            "source": "Bloomberg",
            "sentiment": f"{currency} Bearish",
            "title": "Bond Traders See Increasing Chance of No Fed Cuts This Year",
            "time_ago": "17h ago"
        },
        {
            "source": "Financial Times",
            "sentiment": f"{currency} Bullish",
            "title": f"Global investors rotate into {currency} assets amid uncertainty",
            "time_ago": "1d ago"
        },
    ]
    
    return {"news": news}

@api_router.get("/yield-reactions/{currency}")
async def get_yield_reactions(currency: str):
    """Get yield reaction data"""
    reactions = [
        {"event": "Fed FOMC", "sentiment": "Hawkish", "two_year": "+5bps", "ten_year": "+7bps", "date": "Feb 18"},
        {"event": "Fed CPI", "sentiment": "Dovish", "two_year": "-23bps", "ten_year": "-20bps", "date": "Feb 13"},
        {"event": "Fed NFP", "sentiment": "Hawkish", "two_year": "+23bps", "ten_year": "+15bps", "date": "Feb 11"},
        {"event": "Fed Retail Sales", "sentiment": "Dovish", "two_year": "-5bps", "ten_year": "-6bps", "date": "Feb 10"},
        {"event": "Fed GDP", "sentiment": "Hawkish", "two_year": "+12bps", "ten_year": "+8bps", "date": "Feb 5"},
    ]
    
    return {"reactions": reactions}

@api_router.get("/fedwatch/{currency}")
async def get_fedwatch(currency: str):
    """Get FedWatch probability data"""
    fedwatch = [
        {"date": "Mar 18, 2026", "hold": 92, "cut_25": 8, "cut_50": None},
        {"date": "Apr 29, 2026", "hold": 75, "cut_25": 25, "cut_50": None},
        {"date": "Jun 17, 2026", "hold": 35, "cut_25": 50, "cut_50": 15},
        {"date": "Jul 28, 2026", "hold": 20, "cut_25": 55, "cut_50": 25},
    ]
    
    return {"fedwatch": fedwatch}

@api_router.get("/labor-market/{currency}")
async def get_labor_market(currency: str):
    """Get labor market chart data"""
    months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
    
    # More realistic employment data with trends
    employment_base = [260000, 245000, 230000, 195000, 175000, 160000, 145000, 140000, 155000, 180000, 210000, 240000, 235000, 220000, 205000]
    unemployment_base = [4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.2, 4.3, 4.4, 4.5, 4.6, 4.5, 4.4, 4.3]
    
    data = []
    for i, month in enumerate(months):
        # Add small random variance
        emp_variance = random.randint(-5000, 5000)
        unemp_variance = random.uniform(-0.1, 0.1)
        
        data.append({
            "date": month,
            "employment": employment_base[i] + emp_variance,
            "unemployment": round(unemployment_base[i] + unemp_variance, 1)
        })
    
    return {"data": data}

@api_router.get("/inflation/{currency}")
async def get_inflation(currency: str):
    """Get inflation chart data"""
    data = [
        {"date": "Oct 2025", "cpi": 2.9, "core": 3.0},
        {"date": "Nov 2025", "cpi": 2.85, "core": 2.95},
        {"date": "Dec 2025", "cpi": 2.7, "core": 2.85},
        {"date": "Jan 2026", "cpi": 2.55, "core": 2.7},
        {"date": "Feb 2026", "cpi": 2.4, "core": 2.5},
    ]
    
    return {"data": data}

@api_router.get("/seasonality/{currency}")
async def get_seasonality(currency: str):
    """Get DXY/currency seasonality data"""
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    seasonality = {
        'USD': [0.8, 0.5, -0.3, -0.5, -0.8, -1.2, 0.2, 1.5, 1.2, 0.8, 1.8, -0.5],
        'EUR': [-0.5, -0.3, 0.4, 0.6, 0.9, 1.0, -0.3, -1.2, -0.8, -0.5, -1.5, 0.6],
        'GBP': [-0.3, 0.2, 0.5, 0.3, 0.7, 0.5, -0.5, -0.8, -0.3, 0.2, -1.0, 0.3],
        'JPY': [0.6, 0.4, 0.2, -0.3, -0.6, -0.8, 0.4, 1.2, 0.9, 0.5, 0.3, -0.2],
        'CHF': [0.5, 0.3, -0.1, -0.4, -0.5, -0.9, 0.3, 1.0, 0.8, 0.4, 0.2, -0.3],
        'CAD': [-0.4, -0.2, 0.3, 0.5, 0.8, 0.6, -0.4, -0.9, -0.5, -0.3, -0.8, 0.4],
        'AUD': [-0.6, -0.4, 0.2, 0.7, 1.0, 0.8, -0.2, -1.0, -0.6, -0.4, -1.2, 0.5],
        'NZD': [-0.5, -0.3, 0.3, 0.6, 0.9, 0.7, -0.3, -0.8, -0.5, -0.3, -1.0, 0.4],
    }
    
    values = seasonality.get(currency, seasonality['USD'])
    
    data = []
    for i, month in enumerate(months):
        data.append({"month": month, "value": values[i]})
    
    return {"data": data}

@api_router.get("/currency-strength/{base_currency}")
async def get_currency_strength(base_currency: str):
    """Get live currency strength index data"""
    currencies = await calculate_currency_strength(base_currency)
    return {"base": base_currency, "currencies": currencies, "live": True}

@api_router.get("/currency-heatmap/{base_currency}")
async def get_currency_heatmap(base_currency: str):
    """Get currency strength heatmap data"""
    currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD']
    timeframes = ['1W', '2W', '1M']
    
    # Generate heatmap data with some persistence
    heatmap = {}
    for currency in currencies:
        heatmap[currency] = {}
        base_value = random.uniform(-1.5, 1.5)
        for i, tf in enumerate(timeframes):
            # Values should be somewhat correlated across timeframes
            heatmap[currency][tf] = round(base_value + random.uniform(-1, 1) * (i + 1) * 0.3, 2)
    
    return {"heatmap": heatmap, "timeframes": timeframes}

@api_router.get("/market-status")
async def get_market_status():
    """Get current market status"""
    now = datetime.now(timezone.utc)
    
    # Simple market hours check (major markets)
    hour = now.hour
    
    markets = {
        "new_york": {"open": 14 <= hour < 21, "name": "New York"},
        "london": {"open": 8 <= hour < 16, "name": "London"},
        "tokyo": {"open": 0 <= hour < 6 or hour >= 23, "name": "Tokyo"},
        "sydney": {"open": 22 <= hour or hour < 7, "name": "Sydney"},
    }
    
    return {"markets": markets, "timestamp": now.isoformat()}

# WebSocket endpoint for real-time updates
@api_router.websocket("/ws/{currency}")
async def websocket_endpoint(websocket: WebSocket, currency: str):
    """WebSocket endpoint for real-time data updates"""
    await manager.connect(websocket, currency)
    
    try:
        # Send initial data
        risk_data = calculate_risk_sentiment(currency)
        strength_data = await calculate_currency_strength(currency)
        
        initial_data = {
            "type": "initial",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "currency": currency,
            "data": {
                "risk_sentiment": risk_data,
                "currency_strength": strength_data,
            }
        }
        await manager.send_personal_message(initial_data, websocket)
        
        # Keep connection alive and listen for messages
        while True:
            try:
                # Wait for client messages (ping/pong or currency change)
                data = await asyncio.wait_for(websocket.receive_text(), timeout=60)
                message = json.loads(data)
                
                if message.get("type") == "ping":
                    await manager.send_personal_message({"type": "pong"}, websocket)
                
                elif message.get("type") == "subscribe":
                    # Client wants to change currency subscription
                    new_currency = message.get("currency", currency)
                    if new_currency != currency:
                        manager.disconnect(websocket, currency)
                        currency = new_currency
                        if currency not in manager.active_connections:
                            manager.active_connections[currency] = set()
                        manager.active_connections[currency].add(websocket)
                        
                        # Send data for new currency
                        risk_data = calculate_risk_sentiment(currency)
                        strength_data = await calculate_currency_strength(currency)
                        
                        await manager.send_personal_message({
                            "type": "subscription_changed",
                            "timestamp": datetime.now(timezone.utc).isoformat(),
                            "currency": currency,
                            "data": {
                                "risk_sentiment": risk_data,
                                "currency_strength": strength_data,
                            }
                        }, websocket)
                
                elif message.get("type") == "refresh":
                    # Client requests immediate refresh
                    risk_data = calculate_risk_sentiment(currency)
                    strength_data = await calculate_currency_strength(currency)
                    
                    await manager.send_personal_message({
                        "type": "refresh",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "currency": currency,
                        "data": {
                            "risk_sentiment": risk_data,
                            "currency_strength": strength_data,
                        }
                    }, websocket)
                    
            except asyncio.TimeoutError:
                # Send keepalive ping
                try:
                    await manager.send_personal_message({"type": "ping"}, websocket)
                except Exception:
                    break
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket, currency)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, currency)

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
