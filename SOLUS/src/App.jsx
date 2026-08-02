import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const Music = lazy(() => import('./pages/Music'));
const Journal = lazy(() => import('./pages/Journal'));
const Merch = lazy(() => import('./pages/Merch'));

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000000',
          color: '#ffffff',
          fontFamily: "'Outfit', sans-serif"
        }}>
          Loading...
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<RouteTransition><Music /></RouteTransition>} />
          <Route path="/journal" element={<RouteTransition><Journal /></RouteTransition>} />
          <Route path="/merch" element={<RouteTransition><Merch /></RouteTransition>} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

// Simple helper component to ensure framer-motion transitions render nicely
function RouteTransition({ children }) {
  return children;
}

export default App;
