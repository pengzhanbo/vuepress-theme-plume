import { onUnmounted } from 'vue'

// eslint-disable-next-line import/no-mutable-exports
export let contentUpdatedCallbacks: (() => any)[] = []

/**
 * Register callback that is called every time the markdown content is updated
 * in the DOM.
 */
export function onContentUpdated(fn: () => any) {
  contentUpdatedCallbacks.push(fn)
  onUnmounted(() => {
    contentUpdatedCallbacks = contentUpdatedCallbacks.filter(f => f !== fn)
  })
}

export function runCallbacks() {
  contentUpdatedCallbacks.forEach(fn => fn())
}
