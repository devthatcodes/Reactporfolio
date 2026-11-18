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

  // Lightweight 2D hash & 3-octave FBM
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = p * 2.02 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;
    vec2 m = (u_mouse - 0.5) * aspect;

    // Cursor gravitational warp
    float dist = length(p - m);
    float warpStrength = (0.12 + u_velocity * 0.2) * exp(-dist * 3.8);
    vec2 dir = normalize(p - m + 0.0001);
    vec2 warpedP = p - dir * warpStrength;

    // Scroll & time evolution
    float t = u_time * 0.3;
    warpedP.y -= u_scroll * 0.0003;

    // 3-iteration FBM field
    float n1 = fbm(warpedP * (2.4 + u_mode * 0.7) + vec2(t, -t * 0.5));
    float n2 = noise(warpedP * (4.8 + u_mode * 1.2) - vec2(t * 0.6, t * 0.4) + n1 * 0.6);

    // Lightweight perspective grid lines without derivatives
    vec2 gridUV = fract(warpedP * (10.0 + u_mode * 3.0) + vec2(sin(t) * 0.15, cos(t) * 0.15));
    float lineX = smoothstep(0.04, 0.0, abs(gridUV.x - 0.5));
    float lineY = smoothstep(0.04, 0.0, abs(gridUV.y - 0.5));
    float gridMask = max(lineX, lineY);

    // Chromatic plasma wave ribbons
    float wave = sin(warpedP.x * 5.5 + n1 * 3.2 + t * 1.5) * cos(warpedP.y * 4.5 + n2 * 2.5 - t);
    float ribbon = smoothstep(0.42, 0.0, abs(wave) - 0.06 * u_velocity);

    // Palette definitions
    vec3 bgDark = vec3(0.035, 0.035, 0.043); // #09090B
    vec3 cyan = vec3(0.133, 0.827, 0.933);   // #22D3EE
    vec3 violet = vec3(0.545, 0.361, 0.965); // #8B5CF6
    vec3 emerald = vec3(0.204, 0.827, 0.600);// #34D399

    vec3 primaryCol = mix(cyan, emerald, clamp(u_mode - 0.5, 0.0, 1.0));
    vec3 secondaryCol = mix(violet, cyan, clamp(u_mode * 0.5, 0.0, 1.0));

    // Combine field layers
    vec3 color = bgDark;
    color += primaryCol * ribbon * (0.14 + u_velocity * 0.1);
    color += secondaryCol * n1 * 0.12;
    color += mix(primaryCol, secondaryCol, uv.x) * gridMask * (0.06 + u_mode * 0.03);

    // Cursor core aura
    float cursorGlow = exp(-dist * 5.2) * (0.22 + u_velocity * 0.3);
    color += mix(cyan, violet, sin(u_time * 2.0) * 0.5 + 0.5) * cursorGlow;

    // Subtle vignette
    float vig = 1.0 - smoothstep(0.35, 1.15, length((uv - 0.5) * vec2(1.1, 1.1)));
    color *= mix(0.65, 1.0, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function NeuralShaderCanvas({ shaderMode = 0, onFpsUpdate, onTelemetryUpdate }) {
  const canvasRef = useRef(null);
  const modeRef = useRef(shaderMode);

  useEffect(() => {
    modeRef.current = shaderMode;
  }, [shaderMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let rafId = null;
    let gl = canvas.getContext('webgl', {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    if (!gl) {
      gl = canvas.getContext('experimental-webgl');
    }

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

    const ctx2d = !program ? canvas.getContext('2d') : null;

    const handleResize = () => {
      const dpr = 0.8;
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
      // Throttle telemetry/FPS updates to once every 60 frames (~1 second)
      if (frameCount >= 60) {
        const elapsedMs = Math.max(1, now - lastFpsCheck);
        const currentFps = Math.min(60, Math.round((frameCount * 1000) / elapsedMs));
        if (onFpsUpdate) onFpsUpdate(currentFps);
        if (onTelemetryUpdate) onTelemetryUpdate(currentFps);
        frameCount = 0;
        lastFpsCheck = now;
      }

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
  }, [onFpsUpdate, onTelemetryUpdate]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
    />
  );
}
