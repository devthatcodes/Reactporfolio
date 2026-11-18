import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_velocity;
  uniform float u_scroll;
  uniform float u_mode;

  // 2D Simplex-like hash & noise
  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(in vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;
    vec2 m = (u_mouse - 0.5) * aspect;

    // Cursor gravitational warp
    float dist = length(p - m);
    float warpStrength = (0.14 + u_velocity * 0.25) * exp(-dist * 3.8);
    vec2 dir = normalize(p - m + 0.0001);
    vec2 warpedP = p - dir * warpStrength;

    // Scroll & time evolution
    float t = u_time * 0.32;
    warpedP.y -= u_scroll * 0.00035;

    // Mode 0: TENSOR FIELD | Mode 1: QUANTUM FLUX | Mode 2: SYNAPTIC GRID
    float n1 = noise(warpedP * (2.6 + u_mode * 0.8) + vec2(t, -t * 0.6));
    float n2 = noise(warpedP * (5.2 + u_mode * 1.4) - vec2(t * 0.7, t * 0.5) + n1 * 0.65);

    // Cybernetic perspective grid lines
    vec2 gridUV = warpedP * (12.0 + u_mode * 4.0);
    gridUV += vec2(sin(t + warpedP.y * 4.0) * 0.25, cos(t + warpedP.x * 4.0) * 0.25) * (1.0 - u_mode * 0.35);
    vec2 grid = abs(fract(gridUV - 0.5) - 0.5) / fwidth(gridUV + 0.001);
    float line = min(grid.x, grid.y);
    float gridMask = 1.0 - min(line, 1.0);

    // Chromatic plasma wave ribbons
    float wave = sin(warpedP.x * 6.0 + n1 * 3.5 + t * 1.6) * cos(warpedP.y * 5.0 + n2 * 3.0 - t);
    float ribbon = smoothstep(0.45, 0.0, abs(wave) - 0.08 * u_velocity);

    // Palette definitions
    vec3 bgDark = vec3(0.035, 0.035, 0.043); // #09090B
    vec3 cyan = vec3(0.133, 0.827, 0.933);   // #22D3EE
    vec3 violet = vec3(0.545, 0.361, 0.965); // #8B5CF6
    vec3 emerald = vec3(0.204, 0.827, 0.600);// #34D399

    vec3 primaryCol = mix(cyan, emerald, clamp(u_mode - 0.5, 0.0, 1.0));
    vec3 secondaryCol = mix(violet, cyan, clamp(u_mode * 0.5, 0.0, 1.0));

    // Combine field layers
    vec3 color = bgDark;
    color += primaryCol * ribbon * (0.14 + u_velocity * 0.12);
    color += secondaryCol * max(0.0, n2) * 0.13;
    color += mix(primaryCol, secondaryCol, uv.x) * gridMask * (0.065 + u_mode * 0.035);

    // Cursor core aura & chromatic halo
    float cursorGlow = exp(-dist * 5.2) * (0.24 + u_velocity * 0.35);
    color += mix(cyan, violet, sin(u_time * 2.0) * 0.5 + 0.5) * cursorGlow;

    // Subtle vignette
    float vig = 1.0 - smoothstep(0.35, 1.15, length((uv - 0.5) * vec2(1.1, 1.1)));
    color *= mix(0.65, 1.0, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function NeuralShaderCanvas({ shaderMode = 0, onFpsUpdate }) {
  const canvasRef = useRef(null);
  const modeRef = useRef(shaderMode);

  useEffect(() => {
    modeRef.current = shaderMode;
  }, [shaderMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let rafId = null;
    let gl = canvas.getContext('webgl', { antialias: false, depth: false, stencil: false });
    if (!gl) {
      gl = canvas.getContext('experimental-webgl');
    }

    // Mouse & scroll tracking with smooth lerp
    const state = {
      targetX: 0.5,
      targetY: 0.5,
      currX: 0.5,
      currY: 0.5,
      velocity: 0,
      scroll: window.scrollY || 0,
      currMode: modeRef.current,
    };

    const handleMouseMove = (e) => {
      const nx = e.clientX / Math.max(1, window.innerWidth);
      const ny = 1.0 - e.clientY / Math.max(1, window.innerHeight);
      const dx = nx - state.targetX;
      const dy = ny - state.targetY;
      state.velocity = Math.min(1.5, state.velocity + Math.hypot(dx, dy) * 3.5);
      state.targetX = nx;
      state.targetY = ny;
    };

    const handleScroll = () => {
      state.scroll = window.scrollY || 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

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
      gl.getExtension('OES_standard_derivatives');
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
          program = null;
        }
      }
    }

    // 2D fallback context if WebGL fails
    const ctx2d = !program ? canvas.getContext('2d') : null;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      if (gl && program) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const startTime = performance.now();
    let frameCount = 0;
    let lastFpsCheck = startTime;

    const render = (now) => {
      frameCount += 1;
      if (now - lastFpsCheck >= 600) {
        const currentFps = Math.min(60, Math.round((frameCount * 1000) / (now - lastFpsCheck)));
        if (onFpsUpdate) onFpsUpdate(currentFps);
        frameCount = 0;
        lastFpsCheck = now;
      }

      // Smooth lerp cursor & mode
      state.currX += (state.targetX - state.currX) * 0.08;
      state.currY += (state.targetY - state.currY) * 0.08;
      state.velocity *= 0.92;
      state.currMode += (modeRef.current - state.currMode) * 0.07;

      const elapsed = (now - startTime) * 0.001;

      if (gl && program) {
        gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
        gl.uniform1f(uniforms.u_time, elapsed);
        gl.uniform2f(uniforms.u_mouse, state.currX, state.currY);
        gl.uniform1f(uniforms.u_velocity, state.velocity);
        gl.uniform1f(uniforms.u_scroll, state.scroll);
        gl.uniform1f(uniforms.u_mode, state.currMode);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        const w = canvas.width;
        const h = canvas.height;
        ctx2d.fillStyle = '#09090B';
        ctx2d.fillRect(0, 0, w, h);

        const gx = state.currX * w;
        const gy = (1 - state.currY) * h;
        const grad = ctx2d.createRadialGradient(gx, gy, 10, gx, gy, Math.max(w, h) * 0.45);
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.16)');
        grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
        grad.addColorStop(1, 'rgba(9, 9, 11, 0)');
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, w, h);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [onFpsUpdate]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
    />
  );
}
