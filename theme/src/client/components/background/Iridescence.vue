<!--
  ***************************************************
  fork from https://github.com/DavidHDev/vue-bits MIT License
  modified by pengzhanbo
  ***************************************************
-->
<script setup lang="ts">
import type { OGLRenderingContext } from 'ogl'
import type { ThemeHomeHeroIridescence } from '../../../shared/index.js'
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { isPlainObject } from 'vuepress/shared'
import { useDarkMode } from '../../composables/index.js'

const props = withDefaults(defineProps<ThemeHomeHeroIridescence>(), {
  color: () => ({ light: [1, 1, 1], dark: [0.5, 0.5, 0.5] }),
  speed: 1.0,
  amplitude: 0.1,
  mouseReact: true,
})

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const mousePos = ref({ x: 0.5, y: 0.5 })

const isDark = useDarkMode()

const DEFAULT_COLOR = [1, 1, 1] as const
const color = computed(() => {
  if (isPlainObject(props.color))
    return props.color[isDark.value ? 'dark' : 'light'] || DEFAULT_COLOR

  if (Array.isArray(props.color))
    return props.color
  return DEFAULT_COLOR
})

let renderer: Renderer | null = null
let gl: OGLRenderingContext | null = null
let program: Program | null = null
let mesh: Mesh | null = null
let animationId: number | null = null

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`

function resize() {
  if (!containerRef.value || !renderer || !program || !gl)
    return

  const container = containerRef.value
  const scale = 1
  renderer.setSize(container.offsetWidth * scale, container.offsetHeight * scale)

  if (program) {
    program.uniforms.uResolution.value = new Color(
      gl.canvas.width,
      gl.canvas.height,
      gl.canvas.width / gl.canvas.height,
    )
  }
}

function handleMouseMove(e: MouseEvent) {
  if (!containerRef.value || !program)
    return

  const rect = containerRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = 1.0 - (e.clientY - rect.top) / rect.height

  mousePos.value = { x, y }
  if (program.uniforms.uMouse.value) {
    program.uniforms.uMouse.value[0] = x
    program.uniforms.uMouse.value[1] = y
  }
}

function update(t: number) {
  if (!program || !renderer || !mesh)
    return

  animationId = requestAnimationFrame(update)
  program.uniforms.uTime.value = t * 0.001
  renderer.render({ scene: mesh })
}

function initializeScene() {
  if (!containerRef.value)
    return

  cleanup()

  const container = containerRef.value
  renderer = new Renderer()
  gl = renderer.gl
  gl.clearColor(1, 1, 1, 1)

  const geometry = new Triangle(gl)
  program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new Color(...color.value) },
      uResolution: {
        value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
      },
      uMouse: { value: new Float32Array([mousePos.value.x, mousePos.value.y]) },
      uAmplitude: { value: props.amplitude },
      uSpeed: { value: props.speed },
    },
  })

  mesh = new Mesh(gl, { geometry, program })

  const canvas = gl.canvas as HTMLCanvasElement
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'

  container.appendChild(canvas)

  window.addEventListener('resize', resize)
  if (props.mouseReact) {
    container.addEventListener('mousemove', handleMouseMove)
  }

  resize()
  animationId = requestAnimationFrame(update)
}

function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  window.removeEventListener('resize', resize)

  if (containerRef.value) {
    containerRef.value.removeEventListener('mousemove', handleMouseMove)

    const canvas = containerRef.value.querySelector('canvas')
    if (canvas) {
      containerRef.value.removeChild(canvas)
    }
  }

  if (gl) {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  }

  renderer = null
  gl = null
  program = null
  mesh = null
}

onMounted(() => {
  initializeScene()
})

onUnmounted(() => {
  cleanup()
})

watch(
  [color, () => props.speed, () => props.amplitude, () => props.mouseReact],
  () => {
    initializeScene()
  },
  { deep: true },
)
</script>

<template>
  <div ref="containerRef" class="home-hero-effect-iridescence" />
</template>

<style scoped>
.home-hero-effect-iridescence {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translate3d(0, 0, 0);
}
</style>
