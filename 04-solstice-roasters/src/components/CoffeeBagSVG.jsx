import React from 'react';

export default function CoffeeBagSVG({ coffee, className = 'w-36 h-44', compact = false }) {
  const { palette, name, origin, elevation } = coffee;

  const renderMotif = () => {
    switch (palette.motif) {
      case 'sunburst':
        return (
          <g>
            <circle cx="90" cy="116" r="18" fill={palette.accent} />
            <path
              d="M90 88V94M66 98L71 103M114 98L109 103M60 116H66M114 116H120"
              stroke={palette.accent}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M54 134C68 122 80 124 90 130C100 136 112 132 126 122"
              stroke={palette.secondary}
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
      case 'peaks':
        return (
          <g>
            <path
              d="M52 136L78 98L94 118L108 102L128 136H52Z"
              fill={palette.accent}
              fillOpacity="0.88"
            />
            <path d="M78 98L86 111L73 114L78 98Z" fill="#FBF8F3" fillOpacity="0.7" />
            <circle cx="112" cy="96" r="7" fill={palette.secondary} fillOpacity="0.25" />
          </g>
        );
      case 'botanical':
        return (
          <g>
            <path
              d="M90 138C90 118 92 102 104 88"
              stroke={palette.accent}
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M90 122C74 118 70 105 80 99C88 104 91 114 90 122Z"
              fill={palette.accent}
            />
            <path
              d="M93 108C108 104 115 94 106 86C98 90 93 100 93 108Z"
              fill={palette.accent}
              fillOpacity="0.8"
            />
            <circle cx="84" cy="126" r="4" fill={palette.secondary} />
            <circle cx="96" cy="116" r="3.5" fill={palette.secondary} />
          </g>
        );
      case 'volcano':
      default:
        return (
          <g>
            <path
              d="M52 136L78 100H102L128 136H52Z"
              fill={palette.accent}
            />
            <path
              d="M84 96C84 90 90 86 95 88C100 84 104 90 98 95"
              stroke={palette.secondary}
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="90" cy="118" r="5" fill={palette.secondary} />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 180 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`${name} coffee bag illustration`}
    >
      {/* Soft drop shadow */}
      <ellipse cx="90" cy="206" rx="54" ry="7" fill="#1E1612" fillOpacity="0.1" />

      {/* Kraft / Matte Bag Body */}
      <path
        d="M36 42L44 26H136L144 42V188C144 194.627 138.627 200 132 200H48C41.3726 200 36 194.627 36 188V42Z"
        fill={palette.bag}
        stroke="#1E1612"
        strokeOpacity="0.16"
        strokeWidth="1.5"
      />

      {/* Side gusset fold shading */}
      <path d="M36 42L46 46V198C40 198 36 194 36 188V42Z" fill="#1E1612" fillOpacity="0.05" />
      <path d="M144 42L134 46V198C140 198 144 194 144 188V42Z" fill="#1E1612" fillOpacity="0.07" />

      {/* Top heat-seal crimp */}
      <path d="M44 26H136L142 38H38L44 26Z" fill="#1E1612" fillOpacity="0.06" />
      <line x1="40" y1="35" x2="140" y2="35" stroke="#1E1612" strokeOpacity="0.15" strokeWidth="1" />

      {/* Degassing Valve */}
      <circle cx="90" cy="50" r="4" fill="#FBF8F3" stroke="#1E1612" strokeOpacity="0.25" strokeWidth="1" />

      {/* Editorial Label Card */}
      <rect
        x="48"
        y="62"
        width="84"
        height="116"
        rx="6"
        fill="#FBF8F3"
        stroke="#1E1612"
        strokeOpacity="0.14"
        strokeWidth="1.2"
      />

      {/* Top accent bar on label */}
      <rect x="48" y="62" width="84" height="6" rx="3" fill={palette.accent} />

      {/* Brand stamp */}
      {!compact && (
        <text
          x="90"
          y="80"
          textAnchor="middle"
          fill="#3A2A22"
          fillOpacity="0.65"
          fontSize="6.5"
          letterSpacing="1.8"
          fontFamily="DM Sans, sans-serif"
          fontWeight="600"
        >
          SOLSTICE
        </text>
      )}

      {/* Custom Botanical / Origin Motif */}
      {renderMotif()}

      {/* Coffee Title on Label */}
      {!compact && (
        <>
          <text
            x="90"
            y="154"
            textAnchor="middle"
            fill={palette.ink}
            fontSize="8.5"
            fontFamily="Fraunces, Georgia, serif"
            fontWeight="600"
          >
            {name.length > 18 ? name.slice(0, 17) + '…' : name}
          </text>
          <text
            x="90"
            y="166"
            textAnchor="middle"
            fill="#3A2A22"
            fillOpacity="0.7"
            fontSize="6.5"
            fontFamily="DM Sans, sans-serif"
          >
            {origin.split(',')[0]} • {elevation}
          </text>
        </>
      )}
    </svg>
  );
}
