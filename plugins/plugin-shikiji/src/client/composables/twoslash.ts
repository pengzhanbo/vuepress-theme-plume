import type { App } from 'vue'
import FloatingVue, { recomputeAllPoppers } from 'floating-vue'
import 'floating-vue/dist/style.css'

const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export type FloatingVueConfig = Parameters<(typeof FloatingVue)['install']>[1]

export function enhanceTwoslash(app: App) {
  if (typeof window !== 'undefined') {
    // Recompute poppers when clicking on a tab
    window.addEventListener('click', (e) => {
      const path = e.composedPath()
      if (path.some((el: any) => el?.classList?.contains?.('vp-code-group') || el?.classList?.contains?.('tabs')))
        recomputeAllPoppers()
    }, { passive: true })
  }
  app.use(FloatingVue, {
    themes: {
      'twoslash': {
        $extend: 'dropdown',
        triggers: isMobile ? ['touch'] : ['hover', 'touch'],
        popperTriggers: isMobile ? ['touch'] : ['hover', 'touch'],
        placement: 'bottom-start',
        overflowPadding: 10,
        delay: 0,
        handleResize: false,
        autoHide: true,
        instantMove: true,
        flip: false,
        arrowPadding: 8,
        autoBoundaryMaxSize: true,
      },
      'twoslash-query': {
        $extend: 'twoslash',
        triggers: ['click'],
        popperTriggers: ['click'],
        autoHide: false,
      },
      'twoslash-completion': {
        $extend: 'twoslash-query',
        triggers: ['click'],
        popperTriggers: ['click'],
        autoHide: false,
        distance: 0,
        arrowOverflow: true,
      },
    },
  })
}
