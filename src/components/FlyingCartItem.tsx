import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';

export const FlyingCartItem: React.FC = () => {
  const { flyingItem, clearFlyingItem } = useCart();

  useEffect(() => {
    if (flyingItem) {
      const timer = setTimeout(() => {
        clearFlyingItem();
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [flyingItem, clearFlyingItem]);

  if (!flyingItem) return null;

  // Cart button in navbar is typically near top right
  const targetX = typeof window !== 'undefined' ? window.innerWidth - 70 : 800;
  const targetY = 32;

  return (
    <AnimatePresence>
      <motion.div
        key={flyingItem.id}
        initial={{
          position: 'fixed',
          left: flyingItem.startX,
          top: flyingItem.startY,
          x: '-50%',
          y: '-50%',
          scale: 1,
          opacity: 1,
          zIndex: 9999
        }}
        animate={{
          left: [flyingItem.startX, (flyingItem.startX + targetX) / 2, targetX],
          top: [flyingItem.startY, Math.min(flyingItem.startY, targetY) - 100, targetY],
          scale: [1, 1.2, 0.25],
          rotate: [0, 180, 360],
          opacity: [1, 1, 0]
        }}
        transition={{
          duration: 0.75,
          ease: [0.2, 0.8, 0.2, 1]
        }}
        className="pointer-events-none"
      >
        <div className="w-16 h-16 rounded-2xl bg-white shadow-2xl p-1.5 border-2 border-emerald-400 flex items-center justify-center overflow-hidden">
          <img
            src={flyingItem.image}
            alt="Flying grocery item"
            className="w-full h-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
