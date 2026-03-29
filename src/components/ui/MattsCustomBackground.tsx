"use client";

import React, { useEffect, useRef } from 'react';

// --- WebGL Shader Code ---
const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;

  // SeedTech Color Palette
  vec3 c_trueBlack = vec3(0.0, 0.0, 0.0);
  vec3 c_nearBlack = vec3(0.027, 0.067, 0.043);  // #07110B
  vec3 c_darkForest = vec3(0.071, 0.192, 0.118); // #12311E
  vec3 c_emerald = vec3(0.122, 0.310, 0.188);    // #1F4F30
  vec3 c_brand = vec3(0.227, 0.565, 0.329);      // #3A9054
  vec3 c_highlight = vec3(0.373, 0.659, 0.455);  // #5FA874
  vec3 c_seam = vec3(0.788, 0.886, 0.820);       // #C9E2D1

  void main() {
    // Normalize coordinates
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Fluid, oceanic animation time
    float t = u_time * 0.4;

    // --- 1. THE SKY (Flat, clean background) ---
    // Smooth gradient from highlight green to deep forest
    vec3 sky = mix(c_highlight * 0.5, c_darkForest, uv.y + 0.1);

    // --- 2. THE MAIN CREST LINE ---
    // The sweeping S-curve that separates the background from the volumetric foreground
    float w_main = sin(uv.x * 2.2 - t * 0.7) * 0.18 
                 + cos(uv.x * 1.1 + t * 0.5) * 0.12 
                 + 0.6;
    float d_main = uv.y - w_main;

    // --- 3. THE VOLUMETRIC OCEAN MASS (Color Meshing) ---
    // Instead of stacking shapes, we create a base fluid and sweep massive gradients across it
    vec3 ocean = c_brand * 0.8;

    // Core shadow: Deepest right under the crest, fading smoothly downward
    float core_shadow = smoothstep(0.02, -0.4, d_main);
    ocean = mix(ocean, c_nearBlack, core_shadow * 0.9);

    // Bottom-Right Light Sweep (Mimicking the massive bright blur in the screenshot)
    // uv.x - uv.y creates a diagonal gradient from bottom-left to top-right
    float light_sweep = smoothstep(-0.2, 1.2, uv.x - uv.y * 1.2);
    ocean = mix(ocean, c_highlight * 1.1, light_sweep * 0.65);

    // Bottom-Left Dark Sweep (Mimicking the massive dark blur in the screenshot)
    // uv.x + uv.y creates a diagonal gradient from bottom-right to top-left
    float dark_sweep = smoothstep(0.8, -0.2, uv.x + uv.y * 0.8);
    ocean = mix(ocean, c_trueBlack, dark_sweep * 0.9);

    // Fluid Meshing: Adds subtle organic ripples through the massive sweeps so it feels like liquid
    float fluid_mesh = sin(uv.x * 3.0 - uv.y * 2.0 - t * 0.6) * 0.5 + 0.5;
    ocean = mix(ocean, c_emerald, fluid_mesh * 0.4);

    // --- 4. COMPOSITING ---
    // A very slightly softened edge (0.005) prevents the harsh "vector" look 
    // and makes it feel more like a 3D depth-of-field transition
    float wave_mask = smoothstep(0.005, -0.005, d_main);
    vec3 color = mix(sky, ocean, wave_mask);

    // --- 5. THE REFLECTIVE SEAM ---
    // Focus the brightest part of the reflection on the right side
    float seam_taper = smoothstep(0.1, 1.0, uv.x); 
    
    // Core bright line (slightly thicker to feel like glass rather than a laser)
    float seam_core = smoothstep(0.006, 0.0, abs(d_main));
    color += c_seam * seam_core * seam_taper * wave_mask * 0.9;
    
    // The downward cast/glow of the seam into the fluid body
    float seam_cast = smoothstep(0.0, -0.15, d_main) * smoothstep(-0.2, 0.0, d_main);
    color += c_highlight * seam_cast * seam_taper * wave_mask * 0.7;

    // --- FINISHING TOUCHES ---
    // Subtle noise/dither to entirely eliminate color banding in smooth gradients
    float noise = fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453);
    color += (noise - 0.5) * 0.015;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export default function MattsCustomBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Compile Shader Function
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    // Link Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up full-screen quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    // Handle Resizing for high DPI
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();

    // Render Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsedTime = (now - startTime) * 0.00025;
      gl.uniform1f(timeLocation, elapsedTime);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#07110B] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'contrast(1.05) saturate(1.1)' }}
        aria-hidden="true"
      />
    </div>
  );
}
