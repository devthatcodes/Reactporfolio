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
  X,
  Maximize2,
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
const Header = ({ 
  selectedCurrency, 
  onCurrencyChange, 
  autoRefresh, 
  setAutoRefresh, 
  refreshInterval,
  setRefreshInterval,
  lastUpdated,
  onManualRefresh 
}) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="dashboard-header" data-testid="dashboard-header">
      <div className="header-left">
        <h1 className="logo">Macro Hub</h1>
        <span className="badge live">LIVE</span>
        <span className="badge bias">Bias</span>
      </div>
      <div className="header-center">
        <div className="refresh-controls" data-testid="refresh-controls">
          <button 
            className={`refresh-toggle ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
            data-testid="auto-refresh-toggle"
          >
            <RefreshCw size={14} className={autoRefresh ? 'spin-slow' : ''} />
            Auto
          </button>
          <select 
            className="refresh-interval"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            data-testid="refresh-interval-select"
          >
            <option value={60}>1 min</option>
            <option value={300}>5 min</option>
            <option value={600}>10 min</option>
            <option value={900}>15 min</option>
          </select>
          <button 
            className="manual-refresh"
            onClick={onManualRefresh}
            data-testid="manual-refresh-btn"
          >
            <RefreshCw size={14} />
          </button>
          <span className="last-updated">
            Updated: {formatTime(lastUpdated)}
          </span>
        </div>
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
const WidgetCard = ({ title, icon, children, actions, className = "", onViewClick }) => {
  return (
    <div className={`widget-card ${className}`} data-testid={`widget-${title?.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="widget-header">
        <div className="widget-title">
          {icon && <span className="widget-icon">{icon}</span>}
          <span>{title}</span>
        </div>
        <div className="widget-actions">
          {actions}
          {onViewClick && (
            <button className="view-btn" onClick={onViewClick} data-testid={`view-btn-${title?.toLowerCase().replace(/\s+/g, "-")}`}>
              View <Maximize2 size={12} />
            </button>
          )}
        </div>
      </div>
      <div className="widget-content">{children}</div>
    </div>
  );
};

// Modal Component for expanded view
const ExpandedModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="expanded-modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Zap size={16} className="modal-icon" />
            <span>{title}</span>
          </div>
          <button className="modal-close" onClick={onClose} data-testid="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Risk Sentiment Gauge
const RiskSentimentGauge = ({ value, label, expanded }) => {
  const rotation = (value / 100) * 180 - 90;
  const size = expanded ? 280 : 180;
  
  return (
    <div className={`risk-gauge ${expanded ? 'expanded' : ''}`} data-testid="risk-sentiment-gauge">
      <div className="gauge-labels">
        <span className="label-left">RISK OFF</span>
        <span className="label-right">RISK ON</span>
      </div>
      <div className="gauge-container" style={expanded ? { width: size, height: size * 0.55 } : {}}>
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
          <div className="gauge-value" style={expanded ? { fontSize: '48px' } : {}}>{value}%</div>
          <div className="gauge-bolt">
            <Zap size={expanded ? 28 : 20} fill="#8b5cf6" color="#8b5cf6" />
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
const TradeFlows = ({ data, expanded }) => {
  const [activeTab, setActiveTab] = useState("exports");

  const items = activeTab === "exports" ? data?.exports : data?.imports;

  return (
    <div className={`trade-flows ${expanded ? 'expanded' : ''}`} data-testid="trade-flows">
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
          <div key={index} className={`trade-item ${expanded ? 'expanded' : ''}`}>
            <div className="trade-info">
              <span className="trade-sector" style={expanded ? { fontSize: '16px' } : {}}>{item.sector}</span>
              <span className="trade-values">
                <span className="trade-value" style={expanded ? { fontSize: '14px' } : {}}>${item.value}B</span>
                <span className="trade-percentage" style={expanded ? { fontSize: '14px' } : {}}>{item.percentage}%</span>
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
const Insights = ({ insights, expanded }) => {
  return (
    <div className={`insights-list ${expanded ? 'expanded' : ''}`} data-testid="insights-list">
      {insights?.map((insight, index) => (
        <div key={index} className={`insight-item ${expanded ? 'expanded' : ''}`}>
          <div className="insight-header">
            <span className="insight-source" style={expanded ? { fontSize: '14px' } : {}}>{insight.source}</span>
            <span className={`sentiment-badge ${insight.sentiment?.toLowerCase().includes("bullish") ? "bullish" : "bearish"}`}>
              {insight.sentiment}
            </span>
            {insight.is_new && <span className="new-badge">New</span>}
          </div>
          <p className="insight-title" style={expanded ? { fontSize: '14px' } : {}}>{insight.title}</p>
        </div>
      ))}
    </div>
  );
};

// FED Widget Component
const FedWidget = ({ data, expanded }) => {
  return (
    <div className={`fed-widget ${expanded ? 'expanded' : ''}`} data-testid="fed-widget">
      <div className="fed-stance">
        <span className="stance-label" style={expanded ? { fontSize: '18px' } : {}}>FED</span>
        <span className="stance-value" style={expanded ? { fontSize: '16px' } : {}}>{data?.stance}</span>
      </div>
      <div className="fed-rate-section">
        <div className="rate-info">
          <span className="rate-label">RATE</span>
          <span className="rate-value" style={expanded ? { fontSize: '36px' } : {}}>{data?.rate}</span>
        </div>
        <div className="rate-change">
          <span className="change-label">LAST</span>
          <span className="change-value" style={expanded ? { fontSize: '20px' } : {}}>{data?.last_change}</span>
        </div>
      </div>
      <div className="fed-next-section">
        <div className="next-info">
          <span className="next-label">NEXT</span>
          <span className="next-date" style={expanded ? { fontSize: '20px' } : {}}>{data?.next_date}</span>
        </div>
        <div className="hold-info">
          <span className="hold-label">HOLD %</span>
          <span className="hold-value" style={expanded ? { fontSize: '28px' } : {}}>{data?.hold_probability}%</span>
        </div>
      </div>
    </div>
  );
};

// Fed Events Component
const FedEvents = ({ events, expanded }) => {
  return (
    <div className={`fed-events ${expanded ? 'expanded' : ''}`} data-testid="fed-events">
      {events?.map((event, index) => (
        <div key={index} className={`event-item ${expanded ? 'expanded' : ''}`}>
          <div className="event-info">
            <span className="event-name" style={expanded ? { fontSize: '14px' } : {}}>{event.name}</span>
            <span className="event-datetime" style={expanded ? { fontSize: '13px' } : {}}>
              <Calendar size={expanded ? 14 : 12} /> {event.date} at {event.time}
            </span>
          </div>
          <ChevronRight size={expanded ? 20 : 16} className="event-arrow" />
        </div>
      ))}
    </div>
  );
};

// Recent News Component
const RecentNews = ({ news, expanded }) => {
  return (
    <div className={`recent-news ${expanded ? 'expanded' : ''}`} data-testid="recent-news">
      {news?.map((item, index) => (
        <div key={index} className={`news-item ${expanded ? 'expanded' : ''}`}>
          <div className="news-header">
            <span className="news-source" style={expanded ? { fontSize: '14px' } : {}}>{item.source}</span>
            <span className={`sentiment-badge ${item.sentiment?.toLowerCase().includes("bullish") ? "bullish" : "bearish"}`}>
              {item.sentiment}
            </span>
            <span className="news-time">{item.time_ago}</span>
          </div>
          <p className="news-title" style={expanded ? { fontSize: '14px' } : {}}>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

// Yield Reactions Component
const YieldReactions = ({ reactions, expanded }) => {
  return (
    <div className={`yield-reactions ${expanded ? 'expanded' : ''}`} data-testid="yield-reactions">
      {reactions?.map((reaction, index) => (
        <div key={index} className={`reaction-item ${expanded ? 'expanded' : ''}`}>
          <div className="reaction-event">
            <span className="event-name" style={expanded ? { fontSize: '14px' } : {}}>{reaction.event}</span>
            <span className={`sentiment-badge ${reaction.sentiment?.toLowerCase() === "hawkish" ? "hawkish" : "dovish"}`}>
              {reaction.sentiment}
            </span>
          </div>
          <div className="reaction-yields">
            <span className="yield" style={expanded ? { fontSize: '13px' } : {}}>2Y: {reaction.two_year}</span>
            <span className="yield" style={expanded ? { fontSize: '13px' } : {}}>10Y: {reaction.ten_year}</span>
          </div>
          <span className="reaction-date">{reaction.date}</span>
        </div>
      ))}
    </div>
  );
};

// FedWatch Component
const FedWatch = ({ fedwatch, expanded }) => {
  return (
    <div className={`fedwatch ${expanded ? 'expanded' : ''}`} data-testid="fedwatch">
      {fedwatch?.map((item, index) => (
        <div key={index} className={`fedwatch-item ${expanded ? 'expanded' : ''}`}>
          <span className="fedwatch-date" style={expanded ? { fontSize: '14px' } : {}}>{item.date}</span>
          <div className="probability-bar" style={expanded ? { height: '28px' } : {}}>
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
const LaborMarketChart = ({ data, expanded }) => {
  const chartHeight = expanded ? 400 : 200;
  
  return (
    <div className={`chart-container ${expanded ? 'expanded' : ''}`} data-testid="labor-market-chart" style={expanded ? { height: chartHeight } : {}}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#888", fontSize: expanded ? 12 : 10 }} 
            axisLine={{ stroke: "#2a2a2a" }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: "#888", fontSize: expanded ? 12 : 10 }} 
            axisLine={{ stroke: "#2a2a2a" }}
            tickFormatter={(v) => `${v/1000}k`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: "#888", fontSize: expanded ? 12 : 10 }} 
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
            strokeWidth={expanded ? 3 : 2}
            dot={expanded}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="unemployment"
            stroke="#8b5cf6"
            strokeWidth={expanded ? 3 : 2}
            dot={expanded}
          />
        </LineChart>
      </ResponsiveContainer>
      {expanded && (
        <div className="chart-legend">
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>Employment</div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></span>Unemployment Rate</div>
        </div>
      )}
    </div>
  );
};

// Inflation Chart
const InflationChart = ({ data, expanded }) => {
  const chartHeight = expanded ? 400 : 200;
  
  return (
    <div className={`chart-container ${expanded ? 'expanded' : ''}`} data-testid="inflation-chart" style={expanded ? { height: chartHeight } : {}}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "#888", fontSize: expanded ? 11 : 9 }} 
            axisLine={{ stroke: "#2a2a2a" }}
          />
          <YAxis 
            tick={{ fill: "#888", fontSize: expanded ? 12 : 10 }} 
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
            strokeWidth={expanded ? 3 : 2}
            dot={{ fill: "#8b5cf6", r: expanded ? 6 : 4 }}
          />
          <Line
            type="monotone"
            dataKey="core"
            stroke="#ec4899"
            strokeWidth={expanded ? 3 : 2}
            dot={{ fill: "#ec4899", r: expanded ? 6 : 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      {expanded && (
        <div className="chart-legend">
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></span>CPI</div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#ec4899' }}></span>Core Inflation</div>
        </div>
      )}
    </div>
  );
};

// Seasonality Chart
const SeasonalityChart = ({ data, expanded }) => {
  const chartHeight = expanded ? 400 : 200;
  
  return (
    <div className={`chart-container ${expanded ? 'expanded' : ''}`} data-testid="seasonality-chart" style={expanded ? { height: chartHeight } : {}}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: "#888", fontSize: expanded ? 12 : 10 }} 
            axisLine={{ stroke: "#2a2a2a" }}
          />
          <YAxis 
            tick={{ fill: "#888", fontSize: expanded ? 12 : 10 }} 
            axisLine={{ stroke: "#2a2a2a" }}
            domain={[-2, 2]}
          />
          <ReferenceLine y={0} stroke="#444" />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
            labelStyle={{ color: "#fff" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data?.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.value >= 0 ? "#8b5cf6" : "#ef4444"} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {expanded && (
        <div className="chart-legend">
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></span>Positive Seasonality</div>
          <div className="legend-item"><span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>Negative Seasonality</div>
        </div>
      )}
    </div>
  );
};

// Currency Strength Component
const CurrencyStrength = ({ currencies, timeframe, onTimeframeChange, expanded }) => {
  return (
    <div className={`currency-strength ${expanded ? 'expanded' : ''}`} data-testid="currency-strength">
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
          <div key={index} className={`strength-bar-item ${expanded ? 'expanded' : ''}`}>
            <span className="currency-label" style={expanded ? { fontSize: '14px', width: '45px' } : {}}>{currency.currency}</span>
            <div className="strength-bar-bg" style={expanded ? { height: '10px' } : {}}>
              <div 
                className={`strength-bar-fill ${currency.change >= 0 ? "positive" : "negative"}`}
                style={{ width: `${Math.abs(currency.strength)}%` }}
              />
            </div>
            <span className={`change-value ${currency.change >= 0 ? "positive" : "negative"}`} style={expanded ? { fontSize: '13px', width: '55px' } : {}}>
              {currency.change >= 0 ? "+" : ""}{currency.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Currency Heatmap Component
const CurrencyHeatmap = ({ heatmap, timeframes, expanded }) => {
  const currencies = heatmap ? Object.keys(heatmap) : [];
  
  const getColor = (value) => {
    if (value > 1.5) return "#22c55e";
    if (value > 0) return "#4ade80";
    if (value > -1.5) return "#ef4444";
    return "#dc2626";
  };

  return (
    <div className={`currency-heatmap ${expanded ? 'expanded' : ''}`} data-testid="currency-heatmap">
      <div className="heatmap-header" style={expanded ? { gridTemplateColumns: '60px repeat(3, 1fr)' } : {}}>
        <span></span>
        {timeframes?.map((tf) => (
          <span key={tf} className="tf-header" style={expanded ? { fontSize: '14px' } : {}}>{tf}</span>
        ))}
      </div>
      {currencies.map((currency) => (
        <div key={currency} className="heatmap-row" style={expanded ? { gridTemplateColumns: '60px repeat(3, 1fr)' } : {}}>
          <span className="heatmap-currency" style={expanded ? { fontSize: '14px' } : {}}>{currency}</span>
          {timeframes?.map((tf) => (
            <span 
              key={tf} 
              className="heatmap-cell"
              style={{ 
                backgroundColor: getColor(heatmap[currency][tf]),
                padding: expanded ? '12px' : '6px',
                fontSize: expanded ? '13px' : '9px'
              }}
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
  const [expandedWidget, setExpandedWidget] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshInterval, setRefreshInterval] = useState(300); // 5 minutes in seconds
  
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

  const fetchAllData = useCallback(async (currency, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
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
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAllData(selectedCurrency);
  }, [selectedCurrency, fetchAllData]);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchAllData(selectedCurrency, true);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, selectedCurrency, fetchAllData]);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  const openExpandedView = (widgetName) => {
    setExpandedWidget(widgetName);
  };

  const closeExpandedView = () => {
    setExpandedWidget(null);
  };

  const handleManualRefresh = () => {
    fetchAllData(selectedCurrency, true);
  };

  // Expanded content renderers
  const renderExpandedContent = () => {
    switch (expandedWidget) {
      case "risk-sentiment":
        return <RiskSentimentGauge value={riskSentiment.value} label={riskSentiment.label} expanded />;
      case "trade-flows":
        return <TradeFlows data={tradeFlows} expanded />;
      case "insights":
        return <Insights insights={insights} expanded />;
      case "fed":
        return <FedWidget data={fedData} expanded />;
      case "fed-events":
        return <FedEvents events={fedEvents} expanded />;
      case "recent-news":
        return <RecentNews news={recentNews} expanded />;
      case "yield-reactions":
        return <YieldReactions reactions={yieldReactions} expanded />;
      case "fedwatch":
        return <FedWatch fedwatch={fedwatch} expanded />;
      case "labor-market":
        return <LaborMarketChart data={laborMarket} expanded />;
      case "inflation":
        return <InflationChart data={inflation} expanded />;
      case "seasonality":
        return <SeasonalityChart data={seasonality} expanded />;
      case "currency-strength":
        return <CurrencyStrength currencies={currencyStrength} timeframe={strengthTimeframe} onTimeframeChange={setStrengthTimeframe} expanded />;
      case "currency-heatmap":
        return <CurrencyHeatmap heatmap={currencyHeatmap.heatmap} timeframes={currencyHeatmap.timeframes} expanded />;
      default:
        return null;
    }
  };

  const getExpandedTitle = () => {
    const titles = {
      "risk-sentiment": "RISK SENTIMENT",
      "trade-flows": "TRADE FLOWS",
      "insights": "INSIGHTS",
      "fed": "FED",
      "fed-events": "FED EVENTS",
      "recent-news": "RECENT NEWS",
      "yield-reactions": "YIELD REACTIONS",
      "fedwatch": "FEDWATCH",
      "labor-market": "LABOR MARKET",
      "inflation": "INFLATION",
      "seasonality": "SEASONALITY",
      "currency-strength": "CURRENCY STRENGTH INDEX",
      "currency-heatmap": "CURRENCY STRENGTH HEATMAP",
    };
    return titles[expandedWidget] || "";
  };

  return (
    <div className="dashboard" data-testid="macro-hub-dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Header 
          selectedCurrency={selectedCurrency} 
          onCurrencyChange={handleCurrencyChange}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          refreshInterval={refreshInterval}
          setRefreshInterval={setRefreshInterval}
          lastUpdated={lastUpdated}
          onManualRefresh={handleManualRefresh}
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
              actions={<RefreshCw size={12} className="action-icon" />}
              className="risk-sentiment-card"
              onViewClick={() => openExpandedView("risk-sentiment")}
            >
              <RiskSentimentGauge value={riskSentiment.value} label={riskSentiment.label} />
            </WidgetCard>

            <WidgetCard 
              title="TRADE FLOWS" 
              icon={<Zap size={14} />}
              className="trade-flows-card"
              onViewClick={() => openExpandedView("trade-flows")}
            >
              <TradeFlows data={tradeFlows} />
            </WidgetCard>

            <WidgetCard 
              title="INSIGHTS" 
              icon={<Zap size={14} />}
              actions={<Settings size={14} className="action-icon" />}
              className="insights-card"
              onViewClick={() => openExpandedView("insights")}
            >
              <Insights insights={insights} />
            </WidgetCard>

            <WidgetCard 
              title="FED" 
              actions={<Settings size={14} className="action-icon" />}
              className="fed-card"
              onViewClick={() => openExpandedView("fed")}
            >
              <FedWidget data={fedData} />
            </WidgetCard>

            {/* Row 2 */}
            <WidgetCard 
              title="FED EVENTS" 
              icon={<Zap size={14} />}
              className="fed-events-card"
              onViewClick={() => openExpandedView("fed-events")}
            >
              <FedEvents events={fedEvents} />
            </WidgetCard>

            <WidgetCard 
              title="RECENT NEWS" 
              icon={<Zap size={14} />}
              actions={<Filter size={14} className="action-icon" />}
              className="recent-news-card"
              onViewClick={() => openExpandedView("recent-news")}
            >
              <RecentNews news={recentNews} />
            </WidgetCard>

            <WidgetCard 
              title="YIELD REACTIONS" 
              icon={<Zap size={14} />}
              actions={<Settings size={14} className="action-icon" />}
              className="yield-reactions-card"
              onViewClick={() => openExpandedView("yield-reactions")}
            >
              <YieldReactions reactions={yieldReactions} />
            </WidgetCard>

            <WidgetCard 
              title="FEDWATCH" 
              icon={<Zap size={14} />}
              className="fedwatch-card"
              onViewClick={() => openExpandedView("fedwatch")}
            >
              <FedWatch fedwatch={fedwatch} />
            </WidgetCard>

            {/* Row 3 - Charts */}
            <WidgetCard 
              title="LABOR MARKET" 
              icon={<BarChart3 size={14} />}
              actions={<Settings size={14} className="action-icon" />}
              className="labor-market-card"
              onViewClick={() => openExpandedView("labor-market")}
            >
              <LaborMarketChart data={laborMarket} />
            </WidgetCard>

            <WidgetCard 
              title="INFLATION" 
              icon={<Zap size={14} />}
              actions={<Settings size={14} className="action-icon" />}
              className="inflation-card"
              onViewClick={() => openExpandedView("inflation")}
            >
              <InflationChart data={inflation} />
            </WidgetCard>

            <WidgetCard 
              title="SEASONALITY" 
              icon={<Zap size={14} />}
              className="seasonality-card"
              onViewClick={() => openExpandedView("seasonality")}
            >
              <SeasonalityChart data={seasonality} />
            </WidgetCard>

            {/* Row 4 */}
            <WidgetCard 
              title="CURRENCY STRENGTH INDEX" 
              icon={<Zap size={14} />}
              className="currency-strength-card"
              onViewClick={() => openExpandedView("currency-strength")}
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
              className="currency-heatmap-card"
              onViewClick={() => openExpandedView("currency-heatmap")}
            >
              <CurrencyHeatmap 
                heatmap={currencyHeatmap.heatmap}
                timeframes={currencyHeatmap.timeframes}
              />
            </WidgetCard>
          </div>
        )}
      </div>

      {/* Expanded Modal */}
      <ExpandedModal
        isOpen={expandedWidget !== null}
        onClose={closeExpandedView}
        title={getExpandedTitle()}
      >
        {renderExpandedContent()}
      </ExpandedModal>
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
