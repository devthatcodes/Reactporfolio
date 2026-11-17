import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoffeeShop from './components/CoffeeShop';
import BrewGuide from './components/BrewGuide';
import TastingRoomAndSub from './components/TastingRoomAndSub';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-cream text-espresso">
      <Navbar cartCount={totalCount} onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1">
        <Hero />
        <CoffeeShop onAddToCart={handleAddToCart} />
        <BrewGuide />
        <TastingRoomAndSub />
      </main>

      <Footer />

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
