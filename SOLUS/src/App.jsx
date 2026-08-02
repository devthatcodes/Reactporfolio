import { Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Music from './pages/Music';
import Journal from './pages/Journal';
import Merch from './pages/Merch';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/music" element={<Music />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/merch" element={<Merch />} />
      </Routes>
      <Footer />
      <SpeedInsights />
    </>
  );
}

export default App;
