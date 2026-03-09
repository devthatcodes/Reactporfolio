from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
import random

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

# Models
class ForexRate(BaseModel):
    from_currency: str
    to_currency: str
    rate: float
    last_refreshed: str

class RiskSentiment(BaseModel):
    value: float
    label: str

class TradeFlow(BaseModel):
    sector: str
    value: float
    percentage: float
    rank: int

class Insight(BaseModel):
    source: str
    sentiment: str
    title: str
    is_new: bool = False

class FedData(BaseModel):
    stance: str
    rate: str
    last_change: str
    next_date: str
    hold_probability: float

class FedEvent(BaseModel):
    name: str
    date: str
    time: str

class NewsItem(BaseModel):
    source: str
    sentiment: str
    title: str
    time_ago: str

class YieldReaction(BaseModel):
    event: str
    sentiment: str
    two_year: str
    ten_year: str
    date: str

class FedWatchItem(BaseModel):
    date: str
    hold: float
    cut_25: float
    cut_50: Optional[float] = None

class ChartDataPoint(BaseModel):
    date: str
    value: float
    value2: Optional[float] = None

class SeasonalityData(BaseModel):
    month: str
    value: float

class CurrencyStrength(BaseModel):
    currency: str
    strength: float
    change: float

# Cache for API responses
forex_cache: Dict[str, Any] = {}
cache_expiry: Dict[str, datetime] = {}

async def fetch_forex_rate(from_currency: str, to_currency: str) -> Optional[float]:
    """Fetch forex rate from Alpha Vantage"""
    cache_key = f"{from_currency}_{to_currency}"
    
    # Check cache
    if cache_key in forex_cache and cache_key in cache_expiry:
        if datetime.now(timezone.utc) < cache_expiry[cache_key]:
            return forex_cache[cache_key]
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                ALPHA_VANTAGE_BASE,
                params={
                    'function': 'CURRENCY_EXCHANGE_RATE',
                    'from_currency': from_currency,
                    'to_currency': to_currency,
                    'apikey': ALPHA_VANTAGE_KEY
                },
                timeout=10.0
            )
            data = response.json()
            
            if 'Realtime Currency Exchange Rate' in data:
                rate = float(data['Realtime Currency Exchange Rate']['5. Exchange Rate'])
                forex_cache[cache_key] = rate
                cache_expiry[cache_key] = datetime.now(timezone.utc) + timedelta(minutes=15)
                return rate
            else:
                logger.warning(f"Alpha Vantage response: {data}")
                return None
    except Exception as e:
        logger.error(f"Error fetching forex rate: {e}")
        return None

def get_mock_forex_rates(base_currency: str) -> Dict[str, float]:
    """Generate mock forex rates relative to base currency"""
    base_rates_to_usd = {
        'USD': 1.0,
        'EUR': 1.08,
        'GBP': 1.27,
        'JPY': 0.0067,
        'CHF': 1.12,
        'CAD': 0.74,
        'AUD': 0.65,
        'NZD': 0.61,
    }
    
    rates = {}
    base_to_usd = base_rates_to_usd.get(base_currency, 1.0)
    
    for currency, rate_to_usd in base_rates_to_usd.items():
        if currency != base_currency:
            rates[currency] = rate_to_usd / base_to_usd
    
    return rates

# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "Macro Hub API"}

@api_router.get("/forex/rates/{base_currency}")
async def get_forex_rates(base_currency: str):
    """Get forex rates for all currencies against base currency"""
    if base_currency not in CURRENCY_PAIRS:
        raise HTTPException(status_code=400, detail="Invalid base currency")
    
    rates = {}
    
    # Try to get real rates from Alpha Vantage
    for currency in CURRENCY_PAIRS.keys():
        if currency != base_currency:
            rate = await fetch_forex_rate(base_currency, currency)
            if rate:
                rates[currency] = rate
    
    # If we didn't get any rates, use mock data
    if not rates:
        rates = get_mock_forex_rates(base_currency)
    
    return {"base": base_currency, "rates": rates}

@api_router.get("/risk-sentiment/{currency}")
async def get_risk_sentiment(currency: str):
    """Get risk sentiment data"""
    # Simulated risk sentiment based on market conditions
    base_sentiment = {
        'USD': 37, 'EUR': 42, 'GBP': 35, 'JPY': 28,
        'CHF': 25, 'CAD': 45, 'AUD': 52, 'NZD': 48
    }
    value = base_sentiment.get(currency, 37) + random.randint(-5, 5)
    value = max(0, min(100, value))
    
    label = "Risk Off" if value < 40 else "Risk On" if value > 60 else "Neutral"
    
    return {"value": value, "label": label}

@api_router.get("/trade-flows/{currency}")
async def get_trade_flows(currency: str):
    """Get trade flow data for exports and imports"""
    # Currency-specific trade data
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
            {"sector": "Food & Beverages", "value": 112.4, "percentage": 22.8, "rank": 1},
            {"sector": "Machinery", "value": 98.7, "percentage": 20.1, "rank": 2},
            {"sector": "Vehicles", "value": 87.3, "percentage": 17.8, "rank": 3},
        ],
    }
    
    default_exports = exports_data.get('USD')
    default_imports = imports_data.get('USD')
    
    return {
        "exports": exports_data.get(currency, default_exports),
        "imports": imports_data.get(currency, default_imports)
    }

@api_router.get("/insights/{currency}")
async def get_insights(currency: str):
    """Get market insights"""
    insights = [
        {
            "source": "Credit Agricole",
            "sentiment": "USD bullish",
            "title": "USD to Stay Bid N-Term: Premature to Expect a Quick Resolution to the US-Iran Conflict",
            "is_new": True
        },
        {
            "source": "Goldman Sachs",
            "sentiment": "USD bullish",
            "title": "Raising Our Oil Price Forecast Amidst Hormuz Disruptions",
            "is_new": True
        },
        {
            "source": "BNP Paribas",
            "sentiment": "USD bearish",
            "title": "We Turn More Bullish on AUD/USD and Raise our NZD/USD Targets",
            "is_new": False
        },
        {
            "source": "BNP Paribas",
            "sentiment": "USD bullish",
            "title": "CAD Will be Laggard within the G10 complex: Tapering USD/CAD",
            "is_new": False
        },
    ]
    
    # Adjust insights based on currency
    if currency != 'USD':
        for insight in insights:
            insight['sentiment'] = insight['sentiment'].replace('USD', currency)
    
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
    ]
    
    return {"events": events}

@api_router.get("/recent-news/{currency}")
async def get_recent_news(currency: str):
    """Get recent market news"""
    news = [
        {
            "source": "Reuters",
            "sentiment": "USD Bearish",
            "title": "Slower US job growth expected in February; unemployment rate forecast steady at 4.3%",
            "time_ago": "6h ago"
        },
        {
            "source": "Bloomberg",
            "sentiment": "USD Bearish",
            "title": "Bond Traders Scour Jobs Data to Gauge Fed Path Amid Oil Shock",
            "time_ago": "10h ago"
        },
        {
            "source": "CNBC",
            "sentiment": "USD Bearish",
            "title": "Some banks raised CD yields last month. Where you can still snag 4%",
            "time_ago": "12h ago"
        },
        {
            "source": "Bloomberg",
            "sentiment": "USD Bearish",
            "title": "Bond Traders See Increasing Chance of No Fed Cuts This Year",
            "time_ago": "17h ago"
        },
    ]
    
    # Adjust sentiment labels based on currency
    if currency != 'USD':
        for item in news:
            item['sentiment'] = item['sentiment'].replace('USD', currency)
    
    return {"news": news}

@api_router.get("/yield-reactions/{currency}")
async def get_yield_reactions(currency: str):
    """Get yield reaction data"""
    reactions = [
        {"event": "Fed FOMC", "sentiment": "Hawkish", "two_year": "+5bps", "ten_year": "+7bps", "date": "Feb 18"},
        {"event": "Fed CPI", "sentiment": "Dovish", "two_year": "-23bps", "ten_year": "-20bps", "date": "Feb 13"},
        {"event": "Fed NFP", "sentiment": "Hawkish", "two_year": "+23bps", "ten_year": "+15bps", "date": "Feb 11"},
        {"event": "Fed Retail Sales", "sentiment": "Dovish", "two_year": "-5bps", "ten_year": "-6bps", "date": "Feb 10"},
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
    months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Dec", "Jan", "Feb"]
    
    # Employment data (in thousands) and unemployment rate
    employment = [260000, 245000, 230000, 195000, 175000, 160000, 145000, 140000, 155000, 180000, 210000, 240000, 220000, 200000]
    unemployment = [4.8, 4.7, 4.6, 4.5, 4.4, 4.3, 4.2, 4.2, 4.3, 4.4, 4.5, 4.6, 4.5, 4.4]
    
    data = []
    for i, month in enumerate(months):
        data.append({
            "date": month,
            "employment": employment[i],
            "unemployment": unemployment[i]
        })
    
    return {"data": data}

@api_router.get("/inflation/{currency}")
async def get_inflation(currency: str):
    """Get inflation chart data"""
    data = [
        {"date": "October 2025", "cpi": 2.9, "core": 3.0},
        {"date": "November 2025", "cpi": 2.85, "core": 2.95},
        {"date": "December 2025", "cpi": 2.7, "core": 2.85},
        {"date": "January 2026", "cpi": 2.55, "core": 2.7},
        {"date": "February 2026", "cpi": 2.4, "core": 2.5},
    ]
    
    return {"data": data}

@api_router.get("/seasonality/{currency}")
async def get_seasonality(currency: str):
    """Get DXY/currency seasonality data"""
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    # Seasonality values (positive = currency typically strengthens)
    seasonality = {
        'USD': [0.8, 0.5, -0.3, -0.5, -0.8, -1.2, 0.2, 1.5, 1.2, 0.8, 1.8, -0.5],
        'EUR': [-0.5, -0.3, 0.4, 0.6, 0.9, 1.0, -0.3, -1.2, -0.8, -0.5, -1.5, 0.6],
        'GBP': [-0.3, 0.2, 0.5, 0.3, 0.7, 0.5, -0.5, -0.8, -0.3, 0.2, -1.0, 0.3],
    }
    
    values = seasonality.get(currency, seasonality['USD'])
    
    data = []
    for i, month in enumerate(months):
        data.append({"month": month, "value": values[i]})
    
    return {"data": data}

@api_router.get("/currency-strength/{base_currency}")
async def get_currency_strength(base_currency: str):
    """Get currency strength index data"""
    # Mock strength data
    strength_data = {
        'USD': {'strength': 103.5, 'change': 0.25},
        'EUR': {'strength': 98.2, 'change': -0.15},
        'GBP': {'strength': 95.8, 'change': 0.10},
        'JPY': {'strength': 88.4, 'change': -0.45},
        'CHF': {'strength': 101.2, 'change': 0.05},
        'CAD': {'strength': 92.6, 'change': -0.20},
        'AUD': {'strength': 89.3, 'change': 0.30},
        'NZD': {'strength': 87.1, 'change': 0.15},
    }
    
    currencies = []
    for currency, data in strength_data.items():
        currencies.append({
            "currency": currency,
            "strength": data['strength'],
            "change": data['change']
        })
    
    # Sort by strength descending
    currencies.sort(key=lambda x: x['strength'], reverse=True)
    
    return {"base": base_currency, "currencies": currencies}

@api_router.get("/currency-heatmap/{base_currency}")
async def get_currency_heatmap(base_currency: str):
    """Get currency strength heatmap data"""
    currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD']
    timeframes = ['1W', '2W', '1M']
    
    # Generate heatmap data
    heatmap = {}
    for currency in currencies:
        heatmap[currency] = {}
        for tf in timeframes:
            # Random value between -3 and 3
            heatmap[currency][tf] = round(random.uniform(-3, 3), 2)
    
    return {"heatmap": heatmap, "timeframes": timeframes}

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
