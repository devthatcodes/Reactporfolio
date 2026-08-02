import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from "@vercel/analytics/next"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <SpeedInsights />
      <Analytics />
    </BrowserRouter>
  </StrictMode>
);
