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
  precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_velocity;
  uniform float u_scroll;
  uniform float u_mode;
  uniform float u_pulse;

  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

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

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 mouseP = (u_mouse - 0.5) * vec2(aspect, 1.0);

    // Distance to cursor for gravitational lens / ripple distortion
    float dMouse = length(p - mouseP);
    float ripple = sin(dMouse * 28.0 - u_time * 5.5) * exp(-dMouse * 4.2) * (0.018 + u_velocity * 0.045 + u_pulse * 0.05);
    vec2 warpedP = p + normalize(p - mouseP + 0.0001) * ripple;

    // Slight perspective tilt driven by scroll & mode
    warpedP.y += (u_scroll * 0.18);
    warpedP *= rot(0.06 * sin(u_time * 0.25) + u_mode * 0.18);

    // Quantum Liquidity Grid
    vec2 gridScale = warpedP * (12.0 + u_mode * 2.5);
    gridScale.x += u_time * 0.35;
    gridScale.y += sin(warpedP.x * 3.5 + u_time * 0.8) * 0.35;

    vec2 gridFract = abs(fract(gridScale - 0.5) - 0.5) / fwidth(gridScale * 0.0 + 0.045);
    float gridLine = min(gridFract.x, gridFract.y);
    float gridMask = smoothstep(1.2, 0.0, gridLine) * 0.16;

    // Orbital Liquidity Corridor Arcs (SDF rings)
    float arcAccum = 0.0;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      vec2 center = vec2(
        sin(u_time * (0.22 + fi * 0.07) + fi * 1.7) * 0.35,
        cos(u_time * (0.18 + fi * 0.05) + fi * 2.1) * 0.22
      );
      float radius = 0.26 + fi * 0.14 + u_pulse * 0.08;
      float ringDist = abs(length(warpedP - center) - radius);
      float angle = atan(warpedP.y - center.y, warpedP.x - center.x);
      float packet = smoothstep(0.2, 1.0, sin(angle * (3.0 + fi) - u_time * (2.2 + fi * 0.6)));
      float glow = (0.0022 / (ringDist + 0.0025)) * (0.35 + 0.65 * packet);
      arcAccum += glow;
    }

    // Flowing Quantum Wave Field
    float n1 = noise(warpedP * 3.8 + vec2(u_time * 0.3, -u_time * 0.2));
    float n2 = noise(warpedP * 7.5 - vec2(u_time * 0.45, u_time * 0.25));
    float waveField = smoothstep(0.25, 0.85, n1 * 0.65 + n2 * 0.35);

    // Palette shifts based on network mode:
    // Mode 0: FX CORRIDOR (Emerald #10B981 + Cyan #06B6D4)
    // Mode 1: TREASURY YIELD (Gold/Emerald #34D399 + Cobalt #3B82F6)
    // Mode 2: ZERO-KNOWLEDGE VAULT (Violet/Cyan #38BDF8 + Indigo #6366F1)
    vec3 baseBg = vec3(0.012, 0.027, 0.071); // #030712 Obsidian
    vec3 colPrimary = mix(
      vec3(0.063, 0.725, 0.506), // Emerald
      vec3(0.024, 0.714, 0.831), // Cyan
      clamp(u_mode * 0.5, 0.0, 1.0)
    );
    if (u_mode > 1.5) {
      colPrimary = vec3(0.22, 0.74, 0.97); // Cyber Sky/Cyan
    }
    vec3 colSecondary = vec3(0.145, 0.388, 0.922); // Cobalt #2563EB

    // Cursor spotlight aura
    float cursorGlow = exp(-dMouse * (3.2 - min(u_velocity * 0.8, 1.5))) * (0.28 + u_velocity * 0.25 + u_pulse * 0.35);

    vec3 color = baseBg;
    color += colSecondary * waveField * 0.14;
    color += colPrimary * gridMask * (0.45 + cursorGlow * 1.4);
    color += mix(colPrimary, colSecondary, 0.4) * arcAccum * 0.42;
    color += colPrimary * cursorGlow * 0.48;

    // Subtle vignette for crisp legibility
    float vig = smoothstep(1.35, 0.25, length(p));
    color *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function LiquidityShaderCanvas({
  networkMode = 0,
  pulseTrigger = 0,
  onFpsUpdate,
  onCursorTelemetry,
}) {
  const canvasRef = useRef(null);
  const modeRef = useRef(networkMode);
  const pulseRef = useRef(0);

  useEffect(() => {
    modeRef.current = networkMode;
    pulseRef.current = 1.0;
  }, [networkMode, pulseTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId;
    let gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });

    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, vx: 0, vy: 0, speed: 0 };
    let scrollNorm = 0;

    const handleMouseMove = (e) => {
      const nx = e.clientX / Math.max(window.innerWidth, 1);
      const ny = 1.0 - e.clientY / Math.max(window.innerHeight, 1);
      const dx = nx - mouse.targetX;
      const dy = ny - mouse.targetY;
      mouse.speed = Math.min(2.5, Math.hypot(dx, dy) * 32);
      mouse.targetX = nx;
      mouse.targetY = ny;
      if (onCursorTelemetry) {
        onCursorTelemetry({
          x: Math.round(e.clientX),
          y: Math.round(e.clientY),
          vel: mouse.speed.toFixed(2),
        });
      }
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollNorm = window.scrollY / maxScroll;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const compileShader = (ctx, type, source) => {
      const s = ctx.createShader(type);
      ctx.shaderSource(s, source);
      ctx.compileShader(s);
      if (!ctx.getShaderParameter(s, ctx.COMPILE_STATUS)) {
        ctx.deleteShader(s);
        return null;
      }
      return s;
    };

    let program = null;
    let uniforms = {};

    if (gl) {
      // Enable standard derivatives if WebGL1 for fwidth fallback safety
      gl.getExtension('OES_standard_derivatives');
      const safeFrag = FRAGMENT_SHADER.replace(
        'fwidth(gridScale * 0.0 + 0.045)',
        '0.045'
      );
      const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, safeFrag);

      if (vs && fs) {
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.useProgram(program);
          const buf = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
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
            u_pulse: gl.getUniformLocation(program, 'u_pulse'),
          };
        } else {
          program = null;
        }
      }
    }

    // 2D fallback context if WebGL is unavailable
    const ctx2d = !program ? canvas.getContext('2d') : null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      if (gl && program) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let startTime = performance.now();
    let frameCount = 0;
    let lastFpsTime = performance.now();
    let smoothMode = modeRef.current;

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;
      frameCount++;
      if (now - lastFpsTime >= 600) {
        const currentFps = Math.min(120, Math.round((frameCount * 1000) / (now - lastFpsTime)));
        if (onFpsUpdate) onFpsUpdate(currentFps);
        frameCount = 0;
        lastFpsTime = now;
      }

      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;
      mouse.speed *= 0.92;
      pulseRef.current *= 0.93;
      smoothMode += (modeRef.current - smoothMode) * 0.08;

      if (gl && program) {
        gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
        gl.uniform1f(uniforms.u_time, elapsed);
        gl.uniform2f(uniforms.u_mouse, mouse.x, mouse.y);
        gl.uniform1f(uniforms.u_velocity, mouse.speed);
        gl.uniform1f(uniforms.u_scroll, scrollNorm);
        gl.uniform1f(uniforms.u_mode, smoothMode);
        gl.uniform1f(uniforms.u_pulse, pulseRef.current);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        const w = canvas.width;
        const h = canvas.height;
        ctx2d.fillStyle = '#030712';
        ctx2d.fillRect(0, 0, w, h);

        const grad = ctx2d.createRadialGradient(
          mouse.x * w,
          (1 - mouse.y) * h,
          10,
          mouse.x * w,
          (1 - mouse.y) * h,
          Math.max(w, h) * 0.45
        );
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
        grad.addColorStop(0.5, 'rgba(37, 99, 235, 0.09)');
        grad.addColorStop(1, 'rgba(3, 7, 18, 0)');
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, w, h);

        // Draw animated orbital corridor arcs
        ctx2d.strokeStyle = 'rgba(16, 185, 129, 0.16)';
        ctx2d.lineWidth = 1.2;
        for (let i = 0; i < 4; i++) {
          ctx2d.beginPath();
          const r = (0.18 + i * 0.09) * Math.min(w, h);
          ctx2d.arc(w * 0.5, h * 0.5, r, elapsed * (0.4 + i * 0.15), elapsed * (0.4 + i * 0.15) + Math.PI * 1.35);
          ctx2d.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
