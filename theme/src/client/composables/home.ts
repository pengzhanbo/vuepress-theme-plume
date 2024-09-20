import type { Ref } from 'vue'
import type { PlumeThemeHomeHero } from '../../shared/index.js'
import { computed, onMounted, onUnmounted } from 'vue'
import { useDarkMode } from './dark-mode.js'

export interface TintPlate {
  r: { value: number, offset: number }
  g: { value: number, offset: number }
  b: { value: number, offset: number }
}

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

export function useHomeHeroTintPlate(
  canvas: Ref<HTMLCanvasElement | undefined>,
  enable: Ref<boolean>,
  tintPlate: Ref<PlumeThemeHomeHero['tintPlate']>,
) {
  const isDark = useDarkMode()

  let ctx: CanvasRenderingContext2D | null = null
  let t = 0
  let timer: number

  const plate = computed<TintPlate>(() => {
    const defaultTint = isDark.value ? darkTint : lightTint
    if (!tintPlate.value)
      return defaultTint

    const plate = tintPlate.value
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
        return toNumber({ ...lightTint, ...plate })
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
    if (canvas.value && enable.value) {
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
