import { useClipboard, useEventListener } from '@vueuse/core'

const SHELL_RE = /language-(?:shellscript|shell|bash|sh|zsh)/
const IGNORE_NODES = ['.vp-copy-ignore', '.diff.remove']

interface CopyCodeOptions {
  selector?: string
  duration?: number
}

export function useCopyCode({
  selector = 'div[class*="language-"] > button.copy',
  duration = 2000,
}: CopyCodeOptions = {}): void {
  if (__VUEPRESS_SSR__)
    return

  const timeoutIdMap = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()
  const { copy } = useClipboard({ legacy: true })

  useEventListener('click', (e) => {
    const el = e.target as HTMLElement
    if (el.matches(selector)) {
      const parent = el.parentElement
      const sibling = el.nextElementSibling
      if (!parent || !sibling)
        return

      const isShell = SHELL_RE.test(parent.className)

      // Clone the node and remove the ignored nodes
      const clone = sibling.cloneNode(true) as HTMLElement
      clone
        .querySelectorAll(IGNORE_NODES.join(','))
        .forEach(node => node.remove())

      let text = clone.textContent || ''

      if (isShell)
        text = text.replace(/^ *(\$|>) /gm, '').trim()

      copy(text).then(() => {
        if (duration <= 0)
          return

        el.classList.add('copied')
        clearTimeout(timeoutIdMap.get(el))
        const timeoutId = setTimeout(() => {
          el.classList.remove('copied')
          el.blur()
          timeoutIdMap.delete(el)
        }, duration)
        timeoutIdMap.set(el, timeoutId)
      })
    }
  })
}
