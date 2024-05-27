import { nextTick, onMounted } from 'vue'
import { onContentUpdated } from '@vuepress-plume/plugin-content-update/client'
import type { CopyCodeOptions } from '../shared/index.js'

declare const __COPY_CODE_OPTIONS__: CopyCodeOptions

const options = __COPY_CODE_OPTIONS__
const RE_LANGUAGE = /language-(\w+)/
const RE_START_CODE = /^ *(\$|>)/gm
const shells = ['shellscript', 'shell', 'bash', 'sh', 'zsh']
const ignoredNodes = ['.diff.remove', '.vp-copy-ignore']

function isMobile(): boolean {
  return navigator
    ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(
      navigator.userAgent,
    )
    : false
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function setupCopyCode(): void {
  const insertBtn = (codeBlockEl: HTMLElement): void => {
    if (codeBlockEl.hasAttribute('has-copy-code'))
      return
    const button = document.createElement('button')
    button.className = 'copy-code-button'
    const parent = codeBlockEl.parentElement

    if (parent) {
      parent.insertBefore(button, codeBlockEl)
      const classes = parent.className
      const match = classes.match(RE_LANGUAGE) || []
      if (match[1])
        button.setAttribute('data-lang', match[1])
    }

    codeBlockEl.setAttribute('has-copy-code', '')
  }

  const generateButton = async () => {
    const { selector, delay } = options
    await nextTick()
    await sleep(delay || 0)
    const selectors = Array.isArray(selector) ? selector : [selector!]
    selectors.forEach((item) => {
      document.querySelectorAll<HTMLElement>(item).forEach(insertBtn)
    })
  }

  onMounted(async () => {
    if (!isMobile() || options.showInMobile) {
      await generateButton()

      const timeoutIdMap: WeakMap<HTMLElement, NodeJS.Timeout> = new WeakMap()
      window.addEventListener('click', (e) => {
        const el = e.target as HTMLElement
        if (el.matches('div[class*="language-"] > button.copy-code-button')) {
          const parent = el.parentElement
          const sibling = el.nextElementSibling
          if (!parent || !sibling)
            return

          // Clone the node and remove the ignored nodes
          const clone = sibling.cloneNode(true) as HTMLElement
          clone
            .querySelectorAll(ignoredNodes.join(','))
            .forEach(node => node.remove())

          let text = clone.textContent || ''
          const lang = el.getAttribute('data-lang') || ''
          if (lang && shells.includes(lang))
            text = text.replace(RE_START_CODE, '').trim()

          copyToClipboard(text).then(() => {
            el.classList.add('copied')
            clearTimeout(timeoutIdMap.get(el))
            const timeoutId = setTimeout(() => {
              el.classList.remove('copied')
              el.blur()
              timeoutIdMap.delete(el)
            }, options.duration)
            timeoutIdMap.set(el, timeoutId)
          })
        }
      })
    }
  })

  onContentUpdated(() => {
    if (!isMobile() || options.showInMobile)
      generateButton()
  })
}

async function copyToClipboard(text: string) {
  try {
    return navigator.clipboard.writeText(text)
  }
  catch {
    const element = document.createElement('textarea')
    const previouslyFocusedElement = document.activeElement

    element.value = text

    // Prevent keyboard from showing on mobile
    element.setAttribute('readonly', '')

    element.style.contain = 'strict'
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.fontSize = '12pt' // Prevent zooming on iOS

    const selection = document.getSelection()
    const originalRange = selection
      ? selection.rangeCount > 0 && selection.getRangeAt(0)
      : null

    document.body.appendChild(element)
    element.select()

    // Explicit selection workaround for iOS
    element.selectionStart = 0
    element.selectionEnd = text.length

    document.execCommand('copy')
    document.body.removeChild(element)

    if (originalRange) {
      selection!.removeAllRanges() // originalRange can't be truthy when selection is falsy
      selection!.addRange(originalRange)
    }

    // Get the focus back on the previously focused element, if any
    if (previouslyFocusedElement) {
      ; (previouslyFocusedElement as HTMLElement).focus()
    }
  }
}
