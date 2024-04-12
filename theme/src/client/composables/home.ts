import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted } from 'vue'
import { useDarkMode } from './darkMode.js'

export function useHomeHeroFilterBackground(
  canvas: Ref<HTMLCanvasElement | undefined>,
  enable: Ref<boolean>,
) {
  const isDark = useDarkMode()

  let ctx: CanvasRenderingContext2D | null = null
  let t = 0
  let timer: number

  const F = computed(() => isDark.value ? 32 : 220)

  onMounted(() => {
    if (canvas.value && enable.value) {
      ctx = canvas.value.getContext('2d')!
      timer && window.cancelAnimationFrame(timer)
      run()
    }
  })

  onUnmounted(() => {
    timer && window.cancelAnimationFrame(timer)
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
    return (Math.floor(F.value + 36 * Math.cos((x * x - y * y) / 300 + t)))
  }

  function G(x: number, y: number, t: number) {
    return (Math.floor(F.value + 36 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)))
  }

  function B(x: number, y: number, t: number) {
    return (Math.floor(F.value + 36 * Math.sin(5 * Math.sin(t / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100)))
  }
}
