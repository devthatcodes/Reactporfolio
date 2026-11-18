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
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_velocity;
  uniform float u_scroll;
  uniform float u_roastMode;

  // 2D Simplex-style hash & noise for organic espresso crema & thermal waves
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = rot * p * 2.03 + vec2(0.12 * u_time, -0.08 * u_time);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(1.0, u_resolution.y);
    vec2 st = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 mouseSt = (u_mouse - 0.5) * vec2(aspect, 1.0);

    // Distance to cursor + velocity swirl distortion
    vec2 toMouse = st - mouseSt;
    float dist = length(toMouse);
    float ripple = exp(-dist * 4.5) * (0.14 + min(0.28, u_velocity * 0.25));
    float angle = atan(toMouse.y, toMouse.x) + ripple * sin(u_time * 3.0 - dist * 14.0);
    vec2 warpedSt = st + vec2(cos(angle), sin(angle)) * ripple * 0.35;
    warpedSt.y += u_scroll * 0.28;

    // Domain-warped organic fluid crema
    vec2 q = vec2(
      fbm(warpedSt * 2.1 + vec2(0.0, u_time * 0.09)),
      fbm(warpedSt * 2.1 + vec2(5.2, 1.3 - u_time * 0.07))
    );

    vec2 r = vec2(
      fbm(warpedSt * 2.6 + 3.2 * q + vec2(1.7, 9.2) + 0.11 * u_time),
      fbm(warpedSt * 2.6 + 3.2 * q + vec2(8.3, 2.8) + 0.09 * u_time)
    );

    float f = fbm(warpedSt * 2.2 + 2.5 * r);

    // Topographic elevation contour lines
    float contour = smoothstep(0.03, 0.0, abs(fract(f * 7.5) - 0.5) - 0.44);

    // Palette definitions per Roast Mode:
    // 0: LIGHT FLORAL (Warm parchment, jasmine sage, bright bergamot terracotta)
    vec3 baseLight = vec3(0.984, 0.972, 0.953);
    vec3 midLight = vec3(0.925, 0.890, 0.835);
    vec3 accentLight = vec3(0.784, 0.353, 0.196);
    vec3 botLight = vec3(0.369, 0.455, 0.380);

    // 1: MEDIUM CARAMEL (Toasted honey, panela amber, warm umber crema)
    vec3 baseMed = vec3(0.965, 0.935, 0.890);
    vec3 midMed = vec3(0.865, 0.760, 0.655);
    vec3 accentMed = vec3(0.810, 0.410, 0.160);
    vec3 botMed = vec3(0.450, 0.310, 0.220);

    // 2: DARK OBSIDIAN (Rich cacao crema, volcanic ember, warm espresso)
    vec3 baseDark = vec3(0.945, 0.915, 0.870);
    vec3 midDark = vec3(0.790, 0.695, 0.610);
    vec3 accentDark = vec3(0.659, 0.275, 0.137);
    vec3 botDark = vec3(0.227, 0.165, 0.133);

    float m1 = clamp(u_roastMode, 0.0, 1.0);
    float m2 = clamp(u_roastMode - 1.0, 0.0, 1.0);

    vec3 cBase = mix(mix(baseLight, baseMed, m1), baseDark, m2);
    vec3 cMid = mix(mix(midLight, midMed, m1), midDark, m2);
    vec3 cAccent = mix(mix(accentLight, accentMed, m1), accentDark, m2);
    vec3 cBot = mix(mix(botLight, botMed, m1), botDark, m2);

    vec3 col = mix(cBase, cMid, clamp(f * f * 2.2 + 0.35, 0.0, 1.0));
    col = mix(col, cAccent, clamp(length(q) * 0.28 + ripple * 0.55, 0.0, 0.38));
    col = mix(col, cBot, clamp(r.y * 0.24, 0.0, 0.25));

    // Add subtle topographic contour lines
    col = mix(col, cAccent * 0.85, contour * 0.11);

    // Cursor thermal aura glow
    float cursorGlow = exp(-dist * 3.8) * (0.12 + min(0.18, u_velocity * 0.2));
    col = mix(col, cAccent, cursorGlow);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function RoastShaderCanvas({
  roastMode = 0,
  className = 'fixed inset-0 pointer-events-none z-0 opacity-85',
}) {
  const canvasRef = useRef(null);
  const modeRef = useRef(roastMode);

  useEffect(() => {
    modeRef.current = roastMode;
  }, [roastMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId = null;
    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, vx: 0, vy: 0 };
    let scrollNorm = 0;
    let currentRoast = modeRef.current;

    const handleMouseMove = (e) => {
      const nx = e.clientX / Math.max(1, window.innerWidth);
      const ny = 1.0 - e.clientY / Math.max(1, window.innerHeight);
      mouse.vx = nx - mouse.targetX;
      mouse.vy = ny - mouse.targetY;
      mouse.targetX = nx;
      mouse.targetY = ny;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollNorm = window.scrollY / maxScroll;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const gl =
      canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' }) ||
      canvas.getContext('experimental-webgl');

    const compileShader = (ctx, type, source) => {
      const shader = ctx.createShader(type);
      ctx.shaderSource(shader, source);
      ctx.compileShader(shader);
      if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        ctx.deleteShader(shader);
        return null;
      }
      return shader;
    };

    let program = null;
    let uniforms = null;

    if (gl) {
      const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
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
            u_time: gl.getUniformLocation(program, 'u_time'),
            u_resolution: gl.getUniformLocation(program, 'u_resolution'),
            u_mouse: gl.getUniformLocation(program, 'u_mouse'),
            u_velocity: gl.getUniformLocation(program, 'u_velocity'),
            u_scroll: gl.getUniformLocation(program, 'u_scroll'),
            u_roastMode: gl.getUniformLocation(program, 'u_roastMode'),
          };
        } else {
          program = null;
        }
      }
    }

    const resize = () => {
      const dpr = 0.75;
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        if (gl && program) {
          gl.viewport(0, 0, width, height);
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const startTime = performance.now();
    const ctx2d = !program ? canvas.getContext('2d') : null;

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      mouse.vx *= 0.92;
      mouse.vy *= 0.92;
      const speed = Math.hypot(mouse.vx, mouse.vy) * 18.0;
      currentRoast += (modeRef.current - currentRoast) * 0.08;

      if (gl && program && uniforms) {
        gl.uniform1f(uniforms.u_time, elapsed);
        gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
        gl.uniform2f(uniforms.u_mouse, mouse.x, mouse.y);
        gl.uniform1f(uniforms.u_velocity, speed);
        gl.uniform1f(uniforms.u_scroll, scrollNorm);
        gl.uniform1f(uniforms.u_roastMode, currentRoast);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        // Graceful 2D Canvas organic thermal gradient fallback
        const w = canvas.width;
        const h = canvas.height;
        ctx2d.fillStyle = '#FBF8F3';
        ctx2d.fillRect(0, 0, w, h);

        const grad = ctx2d.createRadialGradient(
          mouse.x * w,
          (1 - mouse.y) * h,
          10,
          mouse.x * w,
          (1 - mouse.y) * h,
          Math.max(w, h) * 0.55
        );
        const colors = [
          'rgba(200, 90, 50, 0.14)',
          'rgba(94, 116, 97, 0.09)',
          'rgba(251, 248, 243, 0)',
        ];
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(0.5, colors[1]);
        grad.addColorStop(1, colors[2]);
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, w, h);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
