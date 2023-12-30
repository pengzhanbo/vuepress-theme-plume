import { onUnmounted } from 'vue'

export interface ContentUpdated {
  mounted?: boolean
  updated?: boolean
  beforeUnmount?: boolean
}

let contentUpdatedCallbacks: ((lifeCircleType: ContentUpdated) => any)[] = []

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

export function runCallbacks(lifeCircleType: ContentUpdated) {
  contentUpdatedCallbacks.forEach(fn => fn(lifeCircleType))
}
