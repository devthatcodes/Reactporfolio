import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoffeeShop from './components/CoffeeShop';
import BrewGuide from './components/BrewGuide';
import TastingRoomAndSub from './components/TastingRoomAndSub';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import RoastShaderCanvas from './components/RoastShaderCanvas';
import Preloader from './components/Preloader';
import PortalTransition from './components/PortalTransition';
import CustomCursor from './components/CustomCursor';
import SensoryHud from './components/SensoryHud';
import OriginPortalModal from './components/OriginPortalModal';
import { COFFEES } from './data/coffees';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active Theory WebGL Shader Roast Profile (0: Light Floral, 1: Medium Caramel, 2: Dark Obsidian)
  const [roastMode, setRoastMode] = useState(0);
  // 01 // 3D Reel vs 02 // Sensory Flavor Matrix
  const [shopViewMode, setShopViewMode] = useState('reel');
  // Active Full-Screen Origin Portal Coffee Lot
  const [portalCoffee, setPortalCoffee] = useState(null);
  // Active Multi-Layer Curtain Portal Transition
  const [activePortal, setActivePortal] = useState(null);
  // Live Cursor Velocity Telemetry
  const [cursorVelocity, setCursorVelocity] = useState(0);

  const handleCycleRoastMode = useCallback(() => {
    setRoastMode((prev) => (prev + 1) % 3);
  }, []);

  const handlePortalNavigate = useCallback((portalTarget) => {
    if (!portalTarget) return;
    setActivePortal({
      ...portalTarget,
      id: `${portalTarget.id}-${Date.now()}`,
      targetId: portalTarget.id,
    });

    if (portalTarget.viewMode) {
      setShopViewMode(portalTarget.viewMode);
    }

    setTimeout(() => {
      const el = document.getElementById(portalTarget.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 320);

    setTimeout(() => {
      setActivePortal(null);
    }, 820);
  }, []);

  const handleAddToCart = (coffee, grind) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.coffee.id === coffee.id && item.grind === grind
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { coffee, grind, quantity: 1 }];
    });
  };

  const handleUpdateQty = (coffeeId, grind, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.coffee.id === coffeeId && item.grind === grind) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (coffeeId, grind) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.coffee.id === coffeeId && item.grind === grind))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen flex flex-col bg-cream text-espresso selection:bg-terracotta/20 selection:text-espresso">
      {/* Active Theory Roaster Telemetry Preloader */}
      <Preloader />

      {/* Real-Time WebGL Thermal Crema & Botanical Fluid Shader */}
      <RoastShaderCanvas roastMode={roastMode} />

      {/* Multi-Layer Diagonal Portal Curtain Transition */}
      <PortalTransition activePortal={activePortal} />

      {/* Dual-Ring Magnetic Reticle Cursor */}
      <CustomCursor onVelocityChange={setCursorVelocity} />

      {/* Peripheral Sensory Telemetry HUD */}
      <SensoryHud
        roastMode={roastMode}
        onCycleRoastMode={handleCycleRoastMode}
        cursorVelocity={cursorVelocity}
        onPortalJump={handlePortalNavigate}
      />

      <Navbar
        cartCount={totalCount}
        onOpenCart={() => setIsCartOpen(true)}
        roastMode={roastMode}
        onCycleRoastMode={handleCycleRoastMode}
        onPortalNavigate={handlePortalNavigate}
      />

      <main className="relative z-10 flex-1">
        <Hero
          roastMode={roastMode}
          onSelectRoastMode={setRoastMode}
          onPortalNavigate={handlePortalNavigate}
        />
        <CoffeeShop
          onAddToCart={handleAddToCart}
          onOpenPortal={(coffee) => setPortalCoffee(coffee)}
          viewMode={shopViewMode}
          onViewModeChange={setShopViewMode}
        />
        <BrewGuide />
        <TastingRoomAndSub />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>

      {/* Full-Screen Origin & Sensory Portal Takeover Modal */}
      <OriginPortalModal
        coffee={portalCoffee}
        coffees={COFFEES}
        onClose={() => setPortalCoffee(null)}
        onSelectCoffee={(next) => setPortalCoffee(next)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
