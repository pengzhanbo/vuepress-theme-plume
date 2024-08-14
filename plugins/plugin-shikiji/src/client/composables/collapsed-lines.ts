import { useEventListener } from '@vueuse/core'

export function useCollapsedLines({
  selector = 'div[class*="language-"] > .collapsed-lines',
}: { selector?: string } = {}): void {
  useEventListener('click', (e) => {
    const el = e.target as HTMLElement
    if (el.matches(selector)) {
      const parent = el.parentElement
      if (parent?.classList.toggle('collapsed')) {
        parent.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
    }
  })
}
