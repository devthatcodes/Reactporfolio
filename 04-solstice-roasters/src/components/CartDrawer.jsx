import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import CoffeeBagSVG from './CoffeeBagSVG';
import { COFFEES } from '../data/coffees';

const FREE_SHIPPING_THRESHOLD = 50;

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onAddToCart,
}) {
  const [checkedOut, setCheckedOut] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.coffee.price * item.quantity, 0);
  const shippingCost = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 6;
  const total = subtotal + shippingCost;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckout = () => {
    const randomOrder = `SR-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderNumber(randomOrder);
    setCheckedOut(true);
    onClearCart();
  };

  const handleClose = () => {
    setCheckedOut(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-espresso/45 backdrop-blur-sm"
          />

          {/* Slide-over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-10 w-full max-w-md bg-cream h-full flex flex-col shadow-2xl border-l border-espresso/15"
            aria-label="Shopping Bag"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-espresso/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-terracotta" />
                <h2 className="font-serif text-2xl text-espresso">Your Roast Bag</h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-cream-dark text-umber transition-colors"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {!checkedOut && (
              <div className="px-6 py-3.5 bg-cream-dark/70 border-b border-espresso/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-umber">
                  <Truck className="w-4 h-4 text-sage shrink-0" />
                  {remainingForFreeShipping > 0 ? (
                    <span>
                      Add <strong className="text-espresso">${remainingForFreeShipping}</strong> more
                      for complimentary 2-day shipping
                    </span>
                  ) : (
                    <span className="text-sage font-semibold">
                      Unlocked! Complimentary 2-day roastery shipping
                    </span>
                  )}
                </div>
                <div className="h-1.5 w-full rounded-full bg-espresso/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-sage"
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {checkedOut ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-sage-light flex items-center justify-center text-sage">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-semibold">
                    Order Confirmed • {orderNumber}
                  </span>
                  <h3 className="font-serif text-3xl text-espresso">
                    Roasted fresh for your morning ritual.
                  </h3>
                  <p className="text-sm text-umber/80 max-w-xs leading-relaxed">
                    Your beans are queued for tomorrow&apos;s morning roast batch. A tracking link
                    will arrive as soon as they leave the cooling tray.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-4 px-7 py-3 rounded-full bg-espresso text-cream text-sm font-medium hover:bg-umber transition-colors"
                  >
                    Continue Exploring
                  </button>
                </motion.div>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-5">
                  <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-umber/40" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-2xl text-espresso">Your bag is empty</h3>
                    <p className="text-sm text-umber/75 max-w-xs">
                      Start with our seasonal flagship or browse our single-origin micro-lots.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddToCart(COFFEES[0], 'Whole Bean')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors"
                  >
                    <span>Quick-Add {COFFEES[0].name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => {
                      const key = `${item.coffee.id}-${item.grind}`;
                      return (
                        <motion.li
                          key={key}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex gap-4 p-4 rounded-2xl bg-cream-dark/55 border border-espresso/10"
                        >
                          <div className="w-16 h-20 rounded-xl bg-cream flex items-center justify-center shrink-0 border border-espresso/5">
                            <CoffeeBagSVG coffee={item.coffee} className="w-12 h-16" compact />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-serif text-lg text-espresso leading-tight truncate">
                                  {item.coffee.name}
                                </h4>
                                <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-md bg-cream text-umber border border-espresso/10">
                                  {item.grind}
                                </span>
                              </div>
                              <span className="font-serif text-base font-semibold text-espresso">
                                ${item.coffee.price * item.quantity}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="inline-flex items-center gap-2 rounded-full bg-cream border border-espresso/15 px-2 py-1">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQty(item.coffee.id, item.grind, -1)}
                                  className="p-1 text-umber hover:text-terracotta transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-semibold w-5 text-center tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQty(item.coffee.id, item.grind, 1)}
                                  className="p-1 text-umber hover:text-terracotta transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.coffee.id, item.grind)}
                                className="p-1.5 text-umber/55 hover:text-terracotta transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer Summary */}
            {!checkedOut && cartItems.length > 0 && (
              <div className="px-6 py-5 border-t border-espresso/10 bg-cream-dark/40 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-umber/80">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-umber/80">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-serif text-xl text-espresso pt-2 border-t border-espresso/10">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-6 rounded-full bg-terracotta text-cream font-medium text-sm sm:text-base hover:bg-terracotta-dark transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>Complete Order</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
