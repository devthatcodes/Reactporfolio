import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoffeeShop from './components/CoffeeShop';
import BrewGuide from './components/BrewGuide';
import TastingRoomAndSub from './components/TastingRoomAndSub';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import RoastShaderCanvas from './components/RoastShaderCanvas';
import PortalTransition from './components/PortalTransition';
import CustomCursor from './components/CustomCursor';
import OriginPortalModal from './components/OriginPortalModal';
import {
  ScrollPortalSection,
  BotanicalVineDivider,
} from './components/ScrollRoastTransition';
import { COFFEES } from './data/coffees';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Ambient Roast Profile (0: Light Floral, 1: Medium Caramel, 2: Deep Espresso)
  const [roastMode, setRoastMode] = useState(0);
  // Fanned Tasting Deck & Harvest Grid vs Sensory Flavor Wheel
  const [shopViewMode, setShopViewMode] = useState('reel');
  // Active Full-Screen Origin Tasting Card Modal
  const [portalCoffee, setPortalCoffee] = useState(null);
  // Active Warm Circular Espresso Iris Bloom Transition
  const [activePortal, setActivePortal] = useState(null);

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
    }, 220);

    setTimeout(() => {
      setActivePortal(null);
    }, 520);
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
      {/* Warm Parchment & Floating Botanical Aura */}
      <RoastShaderCanvas roastMode={roastMode} />

      {/* Warm Circular Espresso Iris Bloom Transition */}
      <PortalTransition activePortal={activePortal} />

      {/* Warm Circular Roastery Wax-Seal Stamp Cursor */}
      <CustomCursor />

      <Navbar
        cartCount={totalCount}
        onOpenCart={() => setIsCartOpen(true)}
        roastMode={roastMode}
        onCycleRoastMode={handleCycleRoastMode}
        onPortalNavigate={handlePortalNavigate}
      />

      <main className="relative z-10 flex-1 overflow-x-clip">
        <ScrollPortalSection
          code="Chapter I · Autumn Harvest"
          label="Botanical Provenance & Drum Roast Curve"
          tempRange="94°C → 198.2°C"
          disableEntryClip
        >
          <Hero
            roastMode={roastMode}
            onSelectRoastMode={setRoastMode}
            onPortalNavigate={handlePortalNavigate}
          />
        </ScrollPortalSection>

        <BotanicalVineDivider
          chapter="Micro-Lot Selection · Single-Origin Harvest"
          inscription="Grown above 1,650m in Ethiopia, Colombia, Costa Rica, Kenya & Guatemala · Roasted in 12kg cast-iron drums"
        />

        <ScrollPortalSection
          code="Chapter II · Tasting Deck & Harvest Lots"
          label="Fanned Tasting Cards & Single-Origin Apothecary"
          tempRange="178°C → 208.6°C"
        >
          <CoffeeShop
            onAddToCart={handleAddToCart}
            onOpenPortal={(coffee) => setPortalCoffee(coffee)}
            viewMode={shopViewMode}
            onViewModeChange={setShopViewMode}
          />
        </ScrollPortalSection>

        <BotanicalVineDivider
          chapter="Pour-Over Ritual · Extraction Craft"
          inscription="Dialed-in water chemistry at 93°C · Gentle spiral bloom & steady glass carafe percolation"
        />

        <ScrollPortalSection
          code="Chapter III · Slow Bar Pour-Over Guide"
          label="Scroll-Driven Extraction Stream & Brew Timer"
          tempRange="92°C → 96°C Water"
        >
          <BrewGuide />
        </ScrollPortalSection>

        <BotanicalVineDivider
          chapter="Portland Roastery · Weekly Guided Cuppings"
          inscription="1420 SE Alder St, Portland · Fresh-roasted Monday & Thursday, dispatched within 48 hours"
        />

        <ScrollPortalSection
          code="Chapter IV · Tasting Room & Roaster's Dispatch"
          label="Slow Bar Cupping Table & Seasonal Subscription"
          tempRange="Agtron 55.8 → 70.2"
        >
          <TastingRoomAndSub />
        </ScrollPortalSection>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>

      {/* Full-Screen Origin & Sensory Tasting Notes Modal */}
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
