# Macro Hub - Financial Dashboard PRD

## Original Problem Statement
Build a Macro Hub financial dashboard similar to provided screenshots with multiple widgets for financial data visualization. Currency selector (USD, GBP, EUR, CAD, AUD, NZD, JPY, CHF) should filter/change all data. Skip Live Bloomberg TV widget.

## Architecture
- **Frontend**: React with Recharts for data visualization
- **Backend**: FastAPI with Alpha Vantage live integration
- **Database**: MongoDB (available but not heavily used for this dashboard)
- **API Integration**: Alpha Vantage for live forex rates and currency strength

## User Personas
1. **Financial Analysts** - Monitor macroeconomic indicators across currencies
2. **Traders** - Track risk sentiment, Fed events, and yield reactions
3. **Economists** - Analyze inflation, labor market, and seasonality patterns

## Core Requirements (Static)
- Dark theme dashboard matching provided design
- 12+ financial widgets with live data
- Currency selector that filters all widget data
- Expandable modals for detailed views
- Auto-refresh every 5 minutes (configurable)
- Responsive layout

## What's Been Implemented ✅
**Date: January 2026**

### Widgets Completed:
1. ✅ Risk Sentiment Gauge (0-100%) - Live variance
2. ✅ Trade Flows (Exports/Imports tabs) - Currency-specific data
3. ✅ Insights (Bank analyses with sentiment badges)
4. ✅ FED Data (Rate, stance, next meeting, hold probability)
5. ✅ Fed Events (7 upcoming economic events)
6. ✅ Recent News (5 news items with sentiment indicators)
7. ✅ Yield Reactions (5 Fed event yield changes)
8. ✅ FedWatch (Rate probability bars)
9. ✅ Labor Market Chart (Dual-axis line chart with variance)
10. ✅ Inflation Chart (CPI & Core inflation)
11. ✅ Seasonality Chart (Monthly bar chart per currency)
12. ✅ Currency Strength Index (LIVE from Alpha Vantage)
13. ✅ Currency Strength Heatmap (Color-coded grid)

### Features Completed:
- ✅ Currency selector with 8 currencies (functional, changes all data)
- ✅ Sidebar navigation
- ✅ View buttons open expanded modals with chart legends
- ✅ Auto-refresh (configurable: 1, 5, 10, 15 min)
- ✅ Manual refresh button
- ✅ Last updated timestamp display
- ✅ Responsive design
- ✅ Alpha Vantage LIVE API integration for forex rates
- ✅ Data caching (5 minute TTL)

## API Endpoints
- `/api/risk-sentiment/{currency}` - Live risk calculation
- `/api/trade-flows/{currency}` - Export/import data
- `/api/insights/{currency}` - Bank insights
- `/api/fed-data/{currency}` - Central bank data
- `/api/fed-events/{currency}` - Economic calendar
- `/api/recent-news/{currency}` - Market news
- `/api/yield-reactions/{currency}` - Yield changes
- `/api/fedwatch/{currency}` - Rate probabilities
- `/api/labor-market/{currency}` - Employment data
- `/api/inflation/{currency}` - CPI data
- `/api/seasonality/{currency}` - Monthly patterns
- `/api/currency-strength/{base_currency}` - LIVE strength index
- `/api/currency-heatmap/{base_currency}` - Strength heatmap
- `/api/forex/rates/{base_currency}` - LIVE forex rates
- `/api/forex/chart/{from}/{to}` - Historical forex data
- `/api/market-status` - Market hours status

## Alpha Vantage Integration
- **Endpoints Used**: CURRENCY_EXCHANGE_RATE, FX_DAILY, GLOBAL_QUOTE
- **Caching**: 5 minute TTL to respect rate limits
- **Fallback**: Mock data when API limit reached
- **Free Tier**: 25 requests/day, 5 requests/minute

## Prioritized Backlog

### P0 (Critical) - Completed
- [x] All 12+ widgets rendering
- [x] Currency selector functional
- [x] View button modal expansion
- [x] Auto-refresh (5 min default)
- [x] Live Alpha Vantage data

### P1 (High Priority) - Future
- [ ] WebSocket for real-time push updates
- [ ] User preferences persistence (localStorage)
- [ ] More detailed economic calendar

### P2 (Medium Priority) - Future
- [ ] Custom watchlists
- [ ] Alert notifications
- [ ] Historical data comparison views
- [ ] Export to PDF/CSV

## Technical Notes
- Alpha Vantage free tier: 25 requests/day
- Data cached for 5 minutes
- Currency strength calculated from live forex pairs
- Fallback to mock data when API unavailable

## Next Tasks
1. Consider upgrading to Alpha Vantage premium ($49/month) for more requests
2. Add WebSocket for real-time push updates
3. Implement user authentication for personalized views
