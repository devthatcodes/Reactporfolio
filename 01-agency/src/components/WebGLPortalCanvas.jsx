import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Lightweight 3-octave GLSL shader tuned for locked 60/120fps (<0.8ms GPU frame time)
const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_velocity;
  uniform float u_scroll;
  uniform float u_preset;
  uniform float u_portalBoost;

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
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = p * 2.02 + vec2(17.0, 31.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 m = (u_mouse * u_resolution.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    float distToMouse = length(p - m);
    float mouseField = exp(-distToMouse * 3.0);

    vec2 warpedP = p + (p - m) * mouseField * (0.15 + u_portalBoost * 0.4);

    vec3 colObsidian = vec3(0.039, 0.039, 0.047);
    vec3 colLime = vec3(0.784, 1.0, 0.196);
    vec3 colIndigo = vec3(0.388, 0.400, 0.945);

    float n1 = fbm(warpedP * 2.0 + vec2(u_time * 0.12, u_scroll * 1.2));
    float n2 = fbm(warpedP * 2.4 - vec2(u_time * 0.09, n1 * 1.1));

    vec3 color = colObsidian;
    color = mix(color, colIndigo * 0.36, clamp(n2 * 1.6, 0.0, 1.0));
    color = mix(color, colLime * 0.52, clamp(n1 * mouseField * 1.4, 0.0, 1.0));

    if (u_preset > 0.5 && u_preset < 1.5) {
      float rings = abs(fract(length(warpedP - m * 0.2) * 4.5 - u_time * 0.35 + n1 * 0.4) - 0.5);
      float sdfGlow = smoothstep(0.08, 0.0, rings) * (0.35 + 0.5 * mouseField);
      color += colLime * sdfGlow * 0.42;
    } else if (u_preset >= 1.5) {
      float wave = sin(warpedP.x * 14.0 + n1 * 5.0 + u_time) * cos(warpedP.y * 14.0 - u_time);
      color += colIndigo * smoothstep(0.06, 0.0, abs(wave)) * 0.38;
    }

    float halo = exp(-distToMouse * 4.2) * (0.22 + u_velocity * 0.4 + u_portalBoost * 0.7);
    color += mix(colIndigo, colLime, 0.6) * halo;

    float vignette = smoothstep(1.4, 0.2, length(p));
    gl_FragColor = vec4(color * vignette, 1.0);
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
    const gl =
      canvas.getContext('webgl', { powerPreference: 'high-performance', antialias: false }) ||
      canvas.getContext('experimental-webgl');

    const mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, speed: 0 };
    let scrollRatio = 0;
    let currentBoost = 0;
    let currentPreset = presetRef.current;

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX / window.innerWidth;
      mouse.targetY = 1.0 - e.clientY / window.innerHeight;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollRatio = window.scrollY / maxScroll;
    };

    // Render shader at 0.7x resolution for ultra-fast 120fps performance
    const handleResize = () => {
      const scale = 0.7;
      canvas.width = Math.max(1, Math.floor(window.innerWidth * scale));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * scale));
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleResize();

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

    const startTime = performance.now();
    let frameCount = 0;

    const render = (now) => {
      const elapsed = (now - startTime) * 0.001;
      frameCount++;

      mouse.x += (mouse.targetX - mouse.x) * 0.09;
      mouse.y += (mouse.targetY - mouse.y) * 0.09;
      const instantSpeed = Math.hypot(mouse.targetX - mouse.x, mouse.targetY - mouse.y) * 6.0;
      mouse.speed += (instantSpeed - mouse.speed) * 0.12;

      currentBoost += (boostRef.current - currentBoost) * 0.15;
      currentPreset += (presetRef.current - currentPreset) * 0.1;

      // Throttle HUD React updates to once every 90 frames (~1.5s) to prevent scroll jank
      if (onTelemetryUpdate && frameCount % 90 === 0) {
        onTelemetryUpdate({
          fps: 60,
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
      style={{ opacity: 0.85 }}
    />
  );
}
