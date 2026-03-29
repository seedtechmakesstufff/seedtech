"use client";

import { useEffect, useRef } from "react";

interface MattsCustomBackgroundProps {
  className?: string;
}

const TARGET_INTERVAL_MS = 1000 / 30;

const isSafari = typeof navigator !== "undefined"
  ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  : false;

const isMobile = typeof navigator !== "undefined"
  ? /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  : false;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;

  vec3 c_trueBlack = vec3(0.0, 0.0, 0.0);
  vec3 c_nearBlack = vec3(0.027, 0.067, 0.043);
  vec3 c_darkForest = vec3(0.071, 0.192, 0.118);
  vec3 c_emerald = vec3(0.122, 0.310, 0.188);
  vec3 c_brand = vec3(0.227, 0.565, 0.329);
  vec3 c_highlight = vec3(0.373, 0.659, 0.455);
  vec3 c_seam = vec3(0.788, 0.886, 0.820);

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);

    float t = u_time * 0.8;

    vec3 color = mix(c_emerald * 0.3, c_nearBlack, uv.y + 0.2);

    float w1 = sin(uv.x * 2.2 - t * 0.7) * 0.2
             + cos(uv.x * 1.5 + t * 0.5) * 0.15
             + 0.65;
    float m1 = smoothstep(0.2, -0.2, uv.y - w1);
    color = mix(color, c_darkForest, m1 * 0.8);

    float w2 = cos(uv.x * 2.8 + t * 1.1) * 0.18
             + sin(uv.x * 1.2 - t * 0.8) * 0.25
             + 0.5;
    float m2 = smoothstep(0.15, -0.15, uv.y - w2);
    color = mix(color, c_emerald, m2 * 0.9);

    float m2_crest = smoothstep(0.0, -0.2, uv.y - w2) * smoothstep(-0.3, 0.0, uv.y - w2);
    color += c_brand * m2_crest * 0.6;

    float w3 = sin(uv.x * 3.2 - t * 1.6) * 0.28
             + cos(uv.x * 1.7 + t * 1.0) * 0.22
             + sin(uv.x * 0.6 - t * 0.4) * 0.2
             + 0.4;

    float d3 = uv.y - w3;

    float shadow3 = smoothstep(0.18, -0.05, d3);
    color = mix(color, c_nearBlack, shadow3 * 0.9);

    float m3 = smoothstep(0.01, -0.15, d3);
    color = mix(color, c_emerald, m3);

    float crest3 = smoothstep(0.02, -0.2, d3) * smoothstep(-0.4, 0.0, d3);
    color += c_brand * crest3 * 0.85;

    float seam_core = smoothstep(0.0025, 0.0, abs(d3));
    float seam_halo = smoothstep(0.04, 0.0, abs(d3));

    float slope = cos(uv.x * 3.2 - t * 1.6) * 0.28 * 3.2;
    float reflection = smoothstep(-1.2, 1.2, slope);

    color += c_seam * seam_core * (0.7 + reflection * 0.5);
    color += c_highlight * seam_halo * (0.4 + reflection * 0.4);

    float w4 = sin(uv.x * 1.4 - t * 1.3 + 2.0) * 0.35 - 0.1;
    float m4 = smoothstep(0.35, -0.2, uv.y - w4);
    color = mix(color, c_nearBlack, m4 * 0.95);

    float m4_glow = smoothstep(0.2, -0.1, uv.y - w4) * smoothstep(-0.5, 0.1, uv.y - w4);
    color += c_darkForest * m4_glow * 0.5;

    float bloom = smoothstep(1.5, 0.0, distance(st, vec2(1.2, 0.8)));
    color += c_highlight * bloom * 0.2;

    float noise = fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453);
    color += (noise - 0.5) * 0.018;

    color = mix(color, c_trueBlack, 0.06);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShaderSource = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export default function MattsCustomBackground({
  className = "",
}: MattsCustomBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: isMobile || isSafari ? "default" : "high-performance",
    });

    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowPower = isMobile || isSafari;
    const maxDpr = isMobile ? 1.25 : isSafari ? 1.5 : 2;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
      canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (resolutionLocation) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }
    };

    window.addEventListener("resize", resize);
    resize();

    let animationFrameId = 0;
    const startTime = performance.now();
    let lastFrameTime = 0;

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!prefersReducedMotion.matches) {
        const elapsed = now - lastFrameTime;
        if (elapsed < TARGET_INTERVAL_MS) return;
        lastFrameTime = now - (elapsed % TARGET_INTERVAL_MS);
      }

      const timeScale = lowPower ? 0.00021 : 0.00025;
      const elapsedTime = prefersReducedMotion.matches
        ? 0
        : (now - startTime) * timeScale;

      if (timeLocation) {
        gl.uniform1f(timeLocation, elapsedTime);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[#07110B] ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "contrast(1.1) saturate(1.1)" }}
        aria-hidden="true"
      />
    </div>
  );
}
