<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useDarkMode } from '../../composables/index.js'

interface TintPlate {
  r: { value: number, offset: number }
  g: { value: number, offset: number }
  b: { value: number, offset: number }
}

const { rgb, light, dark, r, g, b } = defineProps<{
  rgb?: string | number
} & Partial<TintPlate> & { light?: TintPlate, dark?: TintPlate }>()

const config = computed(() => {
  if (rgb) {
    return rgb
  }
  if (light || dark) {
    return cleanObject({ light, dark })
  }
  return cleanObject({ r, g, b })
})

const lightTint = {
  r: { value: 200, offset: 36 },
  g: { value: 200, offset: 36 },
  b: { value: 200, offset: 36 },
}

const darkTint = {
  r: { value: 32, offset: 36 },
  g: { value: 32, offset: 36 },
  b: { value: 32, offset: 36 },
}

function cleanObject(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined)
      delete obj[key]
  }
  return obj
}

function toPlate(plate: number | string) {
  return typeof plate === 'number' || Number(plate) === Number.parseInt(plate)
    ? [plate, plate, plate].map(n => Number(n))
    : plate.includes(',') ? plate.replace(/\s/g, '').split(',').map(n => Number(n)) : []
}

function toTint([r, g, b]: number[]) {
  return { r: toColor(r), g: toColor(g), b: toColor(b) }
}

function toColor(num: number) {
  const offset = 256 - num
  return { value: num, offset: offset > 64 ? 64 : offset }
}

function toNumber(tint: TintPlate): TintPlate {
  Object.keys(tint).forEach((key) => {
    const p = tint[key]
    p.value = Number(p.value)
    p.offset = Number(p.offset)
  })
  return tint
}

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const isDark = useDarkMode()

let ctx: CanvasRenderingContext2D | null = null
let t = 0
let timer: number

const plate = computed<TintPlate>(() => {
  const defaultTint = isDark.value ? darkTint : lightTint
  const plate = config.value
  if (!plate)
    return defaultTint

  if (typeof plate === 'string' || typeof plate === 'number') {
    if (isDark.value)
      return darkTint
    const values = toPlate(plate)
    return values.length !== 3 ? lightTint : toTint(values)
  }

  if (typeof plate === 'object') {
    if ('r' in plate) {
      if (isDark.value)
        return darkTint
      return toNumber({ ...lightTint, ...(plate as TintPlate) })
    }
    const key = isDark.value ? 'dark' : 'light'
    if (key in plate) {
      const _plate = plate[key]
      if (typeof _plate === 'string' || typeof _plate === 'number') {
        const values = toPlate(_plate)
        return values.length !== 3 ? lightTint : toTint(values)
      }
      return toNumber({ ...defaultTint, ...plate })
    }
  }
  return defaultTint
})

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')!
    if (timer) {
      window.cancelAnimationFrame(timer)
    }
    run()
  }
})

onUnmounted(() => {
  if (timer) {
    window.cancelAnimationFrame(timer)
  }
})

function run() {
  for (let x = 0; x <= 35; x++) {
    for (let y = 0; y <= 35; y++)
      col(x, y, R(x, y, t), G(x, y, t), B(x, y, t))
  }
  t = t + 0.020
  timer = window.requestAnimationFrame(run)
}

function col(x: number, y: number, r: number, g: number, b: number) {
  if (!ctx)
    return
  ctx.fillStyle = `rgb(${r},${g},${b})`
  ctx.fillRect(x, y, 1, 1)
}

function R(x: number, y: number, t: number) {
  const r = plate.value.r
  return (Math.floor(r.value + r.offset * Math.cos((x * x - y * y) / 300 + t)))
}

function G(x: number, y: number, t: number) {
  const g = plate.value.g
  return (Math.floor(g.value + g.offset * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)))
}

function B(x: number, y: number, t: number) {
  const b = plate.value.b
  return (Math.floor(b.value + b.offset * Math.sin(5 * Math.sin(t / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100)))
}
</script>

<template>
  <div class="bg-filter">
    <canvas ref="canvas" width="32" height="32" />
  </div>
</template>

<style scoped>
.bg-filter {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  transform: translate3d(0, 0, 0);
}

.vp-home-hero.full.once .bg-filter {
  height: calc(100% + var(--vp-footer-height, 0px));
}

@property --vp-home-hero-bg-filter {
  inherits: false;
  initial-value: #fff;
  syntax: "<color>";
}

.bg-filter::after {
  --vp-home-hero-bg-filter: var(--vp-c-bg);

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
  background: linear-gradient(to bottom, var(--vp-home-hero-bg-filter) 0, transparent 45%, transparent 55%, var(--vp-home-hero-bg-filter) 140%);
  transition: --vp-home-hero-bg-filter var(--vp-t-color);
}

.bg-filter canvas {
  width: 100%;
  height: 100%;
}
</style>
