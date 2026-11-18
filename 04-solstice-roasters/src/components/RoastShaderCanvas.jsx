import React from 'react';
import { motion } from 'framer-motion';

const ROAST_AMBIENCE = [
  {
    id: 0,
    name: 'Light Floral Parchment',
    primaryGlow: 'rgba(200, 90, 50, 0.09)',
    secondaryGlow: 'rgba(94, 116, 97, 0.08)',
    warmTint: 'rgba(242, 236, 225, 0.65)',
  },
  {
    id: 1,
    name: 'Medium Honey Caramel',
    primaryGlow: 'rgba(206, 105, 42, 0.12)',
    secondaryGlow: 'rgba(138, 92, 58, 0.09)',
    warmTint: 'rgba(238, 227, 211, 0.72)',
  },
  {
    id: 2,
    name: 'Deep Espresso Roast',
    primaryGlow: 'rgba(168, 70, 35, 0.13)',
    secondaryGlow: 'rgba(58, 42, 34, 0.10)',
    warmTint: 'rgba(232, 220, 203, 0.78)',
  },
];

const BOTANICAL_LEAVES = [
  { id: 'leaf-1', left: '7%', top: '16%', size: 64, duration: 16, delay: 0, rotate: -14 },
  { id: 'leaf-2', left: '86%', top: '22%', size: 78, duration: 19, delay: 1.5, rotate: 18 },
  { id: 'leaf-3', left: '14%', top: '64%', size: 56, duration: 18, delay: 0.8, rotate: 12 },
  { id: 'leaf-4', left: '82%', top: '72%', size: 68, duration: 21, delay: 2.2, rotate: -18 },
];

const STEAM_WISPS = [
  { id: 'wisp-1', left: '24%', bottom: '12%', height: 180, duration: 11, delay: 0 },
  { id: 'wisp-2', left: '52%', bottom: '8%', height: 210, duration: 13, delay: 2.4 },
  { id: 'wisp-3', left: '74%', bottom: '15%', height: 165, duration: 12, delay: 1.2 },
];

/**
 * RoastShaderCanvas — Rewritten as a lightweight, zero-lag
 * "Warm Parchment & Floating Botanical Aura"
 * Soft radial warm amber/terracotta ambient light gradients + subtle floating
 * SVG botanical coffee cherry leaves and rising steam wisps at 60/120fps.
 */
export default function RoastShaderCanvas({
  roastMode = 0,
  className = 'fixed inset-0 pointer-events-none z-0 overflow-hidden',
}) {
  const palette = ROAST_AMBIENCE[roastMode % ROAST_AMBIENCE.length];

  return (
    <div className={className} aria-hidden="true">
      {/* Warm Parchment Radial Ambient Light Layers */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: `
            radial-gradient(circle at 18% 20%, ${palette.primaryGlow} 0%, transparent 52%),
            radial-gradient(circle at 82% 32%, ${palette.secondaryGlow} 0%, transparent 48%),
            radial-gradient(circle at 50% 80%, ${palette.primaryGlow} 0%, transparent 58%),
            linear-gradient(180deg, rgba(251, 248, 243, 0.4) 0%, ${palette.warmTint} 100%)
          `,
        }}
      />

      {/* Subtle Pressed Cotton Paper Botanical Watermark Rings */}
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        className="absolute inset-0 w-full h-full opacity-[0.22]"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle
          cx="1220"
          cy="180"
          r="260"
          stroke="#C85A32"
          strokeWidth="1"
          strokeDasharray="6 8"
        />
        <circle
          cx="1220"
          cy="180"
          r="190"
          stroke="#5E7461"
          strokeWidth="0.75"
        />
        <circle
          cx="180"
          cy="720"
          r="240"
          stroke="#5E7461"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <path
          d="M-60 460 C 320 340, 680 560, 1080 410 C 1260 340, 1390 380, 1520 350"
          stroke="#C85A32"
          strokeWidth="1"
          strokeOpacity="0.45"
          strokeDasharray="5 7"
        />
      </svg>

      {/* Floating Botanical Coffee Cherry Leaves */}
      {BOTANICAL_LEAVES.map((leaf) => (
        <motion.div
          key={leaf.id}
          style={{
            left: leaf.left,
            top: leaf.top,
            width: leaf.size,
            height: leaf.size,
            willChange: 'transform',
          }}
          animate={{
            y: [-10, 12, -10],
            x: [-5, 6, -5],
            rotate: [leaf.rotate - 5, leaf.rotate + 6, leaf.rotate - 5],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute opacity-20"
        >
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            {/* Botanical Coffee Leaf & Berry */}
            <path
              d="M12 52 C16 28, 32 14, 54 10 C50 32, 36 48, 12 52 Z"
              stroke="#5E7461"
              strokeWidth="1.5"
              fill="#5E7461"
              fillOpacity="0.12"
            />
            <path
              d="M12 52 C26 38, 38 26, 52 12"
              stroke="#5E7461"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="22" cy="40" r="3.5" fill="#C85A32" fillOpacity="0.55" />
            <circle cx="30" cy="30" r="2.5" fill="#C85A32" fillOpacity="0.4" />
          </svg>
        </motion.div>
      ))}

      {/* Gentle Rising Aroma Steam Wisps */}
      {STEAM_WISPS.map((wisp) => (
        <motion.svg
          key={wisp.id}
          viewBox="0 0 40 160"
          fill="none"
          style={{
            left: wisp.left,
            bottom: wisp.bottom,
            height: wisp.height,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -34, 0],
            opacity: [0.08, 0.22, 0.08],
          }}
          transition={{
            duration: wisp.duration,
            delay: wisp.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute w-10"
        >
          <path
            d="M20 150 C8 118, 32 92, 18 60 C6 34, 28 18, 20 4"
            stroke="#C85A32"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3 5"
          />
        </motion.svg>
      ))}
    </div>
  );
}
