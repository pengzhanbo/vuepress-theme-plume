<!--
  ***************************************************
  fork from https://github.com/DavidHDev/vue-bits MIT License
  modified by pengzhanbo
  ***************************************************
-->
<script setup lang="ts">
import type { ThemeHomeHeroLightning } from '../../../shared/index.js'
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'

const props = withDefaults(defineProps<ThemeHomeHeroLightning>(), {
  hue: 255,
  xOffset: 0,
  speed: 1,
  intensity: 1,
  size: 1,
})

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
let animationId = 0
let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let startTime = 0

const vertexShaderSource = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uHue;
uniform float uXOffset;
uniform float uSpeed;
uniform float uIntensity;
uniform float uSize;

#define OCTAVE_COUNT 10

vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float hash11(float p) {
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rotate2d(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s, s, c);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float a = hash12(ip);
    float b = hash12(ip + vec2(1.0, 0.0));
    float c = hash12(ip + vec2(0.0, 1.0));
    float d = hash12(ip + vec2(1.0, 1.0));

    vec2 t = smoothstep(0.0, 1.0, fp);
    return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < OCTAVE_COUNT; ++i) {
        value += amplitude * noise(p);
        p *= rotate2d(0.45);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = fragCoord / iResolution.xy;
    uv = 2.0 * uv - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    uv.x += uXOffset;

    uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;

    float dist = abs(uv.x);
    vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
    vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
    col = pow(col, vec3(1.0));
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`

function compileShader(source: string, type: number): WebGLShader | null {
  if (!gl)
    return null
  const shader = gl.createShader(type)
  if (!shader)
    return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initWebGL() {
  const canvas = canvasRef.value
  if (!canvas)
    return

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    let width = rect.width
    let height = rect.height

    let parent = canvas.parentElement
    while (parent && (!width || !height)) {
      if (parent.offsetWidth && parent.offsetHeight) {
        width = parent.offsetWidth
        height = parent.offsetHeight
        break
      }
      parent = parent.parentElement
    }

    if (!width || !height) {
      width = window.innerWidth
      height = window.innerHeight
    }

    width = Math.max(width, 300)
    height = Math.max(height, 300)

    canvas.width = width * dpr
    canvas.height = height * dpr

    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  gl = canvas.getContext('webgl')
  if (!gl) {
    console.error('WebGL not supported')
    return
  }

  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
  if (!vertexShader || !fragmentShader)
    return

  program = gl.createProgram()
  if (!program)
    return
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program))
    return
  }
  gl.useProgram(program)

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const aPosition = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  startTime = performance.now()
  render()

  return () => {
    window.removeEventListener('resize', resizeCanvas)
  }
}

function render() {
  if (!gl || !program || !canvasRef.value)
    return

  const canvas = canvasRef.value

  const rect = canvas.getBoundingClientRect()
  if (canvas.width !== rect.width || canvas.height !== rect.height) {
    canvas.width = rect.width
    canvas.height = rect.height
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
  }

  gl.viewport(0, 0, canvas.width, canvas.height)

  const iResolutionLocation = gl.getUniformLocation(program, 'iResolution')
  const iTimeLocation = gl.getUniformLocation(program, 'iTime')
  const uHueLocation = gl.getUniformLocation(program, 'uHue')
  const uXOffsetLocation = gl.getUniformLocation(program, 'uXOffset')
  const uSpeedLocation = gl.getUniformLocation(program, 'uSpeed')
  const uIntensityLocation = gl.getUniformLocation(program, 'uIntensity')
  const uSizeLocation = gl.getUniformLocation(program, 'uSize')

  gl.uniform2f(iResolutionLocation, canvas.width, canvas.height)
  const currentTime = performance.now()
  gl.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0)
  gl.uniform1f(uHueLocation, props.hue)
  gl.uniform1f(uXOffsetLocation, props.xOffset)
  gl.uniform1f(uSpeedLocation, props.speed)
  gl.uniform1f(uIntensityLocation, props.intensity)
  gl.uniform1f(uSizeLocation, props.size)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
  animationId = requestAnimationFrame(render)
}

onMounted(() => {
  initWebGL()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  gl = null
  program = null
})

watch(
  () => [props.hue, props.xOffset, props.speed, props.intensity, props.size],
  () => {},
)
</script>

<template>
  <div class="home-hero-effect-lighting">
    <canvas ref="canvasRef" class=" mix-blend-screen" />
  </div>
</template>

<style scoped>
.home-hero-effect-lighting {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translate3d(0, 0, 0);
}

.home-hero-effect-lighting canvas {
  width: 100%;
  height: 100%;
  mix-blend-mode: screen;
}
</style>
