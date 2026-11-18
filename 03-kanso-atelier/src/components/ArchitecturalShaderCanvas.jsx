import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_velocity;
  uniform float u_scroll;
  uniform float u_mode; // 0.0 = DAWN MONOLITH, 1.0 = ZENITH TIMBER, 2.0 = NOCTURNE CONCRETE

  // 2D Simplex-like hash & noise for architectural limestone & caustic refraction
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);

    // Liquid stone ripple displacement around cursor
    float dist = length(p - m);
    float ripple = sin(dist * 28.0 - u_time * 3.2) * exp(-dist * 4.5) * (0.018 + u_velocity * 0.04);
    vec2 displacedUv = uv + normalize(p - m + 0.0001) * ripple;

    // Architectural louver / sun-slat caustic bands shifted by scroll & mouse solar azimuth
    float solarAngle = (u_mouse.x - 0.5) * 0.65 + u_scroll * 0.35;
    vec2 sunCoord = vec2(
      displacedUv.x * cos(solarAngle) - displacedUv.y * sin(solarAngle),
      displacedUv.x * sin(solarAngle) + displacedUv.y * cos(solarAngle)
    );

    float louverPattern = sin((sunCoord.x * 18.0 + u_time * 0.18) + fbm(sunCoord * 3.5 + u_time * 0.08) * 2.2);
    float causticBeam = smoothstep(-0.2, 0.85, louverPattern) * smoothstep(1.1, 0.15, length(p - m * 0.6));

    // Fine architectural travertine / plaster grain
    float grain = fbm(displacedUv * 9.0 + vec2(u_time * 0.04, -u_scroll * 0.5));
    float microGrain = (hash(uv * u_resolution * 0.5 + u_time) - 0.5) * 0.022;

    // Palette definitions per lighting preset
    // 0: DAWN MONOLITH (Warm Alabaster, Limestone, Bronze Sunbeam)
    vec3 bgDawn = vec3(0.968, 0.960, 0.941);       // #F7F5F0
    vec3 shadowDawn = vec3(0.918, 0.902, 0.875);   // #EAE6DF
    vec3 sunDawn = vec3(0.750, 0.610, 0.420);      // Warm Bronze Caustic

    // 1: ZENITH TIMBER (Hinoki Gold, Warm Sand, Deep Ochre Light)
    vec3 bgZenith = vec3(0.949, 0.929, 0.894);     // Warm Hinoki Alabaster
    vec3 shadowZenith = vec3(0.878, 0.843, 0.788);
    vec3 sunZenith = vec3(0.680, 0.500, 0.290);

    // 2: NOCTURNE CONCRETE ( Basalt / Obsidian / Warm Bronze Moonlight )
    vec3 bgNocturne = vec3(0.925, 0.918, 0.902);   // Cool Architectural Concrete
    vec3 shadowNocturne = vec3(0.845, 0.835, 0.815);
    vec3 sunNocturne = vec3(0.540, 0.460, 0.360);

    vec3 baseCol = bgDawn;
    vec3 shadowCol = shadowDawn;
    vec3 sunCol = sunDawn;

    if (u_mode > 0.5 && u_mode < 1.5) {
      baseCol = bgZenith;
      shadowCol = shadowZenith;
      sunCol = sunZenith;
    } else if (u_mode >= 1.5) {
      baseCol = bgNocturne;
      shadowCol = shadowNocturne;
      sunCol = sunNocturne;
    }

    vec3 col = mix(shadowCol, baseCol, grain * 0.75 + 0.25);
    col = mix(col, sunCol, causticBeam * 0.13);

    // Subtle cursor caustic spotlight halo
    float halo = exp(-dist * 3.8) * (0.09 + u_velocity * 0.12);
    col += sunCol * halo;

    col += microGrain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export const LIGHTING_MODES = [
  { id: 0, code: 'MODE 01', label: 'DAWN MONOLITH', kelvin: '3200K', azimuth: '118° ESE' },
  { id: 1, code: 'MODE 02', label: 'ZENITH TIMBER', kelvin: '4800K', azimuth: '180° S' },
  { id: 2, code: 'MODE 03', label: 'SLATE CONCRETE', kelvin: '6200K', azimuth: '248° WSW' },
];

export default function ArchitecturalShaderCanvas({ lightingMode = 0, onTelemetryUpdate }) {
  const canvasRef = useRef(null);
  const modeRef = useRef(lightingMode);

  useEffect(() => {
    modeRef.current = lightingMode;
  }, [lightingMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' });
    let program = null;
    let uniforms = {};

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    if (gl) {
      const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (vs && fs) {
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.useProgram(program);
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
          );

          const posLoc = gl.getAttribLocation(program, 'a_position');
          gl.enableVertexAttribArray(posLoc);
          gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

          uniforms = {
            u_resolution: gl.getUniformLocation(program, 'u_resolution'),
            u_time: gl.getUniformLocation(program, 'u_time'),
            u_mouse: gl.getUniformLocation(program, 'u_mouse'),
            u_velocity: gl.getUniformLocation(program, 'u_velocity'),
            u_scroll: gl.getUniformLocation(program, 'u_scroll'),
            u_mode: gl.getUniformLocation(program, 'u_mode'),
          };
        } else {
          gl = null;
        }
      } else {
        gl = null;
      }
    }

    const ctx2d = !gl ? canvas.getContext('2d') : null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: 0.65, y: 0.35, targetX: 0.65, targetY: 0.35, vel: 0 };
    let scrollNorm = 0;

    const onMouseMove = (e) => {
      const nx = e.clientX / Math.max(window.innerWidth, 1);
      const ny = 1.0 - e.clientY / Math.max(window.innerHeight, 1);
      const dx = nx - mouse.targetX;
      const dy = ny - mouse.targetY;
      mouse.vel = Math.min(1.0, mouse.vel + Math.hypot(dx, dy) * 3.5);
      mouse.targetX = nx;
      mouse.targetY = ny;
    };

    const onScroll = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollNorm = window.scrollY / maxScroll;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    let rafId;
    const startTime = performance.now();
    let frameCount = 0;

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;
      mouse.x += (mouse.targetX - mouse.x) * 0.07;
      mouse.y += (mouse.targetY - mouse.y) * 0.07;
      mouse.vel *= 0.92;

      if (gl && program) {
        gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
        gl.uniform1f(uniforms.u_time, elapsed);
        gl.uniform2f(uniforms.u_mouse, mouse.x, mouse.y);
        gl.uniform1f(uniforms.u_velocity, mouse.vel);
        gl.uniform1f(uniforms.u_scroll, scrollNorm);
        gl.uniform1f(uniforms.u_mode, modeRef.current);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        // Graceful 2D atmospheric caustic fallback
        const w = canvas.width;
        const h = canvas.height;
        ctx2d.fillStyle = modeRef.current === 1 ? '#F2EDE4' : modeRef.current === 2 ? '#ECEAE6' : '#F7F5F0';
        ctx2d.fillRect(0, 0, w, h);

        const grad = ctx2d.createRadialGradient(
          mouse.x * w,
          (1 - mouse.y) * h,
          10,
          mouse.x * w,
          (1 - mouse.y) * h,
          Math.max(w, h) * 0.55
        );
        grad.addColorStop(0, 'rgba(154, 123, 79, 0.14)');
        grad.addColorStop(1, 'rgba(247, 245, 240, 0)');
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, w, h);
      }

      frameCount++;
      if (frameCount % 6 === 0 && onTelemetryUpdate) {
        onTelemetryUpdate({
          mouseX: mouse.x,
          mouseY: mouse.y,
          velocity: mouse.vel,
          scroll: scrollNorm,
        });
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [onTelemetryUpdate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
