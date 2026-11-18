import React, { useId } from 'react';

/**
 * Bespoke architectural perspective / elevation SVG artwork for each of the 6 projects.
 * Supports real-time Solar Hour scrubbing (`solarHour`, 6.0 = 06:00 Dawn to 20.0 = 20:00 Dusk)
 * so shadows, sun position, and interior warm illumination shift dynamically.
 */
export function ProjectPerspective({ id, solarHour = 10.5, className = 'w-full h-full' }) {
  const uid = useId();
  // Normalized solar progress: 0.0 (06:00 Dawn) -> 0.5 (13:00 Zenith) -> 1.0 (20:00 Dusk)
  const norm = Math.max(0, Math.min(1, (solarHour - 6) / 14));
  const sunX = 70 + norm * 340;
  const sunY = 52 + Math.pow(norm - 0.5, 2) * 190;
  const shadowSkew = (0.5 - norm) * 75;
  const isEvening = solarHour >= 17.5;
  const isDusk = solarHour >= 18.8;

  const skyBg = isDusk
    ? '#D7D2C8'
    : isEvening
    ? '#E6E0D4'
    : '#EFECE6';

  const interiorWarmth = isEvening ? '#E5B879' : '#F7F5F0';

  const renderArtworkBody = () => {
    switch (id) {
      case 'kamo-courtyard-house':
        return (
          <>
            {/* Distant Kyoto ridge line */}
            <path d="M0 210 Q110 170 230 195 T480 180 L480 260 L0 260 Z" fill="#E3DFD6" opacity={isDusk ? 0.65 : 1} />
            {/* Dynamic cast ground shadow */}
            <polygon
              points={`85,270 395,270 ${395 + shadowSkew},298 ${85 + shadowSkew},298`}
              fill="#1C1B19"
              fillOpacity={0.14}
            />
            {/* Main pitched hinoki roof & deep eave */}
            <polygon points="70,138 240,92 410,138 395,148 85,148" fill="#1C1B19" />
            <rect x="85" y="148" width="310" height="10" fill="#9A7B4F" fillOpacity="0.65" />
            {/* Rammed earth walls */}
            <rect x="96" y="158" width="288" height="112" fill="#F7F5F0" stroke="#1C1B19" strokeWidth="1" />
            {/* Shoji / Timber screen bays (glow warm at dusk) */}
            <rect x="128" y="176" width="96" height="94" fill={interiorWarmth} stroke="#1C1B19" strokeWidth="0.9" />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={128 + i * 24} y1="176" x2={128 + i * 24} y2="270" stroke="#9A7B4F" strokeWidth="0.8" />
            ))}
            <line x1="128" y1="212" x2="224" y2="212" stroke="#1C1B19" strokeOpacity="0.35" strokeWidth="0.7" />
            {/* Courtyard aperture */}
            <rect x="256" y="176" width="96" height="94" fill="#1C1B19" fillOpacity="0.06" stroke="#1C1B19" strokeWidth="0.9" />
            {/* Minimalist courtyard tree */}
            <line x1="304" y1="270" x2="304" y2="212" stroke="#1C1B19" strokeWidth="1.2" />
            <circle cx="304" cy="204" r="18" stroke="#9A7B4F" strokeWidth="0.9" fill="#9A7B4F" fillOpacity="0.14" />
            {/* Kurama granite plinth */}
            <line x1="48" y1="270" x2="432" y2="270" stroke="#1C1B19" strokeWidth="1.5" />
            <rect x="80" y="270" width="320" height="8" fill="#1C1B19" fillOpacity="0.12" />
          </>
        );

      case 'nordhavn-brick-pavilion':
        return (
          <>
            {/* Sawtooth skylights */}
            <polygon points="72,140 148,96 148,140" fill={interiorWarmth} stroke="#1C1B19" strokeWidth="1" />
            <polygon points="148,140 224,96 224,140" fill={interiorWarmth} stroke="#1C1B19" strokeWidth="1" />
            <polygon points="224,140 300,96 300,140" fill={interiorWarmth} stroke="#1C1B19" strokeWidth="1" />
            <polygon points="300,140 376,96 376,140" fill={interiorWarmth} stroke="#1C1B19" strokeWidth="1" />
            {/* Clerestory light shafts angled by solarHour */}
            {[148, 224, 300, 376].map((x, i) => (
              <line
                key={i}
                x1={x - 12}
                y1="108"
                x2={x - 24 + shadowSkew * 0.5}
                y2="248"
                stroke="#9A7B4F"
                strokeOpacity="0.4"
                strokeWidth="0.95"
              />
            ))}
            {/* Main Petersen brick mass */}
            <rect x="72" y="140" width="304" height="122" fill="#E5DFD5" stroke="#1C1B19" strokeWidth="1.1" />
            {/* Horizontal brick courses */}
            {[0, 1, 2, 3, 4, 5].map((r) => (
              <line
                key={r}
                x1="72"
                y1={158 + r * 18}
                x2="376"
                y2={158 + r * 18}
                stroke="#1C1B19"
                strokeOpacity="0.14"
                strokeWidth="0.7"
              />
            ))}
            {/* Harbor quay stepped volume */}
            <rect x="336" y="176" width="76" height="86" fill="#F7F5F0" stroke="#1C1B19" strokeWidth="1" />
            <rect x="352" y="196" width="44" height="66" fill={interiorWarmth} fillOpacity="0.65" stroke="#1C1B19" strokeWidth="0.8" />
            {/* Baltic water reflection lines */}
            <line x1="40" y1="262" x2="440" y2="262" stroke="#1C1B19" strokeWidth="1.4" />
            <line x1="68" y1="278" x2="410" y2="278" stroke="#78736A" strokeOpacity="0.45" strokeWidth="0.8" strokeDasharray="16 8" />
            <line x1="110" y1="292" x2="360" y2="292" stroke="#78736A" strokeOpacity="0.3" strokeWidth="0.8" strokeDasharray="8 10" />
          </>
        );

      case 'arashiyama-ryokan':
        return (
          <>
            {/* Bamboo grove vertical rhythm */}
            {[56, 74, 96, 384, 404, 422].map((x, idx) => (
              <line
                key={idx}
                x1={x}
                y1="36"
                x2={x}
                y2="272"
                stroke="#78736A"
                strokeOpacity="0.32"
                strokeWidth={idx % 2 === 0 ? '1.5' : '0.8'}
              />
            ))}
            {/* Charred yakisugi sanctuary pavilion */}
            <rect x="116" y="114" width="248" height="148" fill="#1C1B19" />
            {/* Glowing washi interior band */}
            <rect x="136" y="146" width="208" height="86" fill={interiorWarmth} />
            {/* Shoji mullions */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={136 + i * 41.6} y1="146" x2={136 + i * 41.6} y2="232" stroke="#1C1B19" strokeWidth="0.8" />
            ))}
            <line x1="136" y1="189" x2="344" y2="189" stroke="#9A7B4F" strokeWidth="0.9" />
            {/* Aji stone reflection basin */}
            <rect x="156" y="262" width="168" height="20" fill="#D9D3C7" stroke="#1C1B19" strokeWidth="1" />
            <line x1="176" y1="272" x2="304" y2="272" stroke="#9A7B4F" strokeWidth="0.8" />
            {/* Rising steam arcs */}
            <path d="M210 256 Q216 244 210 232" stroke="#9A7B4F" strokeOpacity="0.6" strokeWidth="0.9" />
            <path d="M240 256 Q246 242 240 228" stroke="#9A7B4F" strokeOpacity="0.6" strokeWidth="0.9" />
            <path d="M270 256 Q276 244 270 232" stroke="#9A7B4F" strokeOpacity="0.6" strokeWidth="0.9" />
            <line x1="40" y1="282" x2="440" y2="282" stroke="#1C1B19" strokeWidth="1.2" />
          </>
        );

      case 'frederiksberg-atelier':
        return (
          <>
            {/* Tall Copenhagen loft shell */}
            <rect x="88" y="54" width="304" height="224" fill="#F7F5F0" stroke="#1C1B19" strokeWidth="1.2" />
            {/* Tall arched / rhythmic window */}
            <path d="M126 238 V110 A36 36 0 0 1 198 110 V238 Z" fill={interiorWarmth} stroke="#1C1B19" strokeWidth="1" />
            <line x1="162" y1="74" x2="162" y2="238" stroke="#1C1B19" strokeOpacity="0.4" strokeWidth="0.8" />
            <line x1="126" y1="156" x2="198" y2="156" stroke="#1C1B19" strokeOpacity="0.4" strokeWidth="0.8" />
            {/* Diagonal daylight cast responsive to solarHour */}
            <polygon
              points={`126,110 198,110 ${290 + shadowSkew},278 ${165 + shadowSkew},278`}
              fill="#9A7B4F"
              fillOpacity="0.15"
            />
            {/* Freestanding oak library core */}
            <rect x="242" y="108" width="114" height="170" fill="#9A7B4F" fillOpacity="0.22" stroke="#1C1B19" strokeWidth="1" />
            {[0, 1, 2, 3, 4].map((s) => (
              <line key={s} x1="252" y1={132 + s * 28} x2="346" y2={132 + s * 28} stroke="#1C1B19" strokeWidth="0.8" />
            ))}
            <line x1="299" y1="108" x2="299" y2="278" stroke="#1C1B19" strokeOpacity="0.45" strokeWidth="0.8" />
            {/* Minimalist plinth table */}
            <rect x="132" y="246" width="84" height="6" fill="#1C1B19" />
            <line x1="146" y1="252" x2="146" y2="278" stroke="#1C1B19" strokeWidth="1.2" />
            <line x1="202" y1="252" x2="202" y2="278" stroke="#1C1B19" strokeWidth="1.2" />
            <line x1="48" y1="278" x2="432" y2="278" stroke="#1C1B19" strokeWidth="1.4" />
          </>
        );

      case 'naoshima-tea-archive':
        return (
          <>
            {/* Seto Inland Sea horizon */}
            <line x1="28" y1="196" x2="452" y2="196" stroke="#78736A" strokeOpacity="0.45" strokeWidth="0.8" />
            {/* Concrete cantilever anchoring into headland */}
            <rect x="74" y="128" width="332" height="84" fill="#DCD7CD" stroke="#1C1B19" strokeWidth="1.2" />
            {/* Board-formed texture lines */}
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="74" y1={146 + i * 18} x2="406" y2={146 + i * 18} stroke="#1C1B19" strokeOpacity="0.12" strokeWidth="0.7" />
            ))}
            {/* Narrow 18m skylight slit */}
            <rect x="128" y="118" width="224" height="10" fill={interiorWarmth} stroke="#1C1B19" strokeWidth="0.9" />
            {/* Framed ocean aperture */}
            <rect x="206" y="148" width="154" height="48" fill={interiorWarmth} stroke="#1C1B19" strokeWidth="1" />
            <circle cx={260 + norm * 45} cy="172" r="10" stroke="#9A7B4F" strokeWidth="0.9" fill="#9A7B4F" fillOpacity="0.24" />
            {/* Granite headland slope */}
            <polygon points="48,212 310,212 420,278 48,278" fill="#1C1B19" fillOpacity="0.08" stroke="#1C1B19" strokeWidth="1" />
            <line x1="36" y1="278" x2="444" y2="278" stroke="#1C1B19" strokeWidth="1.4" />
          </>
        );

      case 'tisvilde-bathhouse':
      default:
        return (
          <>
            {/* Coastal dunes */}
            <path d="M24 268 Q140 226 260 256 T456 246 L456 286 L24 286 Z" fill="#E1DBD0" />
            {/* Elevated larch pavilion */}
            <rect x="86" y="138" width="308" height="82" fill={interiorWarmth} stroke="#1C1B19" strokeWidth="1.1" />
            {/* Larch vertical wind screens */}
            {Array.from({ length: 14 }).map((_, i) => (
              <line
                key={i}
                x1={104 + i * 21}
                y1="146"
                x2={104 + i * 21}
                y2="212"
                stroke="#9A7B4F"
                strokeOpacity="0.6"
                strokeWidth="1.2"
              />
            ))}
            {/* Helical piers lifting structure above marram grass */}
            {[112, 196, 284, 368].map((x, idx) => (
              <line key={idx} x1={x} y1="220" x2={x} y2="262" stroke="#1C1B19" strokeWidth="1.4" />
            ))}
            {/* Travertine cold-plunge deck */}
            <rect x="150" y="212" width="180" height="8" fill="#1C1B19" />
            <line x1="32" y1="286" x2="448" y2="286" stroke="#1C1B19" strokeWidth="1.2" />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 480 340" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`sunGlow-${uid}`} cx={`${(sunX / 480) * 100}%`} cy={`${(sunY / 340) * 100}%`} r="60%">
          <stop offset="0%" stopColor="#9A7B4F" stopOpacity={isDusk ? '0.28' : '0.18'} />
          <stop offset="100%" stopColor="#EFECE6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="480" height="340" fill={skyBg} />
      <rect width="480" height="340" fill={`url(#sunGlow-${uid})`} />

      {/* Dynamic Solar Path Arc & Sun Orb */}
      <path
        d="M 55 125 Q 240 15 425 125"
        stroke="#9A7B4F"
        strokeOpacity="0.22"
        strokeWidth="0.75"
        strokeDasharray="3 4"
      />
      <circle cx={sunX} cy={sunY} r="14" stroke="#9A7B4F" strokeOpacity="0.45" strokeWidth="0.8" />
      <circle cx={sunX} cy={sunY} r="4.5" fill="#9A7B4F" fillOpacity="0.65" />

      {/* Dynamic Solar Incidence Ray */}
      <line
        x1={sunX}
        y1={sunY}
        x2={240 + shadowSkew}
        y2="275"
        stroke="#9A7B4F"
        strokeOpacity="0.25"
        strokeWidth="0.75"
        strokeDasharray="2 3"
      />

      {renderArtworkBody()}
    </svg>
  );
}

/**
 * Architectural Floorplan & Elevation SVG Diagram for the Project Detail Modal.
 */
export function ProjectFloorplan({ id, className = 'w-full h-full' }) {
  return (
    <svg viewBox="0 0 480 340" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="340" fill="#F7F5F0" />
      {/* Fine drafting grid */}
      <defs>
        <pattern id={`grid-${id}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1C1B19" strokeOpacity="0.06" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect x="24" y="24" width="432" height="292" fill={`url(#grid-${id})`} stroke="#1C1B19" strokeOpacity="0.2" strokeWidth="0.8" />

      {/* Outer structural wall poche */}
      <rect x="76" y="64" width="328" height="196" stroke="#1C1B19" strokeWidth="3" fill="#EFECE6" fillOpacity="0.45" />

      {/* Interior spatial partitions tailored subtly by project */}
      {id === 'kamo-courtyard-house' || id === 'arashiyama-ryokan' ? (
        <>
          {/* Central courtyard void */}
          <rect x="184" y="114" width="112" height="96" fill="#F7F5F0" stroke="#9A7B4F" strokeWidth="1.2" strokeDasharray="4 3" />
          <circle cx="240" cy="162" r="14" stroke="#9A7B4F" strokeWidth="0.9" />
          <line x1="76" y1="146" x2="184" y2="146" stroke="#1C1B19" strokeWidth="1.5" />
          <line x1="296" y1="176" x2="404" y2="176" stroke="#1C1B19" strokeWidth="1.5" />
          <line x1="240" y1="64" x2="240" y2="114" stroke="#1C1B19" strokeWidth="1.2" />
        </>
      ) : (
        <>
          {/* Axial gallery / hall plan */}
          <line x1="168" y1="64" x2="168" y2="210" stroke="#1C1B19" strokeWidth="1.6" />
          <line x1="294" y1="112" x2="294" y2="260" stroke="#1C1B19" strokeWidth="1.6" />
          <rect x="196" y="128" width="70" height="68" stroke="#9A7B4F" strokeWidth="1" fill="#9A7B4F" fillOpacity="0.1" />
          <line x1="76" y1="162" x2="168" y2="162" stroke="#1C1B19" strokeOpacity="0.45" strokeWidth="1" />
        </>
      )}

      {/* Door swing arcs */}
      <path d="M168 210 A28 28 0 0 1 196 238" stroke="#9A7B4F" strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="168" y1="210" x2="168" y2="238" stroke="#1C1B19" strokeWidth="1" />

      {/* Section cut line A-A */}
      <line x1="48" y1="162" x2="432" y2="162" stroke="#9A7B4F" strokeWidth="0.9" strokeDasharray="8 4 2 4" />
      <text x="52" y="156" fill="#9A7B4F" fontSize="9" fontFamily="monospace">
        A
      </text>
      <text x="422" y="156" fill="#9A7B4F" fontSize="9" fontFamily="monospace">
        A&apos;
      </text>

      {/* Dimension callouts */}
      <line x1="76" y1="46" x2="404" y2="46" stroke="#78736A" strokeWidth="0.7" />
      <line x1="76" y1="41" x2="76" y2="51" stroke="#78736A" strokeWidth="0.7" />
      <line x1="404" y1="41" x2="404" y2="51" stroke="#78736A" strokeWidth="0.7" />
      <text x="220" y="42" fill="#78736A" fontSize="8" fontFamily="monospace" letterSpacing="1.5">
        24,000 MM
      </text>

      {/* North Compass & Scale Bar */}
      <g transform="translate(418, 282)">
        <circle cx="0" cy="0" r="14" stroke="#1C1B19" strokeOpacity="0.4" strokeWidth="0.8" />
        <line x1="0" y1="10" x2="0" y2="-10" stroke="#1C1B19" strokeWidth="1" />
        <polygon points="0,-10 -3,-4 3,-4" fill="#9A7B4F" />
        <text x="-3" y="-17" fill="#1C1B19" fontSize="7" fontFamily="monospace">
          N
        </text>
      </g>

      <g transform="translate(76, 286)">
        <line x1="0" y1="0" x2="72" y2="0" stroke="#1C1B19" strokeWidth="1" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#1C1B19" strokeWidth="1" />
        <line x1="36" y1="-3" x2="36" y2="3" stroke="#1C1B19" strokeWidth="0.8" />
        <line x1="72" y1="-4" x2="72" y2="4" stroke="#1C1B19" strokeWidth="1" />
        <text x="0" y="13" fill="#78736A" fontSize="7.5" fontFamily="monospace">
          0
        </text>
        <text x="32" y="13" fill="#78736A" fontSize="7.5" fontFamily="monospace">
          5M
        </text>
        <text x="64" y="13" fill="#78736A" fontSize="7.5" fontFamily="monospace">
          10M
        </text>
      </g>
    </svg>
  );
}
