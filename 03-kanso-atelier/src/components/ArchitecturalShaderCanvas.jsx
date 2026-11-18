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
  precision lowp float;
  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_scroll;
  uniform float u_mode; // 0.0 = DAWN MONOLITH, 1.0 = ZENITH TIMBER, 2.0 = NOCTURNE CONCRETE

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

  // Lightweight 2-octave fbm for 60/120fps performance
  float fbm(vec2 p) {
    float v = 0.5 * noise(p);
    p = p * 2.02 + vec2(1.7, 9.2);
    v += 0.25 * noise(p);
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);

    float dist = length(p - m);

    // Architectural sun-slat caustic bands shifted by scroll & mouse solar azimuth
    float solarAngle = (u_mouse.x - 0.5) * 0.45 + u_scroll * 0.25;
    float c = cos(solarAngle);
    float s = sin(solarAngle);
    vec2 sunCoord = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);

    float louverPattern = sin((sunCoord.x * 16.0 + u_time * 0.14) + fbm(sunCoord * 3.0) * 1.8);
    float causticBeam = smoothstep(-0.2, 0.85, louverPattern) * smoothstep(1.1, 0.15, dist);

    float grain = fbm(uv * 6.0 + vec2(u_time * 0.02, -u_scroll * 0.3));

    // 0: DAWN MONOLITH (Warm Alabaster, Limestone, Bronze Sunbeam)
    vec3 baseCol = vec3(0.968, 0.960, 0.941);
    vec3 shadowCol = vec3(0.918, 0.902, 0.875);
    vec3 sunCol = vec3(0.750, 0.610, 0.420);

    if (u_mode > 0.5 && u_mode < 1.5) {
      baseCol = vec3(0.949, 0.929, 0.894);
      shadowCol = vec3(0.878, 0.843, 0.788);
      sunCol = vec3(0.680, 0.500, 0.290);
    } else if (u_mode >= 1.5) {
      baseCol = vec3(0.925, 0.918, 0.902);
      shadowCol = vec3(0.845, 0.835, 0.815);
      sunCol = vec3(0.540, 0.460, 0.360);
    }

    vec3 col = mix(shadowCol, baseCol, grain * 0.75 + 0.25);
    col = mix(col, sunCol, causticBeam * 0.12);

    float halo = exp(-dist * 3.6) * 0.08;
    col += sunCol * halo;

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

    let gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });
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
      // Cap DPR at 0.75 for silky-smooth 60/120fps fill-rate performance
      const dpr = 0.75;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const mouse = { x: 0.65, y: 0.35, targetX: 0.65, targetY: 0.35, vel: 0 };
    let scrollNorm = 0;

    const onMouseMove = (e) => {
      const nx = e.clientX / Math.max(window.innerWidth, 1);
      const ny = 1.0 - e.clientY / Math.max(window.innerHeight, 1);
      const dx = nx - mouse.targetX;
      const dy = ny - mouse.targetY;
      mouse.vel = Math.min(1.0, mouse.vel + Math.hypot(dx, dy) * 2.5);
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
    let lastTelemetryTime = 0;

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      mouse.vel *= 0.9;

      if (gl && program) {
        gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
        gl.uniform1f(uniforms.u_time, elapsed);
        gl.uniform2f(uniforms.u_mouse, mouse.x, mouse.y);
        gl.uniform1f(uniforms.u_scroll, scrollNorm);
        gl.uniform1f(uniforms.u_mode, modeRef.current);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        const w = canvas.width;
        const h = canvas.height;
        ctx2d.fillStyle =
          modeRef.current === 1 ? '#F2EDE4' : modeRef.current === 2 ? '#ECEAE6' : '#F7F5F0';
        ctx2d.fillRect(0, 0, w, h);
      }

      // Throttle telemetry React state updates to once per 1000ms to prevent scroll/render lag
      if (onTelemetryUpdate && now - lastTelemetryTime > 1000) {
        lastTelemetryTime = now;
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
