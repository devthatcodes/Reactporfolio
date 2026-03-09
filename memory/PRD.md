# Macro Hub - Financial Dashboard PRD

## Original Problem Statement
Build a Macro Hub financial dashboard with multiple widgets for financial data visualization. Currency selector should filter/change all data. Auto-refresh every 5 minutes. Live data with Alpha Vantage. WebSocket for real-time updates.

## Architecture
- **Frontend**: React with Recharts, WebSocket client
- **Backend**: FastAPI with WebSocket support, Alpha Vantage integration
- **Database**: MongoDB (available)
- **Real-time**: WebSocket pushes updates every 30 seconds
- **API Integration**: Alpha Vantage for live forex rates

## What's Been Implemented ✅
**Date: January 2026**

### Core Features:
- ✅ 13 Financial widgets with expandable modals
- ✅ Currency selector (8 currencies) - functional data filtering
- ✅ **WebSocket real-time updates** (30-second push interval)
- ✅ Auto-refresh fallback (configurable: 1, 5, 10, 15 min)
- ✅ Live connection status indicator (WiFi icon)
- ✅ Alpha Vantage live forex integration
- ✅ Data caching (5 min TTL)

### Widgets:
1. Risk Sentiment Gauge (real-time via WebSocket)
2. Trade Flows (Exports/Imports)
3. Insights (Bank analyses)
4. FED Data (Central bank info)
5. Fed Events (7 economic events)
6. Recent News (5 items with sentiment)
7. Yield Reactions (5 Fed events)
8. FedWatch (Rate probabilities)
9. Labor Market Chart
10. Inflation Chart
11. Seasonality Chart
12. Currency Strength Index (real-time via WebSocket)
13. Currency Strength Heatmap

### WebSocket Features:
- `/api/ws/{currency}` - Real-time data endpoint
- Auto-reconnect on disconnect (5 second delay)
- Subscription switching when currency changes
- Push updates every 30 seconds
- Ping/pong keepalive
- Graceful fallback to REST polling

### API Endpoints:
- REST: 15+ endpoints for all data types
- WebSocket: `/api/ws/{currency}` for real-time
- Market status: `/api/market-status`

## Technical Stack
- FastAPI + WebSocket
- React 19 + Recharts
- Alpha Vantage API (free tier: 25 req/day)
- 5-minute data caching

## Backlog

### P1 (High Priority) - Future
- [ ] Price alerts & notifications
- [ ] User preferences persistence
- [ ] More economic indicators

### P2 (Medium Priority) - Future
- [ ] Custom watchlists
- [ ] Export to PDF/CSV
- [ ] Historical comparison views

## Notes
- WebSocket pushes risk sentiment & currency strength in real-time
- Other data (news, fed events, etc.) refreshes via REST on demand
- Alpha Vantage rate limits handled with caching + fallback data
