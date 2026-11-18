import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Ultra-sophisticated, silky 60/120fps Iridescent Silk & Chromatic Wave Shader
const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_scroll;
  uniform vec3 u_accent;

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 m = (u_mouse * u_resolution.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    float dist = length(p - m);
    float mouseGlow = exp(-dist * 2.8);

    // Flowing architectural silk ribbons
    vec2 q = p + (p - m) * mouseGlow * 0.14;
    float wave1 = sin(q.x * 3.2 + u_time * 0.35 + u_scroll * 2.5 + cos(q.y * 2.8 - u_time * 0.25));
    float wave2 = cos(q.y * 4.0 - u_time * 0.28 + sin(q.x * 3.5 + u_scroll * 1.8));
    float silk = smoothstep(-0.8, 0.9, wave1 * wave2);

    // Fine interference contour lines
    float contour = smoothstep(0.03, 0.0, abs(fract((wave1 + wave2) * 1.75) - 0.5));

    vec3 baseInk = vec3(0.024, 0.024, 0.032);
    vec3 warmChampagne = vec3(0.886, 0.851, 0.784);

    vec3 col = baseInk;
    col += u_accent * silk * 0.085;
    col += mix(u_accent, warmChampagne, 0.45) * mouseGlow * 0.14;
    col += u_accent * contour * (0.04 + mouseGlow * 0.08);

    // Soft vignette
    float vig = smoothstep(1.45, 0.15, length(p));
    gl_FragColor = vec4(col * vig, 1.0);
  }
`;

function hexToRgbNormalized(hex) {
  const clean = (hex || '#38BDF8').replace('#', '');
  const num = parseInt(clean, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

export default function PortfolioShaderCanvas({ accentColor = '#38BDF8' }) {
  const canvasRef = useRef(null);
  const targetAccentRef = useRef(hexToRgbNormalized(accentColor));

  useEffect(() => {
    targetAccentRef.current = hexToRgbNormalized(accentColor);
  }, [accentColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId = null;
    const gl =
      canvas.getContext('webgl', { powerPreference: 'high-performance', antialias: false }) ||
      canvas.getContext('experimental-webgl');

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const currentAccent = [...targetAccentRef.current];
    let scrollRatio = 0;

    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1.0 - e.clientY / window.innerHeight;
    };

    const onScroll = () => {
      const maxS = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRatio = window.scrollY / maxS;
    };

    const onResize = () => {
      const scale = 0.65;
      canvas.width = Math.max(1, Math.floor(window.innerWidth * scale));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * scale));
      if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onResize();

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };

    let program = null;
    let locs = {};

    if (gl) {
      const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
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
          const pLoc = gl.getAttribLocation(program, 'a_position');
          gl.enableVertexAttribArray(pLoc);
          gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);

          locs = {
            res: gl.getUniformLocation(program, 'u_resolution'),
            time: gl.getUniformLocation(program, 'u_time'),
            mouse: gl.getUniformLocation(program, 'u_mouse'),
            scroll: gl.getUniformLocation(program, 'u_scroll'),
            accent: gl.getUniformLocation(program, 'u_accent'),
          };
        } else {
          program = null;
        }
      }
    }

    const start = performance.now();
    const render = (now) => {
      const t = (now - start) * 0.001;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      const target = targetAccentRef.current;
      currentAccent[0] += (target[0] - currentAccent[0]) * 0.05;
      currentAccent[1] += (target[1] - currentAccent[1]) * 0.05;
      currentAccent[2] += (target[2] - currentAccent[2]) * 0.05;

      if (gl && program) {
        gl.uniform2f(locs.res, canvas.width, canvas.height);
        gl.uniform1f(locs.time, t);
        gl.uniform2f(locs.mouse, mouse.x, mouse.y);
        gl.uniform1f(locs.scroll, scrollRatio);
        gl.uniform3f(locs.accent, currentAccent[0], currentAccent[1], currentAccent[2]);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
