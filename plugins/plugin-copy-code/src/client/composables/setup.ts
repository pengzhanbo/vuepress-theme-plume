import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { CopyCodeOptions } from '../../shared/index.js'
import { copyToClipboard } from './copyToClipboard.js'

declare const __COPY_CODE_OPTIONS__: CopyCodeOptions

const options = __COPY_CODE_OPTIONS__

function isMobile(): boolean {
  return navigator
    ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(
      navigator.userAgent,
    )
    : false
}

export function setupCopyCode(): void {
  const route = useRoute()

  const insertBtn = (codeBlockEl: HTMLElement): void => {
    if (codeBlockEl.hasAttribute('has-copy-code'))
      return
    const button = document.createElement('button')
    button.className = 'copy-code-button'

    button.addEventListener('click', () => {
      copyToClipboard(codeBlockEl.textContent || '')
      button.classList.add('copied')
      options.duration
      && setTimeout(() => {
        button.classList.remove('copied')
      }, options.duration)
    })

    if (codeBlockEl.parentElement)
      codeBlockEl.parentElement.insertBefore(button, codeBlockEl)

    codeBlockEl.setAttribute('has-copy-code', '')
  }

  const generateButton = (): void => {
    const { selector, delay } = options
    setTimeout(() => {
      if (typeof selector === 'string') {
        document.querySelectorAll<HTMLElement>(selector).forEach(insertBtn)
      }
      else if (Array.isArray(selector)) {
        selector.forEach((item) => {
          document.querySelectorAll<HTMLElement>(item).forEach(insertBtn)
        })
      }
    }, delay)
  }

  onMounted(() => {
    if (!isMobile() || options.showInMobile)
      generateButton()
  })
  watch(
    () => route.path,
    () => {
      if (!isMobile() || options.showInMobile)
        generateButton()
    },
  )
}
