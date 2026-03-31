"use client";

import React, { useEffect, useRef } from 'react';

// --- WebGL Shader Code ---
const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;

  // Exact color sampling adapted to SeedTech green palette
  vec3 c_skyTop = vec3(0.027, 0.067, 0.043);  // Near Black
  vec3 c_skyBot = vec3(0.071, 0.192, 0.118);  // Dark Forest
  
  // The Mesh Gradient Colors
  vec3 c_light  = vec3(0.529, 0.667, 0.576);   // Soft haze green (Bottom Right)
  vec3 c_main   = vec3(0.227, 0.565, 0.329);   // Brand Green (Center/Right)
  vec3 c_dark   = vec3(0.000, 0.000, 0.000);   // True Black for deep fold shadow (Bottom Left)
  vec3 c_accent = vec3(0.122, 0.310, 0.188);   // Deep Emerald (Mid Left)

  vec3 c_seamTint = vec3(0.788, 0.886, 0.820); // Pale reflective tint

  // The sweeping S-Curve
  float getWave(float x, float t) {
      return sin(x * 2.1 - t * 0.6) * 0.16 + cos(x * 1.2 + t * 0.4) * 0.14 + 0.55;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y);
    
    // Slow, drifting animation time
    float t = u_time * 0.3;

    // --- 1. THE SKY ---
    vec3 sky = mix(c_skyBot, c_skyTop, uv.y);

    // --- 2. THE WAVE LINE ---
    float wave_y = getWave(st.x, t);
    float d = uv.y - wave_y; // Distance to the crest line

    // --- 3. THE FLUID MESH GRADIENT (The "Beautiful Mess") ---
    
    // Drift paths for the massive color nodes
    vec2 p_light = vec2(1.1 + sin(t*0.5)*0.2, -0.1 + cos(t*0.4)*0.15); // Anchored bottom-right
    vec2 p_dark  = vec2(-0.1 + cos(t*0.3)*0.2, -0.2 + sin(t*0.5)*0.15); // Anchored bottom-left
    vec2 p_main  = vec2(0.6 + sin(t*0.6)*0.3, 0.3 + cos(t*0.5)*0.2);    // Drifting center
    vec2 p_accent= vec2(0.1 + cos(t*0.4)*0.2, 0.2 + sin(t*0.3)*0.1);    // Mid left

    // Base weight/pull of each color node based on distance
    float w_light = 1.0 / pow(distance(st, p_light) + 0.05, 2.5);
    float w_dark  = 1.0 / pow(distance(st, p_dark) + 0.05, 2.5);
    float w_main  = 1.0 / pow(distance(st, p_main) + 0.05, 2.2);
    float w_accent= 1.0 / pow(distance(st, p_accent) + 0.05, 2.5);

    // --- THE MAGIC FIX: Volumetric Fold Injection ---
    
    // On the LEFT side, we inject a massive amount of True Black directly under the crest.
    // Because it's injected into the mesh weights, it perfectly and organically bleeds out.
    float left_fold = smoothstep(-0.4, 0.0, d) * smoothstep(0.8, 0.0, uv.x);
    w_dark += left_fold * 25.0; // Overpower the left edge with deep shadow

    // On the RIGHT side, we inject the Light green directly under the crest.
    // This makes the right side flush with light and eliminates any "cutout" feeling entirely.
    float right_glow = smoothstep(-0.4, 0.0, d) * smoothstep(0.2, 1.0, uv.x);
    w_light += right_glow * 15.0;

    // Calculate the final bleeding liquid color
    float total_w = w_light + w_dark + w_main + w_accent;
    vec3 ocean = (c_light * w_light + c_dark * w_dark + c_main * w_main + c_accent * w_accent) / total_w;

    // --- 4. COMPOSITING ---
    // Smooth, razor-sharp cut between the sky and the messy fluid body
    float mask = smoothstep(0.003, -0.003, d);
    vec3 final_color = mix(sky, ocean, mask);

    // --- 5. THE RAZOR SEAM ---
    // The crisp line sweeping across the wave
    float seam_core = smoothstep(0.004, 0.0, abs(d));
    float seam_glow = smoothstep(0.03, 0.0, abs(d)); // Soft bloom bleeding off the line
    
    // Fade the line out gently as it goes left, so the shadow left side stays thick
    float seam_taper = smoothstep(0.1, 0.9, uv.x);
    
    // Add the glowing line over everything
    final_color += c_seamTint * seam_core * seam_taper * mask;
    final_color += c_light * seam_glow * seam_taper * mask * 0.7;

    // --- 6. DITHERING ---
    // Erases ugly banding to keep the colors perfectly smooth
    float noise = fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453);
    final_color += (noise - 0.5) * 0.015;

    gl_FragColor = vec4(final_color, 1.0);
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
      const elapsedTime = (now - startTime) * 0.001;
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
