import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_velocity;
  uniform float u_scroll;
  uniform float u_preset;
  uniform float u_portalBoost;

  // Hash & 2D Simplex-style noise
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
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 m = (u_mouse * u_resolution.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    float distToMouse = length(p - m);
    float mouseField = exp(-distToMouse * (3.2 - clamp(u_velocity * 1.5, 0.0, 2.0)));

    // Chromatic & portal warp
    float warpStrength = 0.18 + u_velocity * 0.35 + u_portalBoost * 0.65;
    vec2 warpedP = p + normalize(p - m + 0.001) * mouseField * warpStrength * sin(distToMouse * 14.0 - u_time * 3.5);

    // Base Obsidian palette
    vec3 colObsidian = vec3(0.035, 0.035, 0.048);
    vec3 colLime = vec3(0.784, 1.0, 0.196);
    vec3 colIndigo = vec3(0.388, 0.400, 0.945);
    vec3 colCyan = vec3(0.0, 0.92, 1.0);

    // Domain-warped FBM liquid field (Preset 0 default)
    vec2 q = vec2(0.0);
    q.x = fbm(warpedP * 2.1 + 0.12 * u_time + u_scroll * 1.4);
    q.y = fbm(warpedP * 2.1 + vec2(1.0) - 0.1 * u_time);

    vec2 r = vec2(0.0);
    r.x = fbm(warpedP * 1.8 + 1.2 * q + vec2(1.7, 9.2) + 0.15 * u_time);
    r.y = fbm(warpedP * 1.8 + 1.2 * q + vec2(8.3, 2.8) + 0.126 * u_time);

    float f = fbm(warpedP * 1.6 + r);

    // Preset 1: Cybernetic SDF Tunnel Rings (Active Theory Work Tunnel feel)
    float tunnelRadius = length(warpedP - m * 0.25);
    float rings = abs( fract(tunnelRadius * 5.5 - u_time * 0.45 + f * 0.6) - 0.5 );
    float sdfGlow = smoothstep(0.09, 0.0, rings) * (0.45 + 0.55 * mouseField);

    // Preset 2: Quantum Contour Interference Grid
    vec2 gridUV = fract((warpedP + vec2(u_scroll * 0.4, u_time * 0.04)) * 9.0) - 0.5;
    float gridLine = min(abs(gridUV.x), abs(gridUV.y));
    float contour = smoothstep(0.035, 0.0, gridLine) * 0.35;

    // Combine based on u_preset
    vec3 color = colObsidian;
    color = mix(color, colIndigo * 0.42, clamp(f * f * 2.2, 0.0, 1.0));
    color = mix(color, colLime * 0.65, clamp(length(q) * 0.45 * (mouseField + 0.2), 0.0, 1.0));

    if (u_preset > 0.5 && u_preset < 1.5) {
      // Tunnel emphasis
      color += colLime * sdfGlow * 0.48 + colIndigo * (1.0 - smoothstep(0.0, 0.8, tunnelRadius)) * 0.35;
    } else if (u_preset >= 1.5 && u_preset < 2.5) {
      // Quantum interference emphasis
      float wave = sin(warpedP.x * 16.0 + f * 6.0 + u_time) * cos(warpedP.y * 16.0 - f * 5.0 - u_time);
      float iso = smoothstep(0.04, 0.0, abs(wave));
      color += mix(colIndigo, colCyan, mouseField) * iso * 0.42 + colLime * contour * 0.4;
    } else {
      // Default hybrid Active Theory Fluid + subtle SDF + Grid
      color += colLime * sdfGlow * 0.22;
      color += colIndigo * contour * 0.35;
    }

    // Cursor energy halo + chromatic aberration pulse on transition/velocity
    float halo = exp(-distToMouse * 4.5) * (0.28 + u_velocity * 0.65 + u_portalBoost * 0.9);
    color += mix(colIndigo, colLime, 0.6) * halo;

    // Subtle scanline & vignette
    float scanline = sin(gl_FragCoord.y * 1.4 + u_time * 8.0) * 0.015;
    float vignette = smoothstep(1.35, 0.22, length(p));
    color = (color + scanline) * vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function WebGLPortalCanvas({
  shaderPreset = 0,
  portalBoost = 0,
  onTelemetryUpdate,
}) {
  const canvasRef = useRef(null);
  const presetRef = useRef(shaderPreset);
  const boostRef = useRef(portalBoost);

  useEffect(() => {
    presetRef.current = shaderPreset;
  }, [shaderPreset]);

  useEffect(() => {
    boostRef.current = portalBoost;
  }, [portalBoost]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId = null;
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, vx: 0, vy: 0, speed: 0 };
    let scrollRatio = 0;
    let currentBoost = 0;
    let currentPreset = presetRef.current;

    const handleMouseMove = (e) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1.0 - e.clientY / window.innerHeight;
      mouse.vx = nx - mouse.targetX;
      mouse.vy = ny - mouse.targetY;
      mouse.targetX = nx;
      mouse.targetY = ny;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRatio = window.scrollY / maxScroll;
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleResize();

    // Compile shader helper
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

    let program = null;
    let uniforms = {};

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
            res: gl.getUniformLocation(program, 'u_resolution'),
            time: gl.getUniformLocation(program, 'u_time'),
            mouse: gl.getUniformLocation(program, 'u_mouse'),
            vel: gl.getUniformLocation(program, 'u_velocity'),
            scroll: gl.getUniformLocation(program, 'u_scroll'),
            preset: gl.getUniformLocation(program, 'u_preset'),
            boost: gl.getUniformLocation(program, 'u_portalBoost'),
          };
        } else {
          program = null;
        }
      }
    }

    // 2D fallback context if WebGL is unavailable
    const ctx2d = !program ? canvas.getContext('2d') : null;
    const startTime = performance.now();
    let lastFrameTime = startTime;
    let frameCount = 0;

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;
      frameCount++;

      // Smooth lerp mouse & velocity
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      const instantSpeed = Math.hypot(mouse.targetX - mouse.x, mouse.targetY - mouse.y) * 8.0;
      mouse.speed += (instantSpeed - mouse.speed) * 0.12;

      currentBoost += (boostRef.current - currentBoost) * 0.14;
      currentPreset += (presetRef.current - currentPreset) * 0.08;

      if (onTelemetryUpdate && frameCount % 12 === 0) {
        const dt = Math.max(1, now - lastFrameTime);
        const fps = Math.min(60, Math.round((12 * 1000) / dt));
        lastFrameTime = now;
        onTelemetryUpdate({
          fps,
          velocity: mouse.speed.toFixed(2),
          mouseX: Math.round(mouse.x * 100),
          mouseY: Math.round((1 - mouse.y) * 100),
        });
      }

      if (gl && program) {
        gl.uniform2f(uniforms.res, canvas.width, canvas.height);
        gl.uniform1f(uniforms.time, elapsed);
        gl.uniform2f(uniforms.mouse, mouse.x, mouse.y);
        gl.uniform1f(uniforms.vel, mouse.speed);
        gl.uniform1f(uniforms.scroll, scrollRatio);
        gl.uniform1f(uniforms.preset, currentPreset);
        gl.uniform1f(uniforms.boost, currentBoost);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        const w = canvas.width;
        const h = canvas.height;
        ctx2d.fillStyle = '#0A0A0C';
        ctx2d.fillRect(0, 0, w, h);

        const gx = mouse.x * w;
        const gy = (1 - mouse.y) * h;
        const grad = ctx2d.createRadialGradient(gx, gy, 10, gx, gy, Math.max(w, h) * 0.45);
        grad.addColorStop(0, 'rgba(200, 255, 50, 0.16)');
        grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.10)');
        grad.addColorStop(1, 'rgba(10, 10, 12, 0)');
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
  }, [onTelemetryUpdate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.88 }}
    />
  );
}
