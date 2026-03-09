import React, { useState, useEffect, useCallback } from "react";
import "@/App.css";
import axios from "axios";
import {
  Settings,
  Zap,
  Home,
  BarChart3,
  Globe,
  Calendar,
  Newspaper,
  TrendingUp,
  Target,
  PieChart,
  RefreshCw,
  Filter,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
} from "recharts";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CURRENCIES = ["USD", "GBP", "EUR", "CAD", "AUD", "NZD", "JPY", "CHF"];

// Sidebar Component
const Sidebar = () => {
  const icons = [
    { Icon: Settings, active: false },
    { Icon: Home, active: true },
    { Icon: BarChart3, active: false },
    { Icon: Globe, active: false },
    { Icon: Target, active: false },
    { Icon: PieChart, active: false },
    { Icon: Calendar, active: false },
    { Icon: Newspaper, active: false },
  ];

  return (
    <div className="sidebar" data-testid="sidebar">
      <div className="sidebar-icon settings-icon">
        <Settings size={18} />
      </div>
      {icons.slice(1).map(({ Icon, active }, index) => (
        <div
          key={index}
          className={`sidebar-icon ${active ? "active" : ""}`}
          data-testid={`sidebar-icon-${index}`}
        >
          <Icon size={18} />
        </div>
      ))}
    </div>
  );
};

// Header Component
const Header = ({ selectedCurrency, onCurrencyChange }) => {
  return (
    <header className="dashboard-header" data-testid="dashboard-header">
      <div className="header-left">
        <h1 className="logo">Macro Hub</h1>
        <span className="badge live">LIVE</span>
        <span className="badge bias">Bias</span>
      </div>
      <div className="currency-selector" data-testid="currency-selector">
        {CURRENCIES.map((currency) => (
          <button
            key={currency}
            className={`currency-btn ${selectedCurrency === currency ? "active" : ""}`}
            onClick={() => onCurrencyChange(currency)}
            data-testid={`currency-btn-${currency}`}
          >
            {currency}
          </button>
        ))}
      </div>
    </header>
  );
};

// Widget Card Component
const WidgetCard = ({ title, icon, children, actions, className = "" }) => {
  return (
    <div className={`widget-card ${className}`} data-testid={`widget-${title?.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="widget-header">
        <div className="widget-title">
          {icon && <span className="widget-icon">{icon}</span>}
          <span>{title}</span>
        </div>
        <div className="widget-actions">{actions}</div>
      </div>
      <div className="widget-content">{children}</div>
    </div>
  );
};

// Risk Sentiment Gauge
const RiskSentimentGauge = ({ value, label }) => {
  const rotation = (value / 100) * 180 - 90;
  
  return (
    <div className="risk-gauge" data-testid="risk-sentiment-gauge">
      <div className="gauge-labels">
        <span className="label-left">RISK OFF</span>
        <span className="label-right">RISK ON</span>
      </div>
      <div className="gauge-container">
        <svg viewBox="0 0 200 120" className="gauge-svg">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Colored arc segments */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 35"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 60 35 A 80 80 0 0 1 140 35"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 140 35 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#ec4899"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
        <div className="gauge-center">
          <div className="gauge-label">RISK SENTIMENT</div>
          <div className="gauge-value">{value}%</div>
          <div className="gauge-bolt">
            <Zap size={20} fill="#8b5cf6" color="#8b5cf6" />
          </div>
        </div>
        <div 
          className="gauge-needle" 
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      <div className="gauge-range">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

// Trade Flows Component
const TradeFlows = ({ data }) => {
  const [activeTab, setActiveTab] = useState("exports");

  const items = activeTab === "exports" ? data?.exports : data?.imports;

  return (
    <div className="trade-flows" data-testid="trade-flows">
      <div className="trade-tabs">
        <button
          className={`trade-tab ${activeTab === "exports" ? "active" : ""}`}
          onClick={() => setActiveTab("exports")}
          data-testid="trade-tab-exports"
        >
          <Zap size={14} /> EXPORTS
        </button>
        <button
          className={`trade-tab ${activeTab === "imports" ? "active" : ""}`}
          onClick={() => setActiveTab("imports")}
          data-testid="trade-tab-imports"
        >
          <Zap size={14} /> IMPORTS
        </button>
      </div>
      <div className="trade-items">
        {items?.map((item, index) => (
          <div key={index} className="trade-item">
            <div className="trade-info">
              <span className="trade-sector">{item.sector}</span>
              <span className="trade-values">
                <span className="trade-value">${item.value}B</span>
                <span className="trade-percentage">{item.percentage}%</span>
              </span>
            </div>
            <span className="trade-rank">Rank #{item.rank}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Insights Component
const Insights = ({ insights }) => {
  return (
    <div className="insights-list" data-testid="insights-list">
      {insights?.map((insight, index) => (
        <div key={index} className="insight-item">
          <div className="insight-header">
            <span className="insight-source">{insight.source}</span>
            <span className={`sentiment-badge ${insight.sentiment?.toLowerCase().includes("bullish") ? "bullish" : "bearish"}`}>
              {insight.sentiment}
            </span>
            {insight.is_new && <span className="new-badge">New</span>}
          </div>
          <p className="insight-title">{insight.title}</p>
        </div>
      ))}
    </div>
  );
};

// FED Widget Component
const FedWidget = ({ data }) => {
  return (
    <div className="fed-widget" data-testid="fed-widget">
      <div className="fed-stance">
        <span className="stance-label">FED</span>
        <span className="stance-value">{data?.stance}</span>
      </div>
      <div className="fed-rate-section">
        <div className="rate-info">
          <span className="rate-label">RATE</span>
          <span className="rate-value">{data?.rate}</span>
        </div>
        <div className="rate-change">
          <span className="change-label">LAST</span>
          <span className="change-value">{data?.last_change}</span>
        </div>
      </div>
      <div className="fed-next-section">
        <div className="next-info">
          <span className="next-label">NEXT</span>
          <span className="next-date">{data?.next_date}</span>
        </div>
        <div className="hold-info">
          <span className="hold-label">HOLD %</span>
          <span className="hold-value">{data?.hold_probability}%</span>
        </div>
      </div>
    </div>
  );
};

// Fed Events Component
const FedEvents = ({ events }) => {
  return (
    <div className="fed-events" data-testid="fed-events">
      {events?.map((event, index) => (
        <div key={index} className="event-item">
          <div className="event-info">
            <span className="event-name">{event.name}</span>
            <span className="event-datetime">
              <Calendar size={12} /> {event.date} at {event.time}
            </span>
          </div>
          <ChevronRight size={16} className="event-arrow" />
        </div>
      ))}
    </div>
  );
};

// Recent News Component
const RecentNews = ({ news }) => {
  return (
    <div className="recent-news" data-testid="recent-news">
      {news?.map((item, index) => (
        <div key={index} className="news-item">
          <div className="news-header">
            <span className="news-source">{item.source}</span>
            <span className={`sentiment-badge ${item.sentiment?.toLowerCase().includes("bullish") ? "bullish" : "bearish"}`}>
              {item.sentiment}
            </span>
            <span className="news-time">{item.time_ago}</span>
          </div>
          <p className="news-title">{item.title}</p>
        </div>
      ))}
    </div>
  );
};

// Yield Reactions Component
const YieldReactions = ({ reactions }) => {
  return (
    <div className="yield-reactions" data-testid="yield-reactions">
      {reactions?.map((reaction, index) => (
        <div key={index} className="reaction-item">
          <div className="reaction-event">
            <span className="event-name">{reaction.event}</span>
            <span className={`sentiment-badge ${reaction.sentiment?.toLowerCase() === "hawkish" ? "hawkish" : "dovish"}`}>
              {reaction.sentiment}
            </span>
          </div>
          <div className="reaction-yields">
            <span className="yield">2Y: {reaction.two_year}</span>
            <span className="yield">10Y: {reaction.ten_year}</span>
          </div>
          <span className="reaction-date">{reaction.date}</span>
        </div>
      ))}
    </div>
  );
};

// FedWatch Component
const FedWatch = ({ fedwatch }) => {
  return (
    <div className="fedwatch" data-testid="fedwatch">
      {fedwatch?.map((item, index) => (
        <div key={index} className="fedwatch-item">
          <span className="fedwatch-date">{item.date}</span>
          <div className="probability-bar">
            <div 
              className="prob-segment hold" 
              style={{ width: `${item.hold}%` }}
            >
              <span className="prob-label">Hold</span>
              <span className="prob-value">{item.hold}%</span>
            </div>
            {item.cut_25 > 0 && (
              <div 
                className="prob-segment cut25" 
                style={{ width: `${item.cut_25}%` }}
              >
                <span className="prob-label">Cut 25</span>
                <span className="prob-value">{item.cut_25}%</span>
              </div>
            )}
            {item.cut_50 && item.cut_50 > 0 && (
              <div 
                className="prob-segment cut50" 
                style={{ width: `${item.cut_50}%` }}
              >
                <span className="prob-value">{item.cut_50}%</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Labor Market Chart
const LaborMarketChart = ({ data }) => {
  return (
    <div className="chart-container" data-testid="labor-market-chart">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#888", fontSize: 10 }} 
            axisLine={{ stroke: "#2a2a2a" }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: "#888", fontSize: 10 }} 
            axisLine={{ stroke: "#2a2a2a" }}
            tickFormatter={(v) => `${v/1000}k`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#888", fontSize: 10 }} 
            axisLine={{ stroke: "#2a2a2a" }}
            domain={[4, 5]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="employment"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="unemployment"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Inflation Chart
const InflationChart = ({ data }) => {
  return (
    <div className="chart-container" data-testid="inflation-chart">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#888", fontSize: 9 }} 
            axisLine={{ stroke: "#2a2a2a" }}
          />
          <YAxis 
            tick={{ fill: "#888", fontSize: 10 }} 
            axisLine={{ stroke: "#2a2a2a" }}
            domain={[2.3, 3.1]}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
            labelStyle={{ color: "#fff" }}
            formatter={(value, name) => [value, name === "cpi" ? "CPI" : "Core"]}
          />
          <Line
            type="monotone"
            dataKey="cpi"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: "#8b5cf6", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="core"
            stroke="#ec4899"
            strokeWidth={2}
            dot={{ fill: "#ec4899", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Seasonality Chart
const SeasonalityChart = ({ data }) => {
  return (
    <div className="chart-container" data-testid="seasonality-chart">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: "#888", fontSize: 10 }} 
            axisLine={{ stroke: "#2a2a2a" }}
          />
          <YAxis 
            tick={{ fill: "#888", fontSize: 10 }} 
            axisLine={{ stroke: "#2a2a2a" }}
            domain={[-2, 2]}
          />
          <ReferenceLine y={0} stroke="#444" />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
            labelStyle={{ color: "#fff" }}
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data?.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value >= 0 ? "#8b5cf6" : "#ef4444"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Currency Strength Component
const CurrencyStrength = ({ currencies, timeframe, onTimeframeChange }) => {
  return (
    <div className="currency-strength" data-testid="currency-strength">
      <div className="strength-timeframes">
        {["1W", "2W", "1M"].map((tf) => (
          <button
            key={tf}
            className={`timeframe-btn ${timeframe === tf ? "active" : ""}`}
            onClick={() => onTimeframeChange(tf)}
          >
            {tf}
          </button>
        ))}
      </div>
      <div className="strength-bars">
        {currencies?.map((currency, index) => (
          <div key={index} className="strength-bar-item">
            <span className="currency-label">{currency.currency}</span>
            <div className="strength-bar-bg">
              <div 
                className={`strength-bar-fill ${currency.change >= 0 ? "positive" : "negative"}`}
                style={{ width: `${Math.abs(currency.strength)}%` }}
              />
            </div>
            <span className={`change-value ${currency.change >= 0 ? "positive" : "negative"}`}>
              {currency.change >= 0 ? "+" : ""}{currency.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Currency Heatmap Component
const CurrencyHeatmap = ({ heatmap, timeframes }) => {
  const currencies = heatmap ? Object.keys(heatmap) : [];
  
  const getColor = (value) => {
    if (value > 1.5) return "#22c55e";
    if (value > 0) return "#4ade80";
    if (value > -1.5) return "#ef4444";
    return "#dc2626";
  };

  return (
    <div className="currency-heatmap" data-testid="currency-heatmap">
      <div className="heatmap-header">
        <span></span>
        {timeframes?.map((tf) => (
          <span key={tf} className="tf-header">{tf}</span>
        ))}
      </div>
      {currencies.map((currency) => (
        <div key={currency} className="heatmap-row">
          <span className="heatmap-currency">{currency}</span>
          {timeframes?.map((tf) => (
            <span 
              key={tf} 
              className="heatmap-cell"
              style={{ backgroundColor: getColor(heatmap[currency][tf]) }}
            >
              {heatmap[currency][tf]?.toFixed(1)}%
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [strengthTimeframe, setStrengthTimeframe] = useState("2W");
  
  // Data states
  const [riskSentiment, setRiskSentiment] = useState({ value: 37, label: "Risk Off" });
  const [tradeFlows, setTradeFlows] = useState(null);
  const [insights, setInsights] = useState([]);
  const [fedData, setFedData] = useState(null);
  const [fedEvents, setFedEvents] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [yieldReactions, setYieldReactions] = useState([]);
  const [fedwatch, setFedwatch] = useState([]);
  const [laborMarket, setLaborMarket] = useState([]);
  const [inflation, setInflation] = useState([]);
  const [seasonality, setSeasonality] = useState([]);
  const [currencyStrength, setCurrencyStrength] = useState([]);
  const [currencyHeatmap, setCurrencyHeatmap] = useState({ heatmap: {}, timeframes: [] });

  const fetchAllData = useCallback(async (currency) => {
    setLoading(true);
    try {
      const [
        riskRes,
        tradeRes,
        insightsRes,
        fedRes,
        eventsRes,
        newsRes,
        yieldsRes,
        fedwatchRes,
        laborRes,
        inflationRes,
        seasonalityRes,
        strengthRes,
        heatmapRes,
      ] = await Promise.all([
        axios.get(`${API}/risk-sentiment/${currency}`),
        axios.get(`${API}/trade-flows/${currency}`),
        axios.get(`${API}/insights/${currency}`),
        axios.get(`${API}/fed-data/${currency}`),
        axios.get(`${API}/fed-events/${currency}`),
        axios.get(`${API}/recent-news/${currency}`),
        axios.get(`${API}/yield-reactions/${currency}`),
        axios.get(`${API}/fedwatch/${currency}`),
        axios.get(`${API}/labor-market/${currency}`),
        axios.get(`${API}/inflation/${currency}`),
        axios.get(`${API}/seasonality/${currency}`),
        axios.get(`${API}/currency-strength/${currency}`),
        axios.get(`${API}/currency-heatmap/${currency}`),
      ]);

      setRiskSentiment(riskRes.data);
      setTradeFlows(tradeRes.data);
      setInsights(insightsRes.data.insights);
      setFedData(fedRes.data);
      setFedEvents(eventsRes.data.events);
      setRecentNews(newsRes.data.news);
      setYieldReactions(yieldsRes.data.reactions);
      setFedwatch(fedwatchRes.data.fedwatch);
      setLaborMarket(laborRes.data.data);
      setInflation(inflationRes.data.data);
      setSeasonality(seasonalityRes.data.data);
      setCurrencyStrength(strengthRes.data.currencies);
      setCurrencyHeatmap(heatmapRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData(selectedCurrency);
  }, [selectedCurrency, fetchAllData]);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  return (
    <div className="dashboard" data-testid="macro-hub-dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header 
          selectedCurrency={selectedCurrency} 
          onCurrencyChange={handleCurrencyChange}
        />
        
        {loading ? (
          <div className="loading-overlay" data-testid="loading-overlay">
            <RefreshCw className="spin" size={32} />
            <span>Loading data...</span>
          </div>
        ) : (
          <div className="dashboard-grid">
            {/* Row 1 */}
            <WidgetCard 
              title="RISK SENTIMENT" 
              icon={<Zap size={14} />}
              actions={<button className="view-btn">View <RefreshCw size={12} /></button>}
              className="risk-sentiment-card"
            >
              <RiskSentimentGauge value={riskSentiment.value} label={riskSentiment.label} />
            </WidgetCard>

            <WidgetCard 
              title="TRADE FLOWS" 
              icon={<Zap size={14} />}
              actions={<button className="view-btn">View</button>}
              className="trade-flows-card"
            >
              <TradeFlows data={tradeFlows} />
            </WidgetCard>

            <WidgetCard 
              title="INSIGHTS" 
              icon={<Zap size={14} />}
              actions={
                <>
                  <Settings size={14} className="action-icon" />
                  <button className="view-btn">View</button>
                </>
              }
              className="insights-card"
            >
              <Insights insights={insights} />
            </WidgetCard>

            <WidgetCard 
              title="FED" 
              actions={
                <>
                  <Settings size={14} className="action-icon" />
                  <button className="view-btn">View</button>
                </>
              }
              className="fed-card"
            >
              <FedWidget data={fedData} />
            </WidgetCard>

            {/* Row 2 */}
            <WidgetCard 
              title="FED EVENTS" 
              icon={<Zap size={14} />}
              actions={<button className="view-btn">View</button>}
              className="fed-events-card"
            >
              <FedEvents events={fedEvents} />
            </WidgetCard>

            <WidgetCard 
              title="RECENT NEWS" 
              icon={<Zap size={14} />}
              actions={
                <>
                  <button className="view-btn">View</button>
                  <Filter size={14} className="action-icon" />
                </>
              }
              className="recent-news-card"
            >
              <RecentNews news={recentNews} />
            </WidgetCard>

            <WidgetCard 
              title="YIELD REACTIONS" 
              icon={<Zap size={14} />}
              actions={
                <>
                  <Settings size={14} className="action-icon" />
                  <button className="view-btn">View</button>
                </>
              }
              className="yield-reactions-card"
            >
              <YieldReactions reactions={yieldReactions} />
            </WidgetCard>

            <WidgetCard 
              title="FEDWATCH" 
              icon={<Zap size={14} />}
              actions={<button className="view-btn">View</button>}
              className="fedwatch-card"
            >
              <FedWatch fedwatch={fedwatch} />
            </WidgetCard>

            {/* Row 3 - Charts */}
            <WidgetCard 
              title="LABOR MARKET" 
              icon={<BarChart3 size={14} />}
              actions={
                <>
                  <Settings size={14} className="action-icon" />
                  <button className="view-btn">View</button>
                </>
              }
              className="labor-market-card"
            >
              <LaborMarketChart data={laborMarket} />
            </WidgetCard>

            <WidgetCard 
              title="INFLATION" 
              icon={<Zap size={14} />}
              actions={
                <>
                  <Settings size={14} className="action-icon" />
                  <button className="view-btn">View</button>
                </>
              }
              className="inflation-card"
            >
              <InflationChart data={inflation} />
            </WidgetCard>

            <WidgetCard 
              title="SEASONALITY" 
              icon={<Zap size={14} />}
              actions={<button className="view-btn">View</button>}
              className="seasonality-card"
            >
              <SeasonalityChart data={seasonality} />
            </WidgetCard>

            {/* Row 4 */}
            <WidgetCard 
              title="CURRENCY STRENGTH INDEX" 
              icon={<Zap size={14} />}
              actions={<button className="view-btn">View</button>}
              className="currency-strength-card"
            >
              <CurrencyStrength 
                currencies={currencyStrength}
                timeframe={strengthTimeframe}
                onTimeframeChange={setStrengthTimeframe}
              />
            </WidgetCard>

            <WidgetCard 
              title="CURRENCY STRENGTH HEATMAP" 
              icon={<Zap size={14} />}
              actions={<button className="view-btn">View</button>}
              className="currency-heatmap-card"
            >
              <CurrencyHeatmap 
                heatmap={currencyHeatmap.heatmap}
                timeframes={currencyHeatmap.timeframes}
              />
            </WidgetCard>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
