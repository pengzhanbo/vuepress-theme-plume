/**
 * 消除异步编译 demo 代码 与 markdown 同步 render 的时间差问题
 * 确保 在 vuepress onPrepared 阶段完成所有 demo 代码的编译与输出
 */
let renderDone: null | ((...args: any[]) => void) = null
let renderCount = 0
let renderPromise!: Promise<void>

export function createDemoRender() {
  renderPromise = new Promise((resolve) => {
    renderDone = resolve
  })
}

export async function waitDemoRender() {
  if (renderCount === 0) {
    renderDone?.()
    renderDone = null
  }
  await renderPromise
}

export function markDemoRender() {
  renderCount++
}

export function checkDemoRender() {
  if (renderCount > 0) {
    renderCount--
  }
  if (renderCount === 0) {
    renderDone?.()
    renderDone = null
  }
}
