// import { useRouteLocale } from '@vuepress/client'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { CopyCodeOptions } from '../../shared'
import { copySVG, successSVG } from '../svg'
import { copyToClipboard } from './copyToClipboard'
declare const __COPY_CODE_OPTIONS__: CopyCodeOptions
// declare const __COPY_CODE_LOCALES_OPTIONS__: CopyCodeLocaleOption

const options = __COPY_CODE_OPTIONS__
// const localesOptions = __COPY_CODE_LOCALES_OPTIONS__

const isMobile = (): boolean =>
  navigator
    ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(
        navigator.userAgent
      )
    : false

export const setupCopyCode = (): void => {
  const route = useRoute()
  // const lang = useRouteLocale()

  // const locale = computed(() => {
  //   return localesOptions[lang.value] || localesOptions['/zh/']
  // })

  const insertBtn = (codeBlockEl: HTMLElement): void => {
    if (codeBlockEl.hasAttribute('has-copy-code')) return
    const button = document.createElement('button')
    button.className = 'copy-code-button'
    button.innerHTML = copySVG

    button.addEventListener('click', () => {
      copyToClipboard(codeBlockEl.innerText)
      button.innerHTML = successSVG
      options.duration &&
        setTimeout(() => {
          button.innerHTML = copySVG
        }, options.duration)
    })

    if (codeBlockEl.parentElement) {
      codeBlockEl.parentElement.insertBefore(button, codeBlockEl)
    }
    codeBlockEl.setAttribute('has-copy-code', '')
  }

  const generateButton = (): void => {
    const { selector, delay } = options
    setTimeout(() => {
      if (typeof selector === 'string') {
        document.querySelectorAll<HTMLElement>(selector).forEach(insertBtn)
      } else if (Array.isArray(selector)) {
        selector.forEach((item) => {
          document.querySelectorAll<HTMLElement>(item).forEach(insertBtn)
        })
      }
    }, delay)
  }

  onMounted(() => {
    if (!isMobile() || options.showInMobile) {
      generateButton()
    }
  })
  watch(
    () => route.path,
    () => {
      if (!isMobile() || options.showInMobile) {
        generateButton()
      }
    }
  )
}
