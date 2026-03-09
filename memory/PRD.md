# Macro Hub - Financial Dashboard PRD

## Original Problem Statement
Build a Macro Hub financial dashboard similar to provided screenshots with multiple widgets for financial data visualization. Currency selector (USD, GBP, EUR, CAD, AUD, NZD, JPY, CHF) should filter/change all data. Skip Live Bloomberg TV widget.

## Architecture
- **Frontend**: React with Recharts for data visualization
- **Backend**: FastAPI with Alpha Vantage integration
- **Database**: MongoDB (available but not heavily used for this dashboard)
- **API Integration**: Alpha Vantage for forex rates (with mock data fallback)

## User Personas
1. **Financial Analysts** - Monitor macroeconomic indicators across currencies
2. **Traders** - Track risk sentiment, Fed events, and yield reactions
3. **Economists** - Analyze inflation, labor market, and seasonality patterns

## Core Requirements (Static)
- Dark theme dashboard matching provided design
- 12+ financial widgets with live data
- Currency selector that filters all widget data
- Expandable modals for detailed views
- Responsive layout

## What's Been Implemented ✅
**Date: January 2026**

### Widgets Completed:
1. ✅ Risk Sentiment Gauge (0-100%)
2. ✅ Trade Flows (Exports/Imports tabs)
3. ✅ Insights (Bank analyses with sentiment badges)
4. ✅ FED Data (Rate, stance, next meeting, hold probability)
5. ✅ Fed Events (Upcoming economic events)
6. ✅ Recent News (News with sentiment indicators)
7. ✅ Yield Reactions (Fed event yield changes)
8. ✅ FedWatch (Rate probability bars)
9. ✅ Labor Market Chart (Dual-axis line chart)
10. ✅ Inflation Chart (CPI & Core inflation)
11. ✅ Seasonality Chart (Monthly bar chart)
12. ✅ Currency Strength Index (Strength bars)
13. ✅ Currency Strength Heatmap (Color-coded grid)

### Features Completed:
- ✅ Currency selector with 8 currencies (functional, changes all data)
- ✅ Sidebar navigation
- ✅ View buttons open expanded modals
- ✅ Responsive design
- ✅ Alpha Vantage API integration for forex rates
- ✅ Mock data for Fed/economic indicators

## API Endpoints
- `/api/risk-sentiment/{currency}`
- `/api/trade-flows/{currency}`
- `/api/insights/{currency}`
- `/api/fed-data/{currency}`
- `/api/fed-events/{currency}`
- `/api/recent-news/{currency}`
- `/api/yield-reactions/{currency}`
- `/api/fedwatch/{currency}`
- `/api/labor-market/{currency}`
- `/api/inflation/{currency}`
- `/api/seasonality/{currency}`
- `/api/currency-strength/{base_currency}`
- `/api/currency-heatmap/{base_currency}`

## Prioritized Backlog

### P0 (Critical) - Completed
- [x] All 12+ widgets rendering
- [x] Currency selector functional
- [x] View button modal expansion

### P1 (High Priority) - Future
- [ ] Real-time data refresh with WebSocket
- [ ] User preferences persistence
- [ ] More detailed economic calendar

### P2 (Medium Priority) - Future
- [ ] Custom watchlists
- [ ] Alert notifications
- [ ] Historical data comparison views

## Technical Notes
- Alpha Vantage free tier: 25 requests/day
- Most data is mock due to API limitations
- Forex rates cached for 15 minutes

## Next Tasks
1. Consider upgrading to premium data providers for real-time feeds
2. Add auto-refresh functionality
3. Implement user authentication for personalized views
