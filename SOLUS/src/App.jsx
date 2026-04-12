import { Routes, Route } from 'react-router-dom';
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
    </>
  );
}

export default App;
