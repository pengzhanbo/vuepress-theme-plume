import { pagesComponents } from '@internal/pagesComponents'
import { computed, defineComponent, h } from 'vue'
import { usePageData } from '@vuepress/client'
import { runCallbacks } from '../composables/index.js'

declare const __VUEPRESS_DEV__: boolean

/**
 * Markdown rendered content
 */
export const Content = defineComponent({

  name: 'Content',

  props: {
    pageKey: {
      type: String,
      required: false,
      default: '',
    },
  },

  setup(props) {
    const page = usePageData()
    const pageComponent = computed(
      () => pagesComponents[props.pageKey || page.value.key],
    )
    return () =>
      pageComponent.value
        ? h(pageComponent.value, {
          onVnodeMounted: () => runCallbacks({ mounted: true }),
          onVnodeUpdated: () => runCallbacks({ updated: true }),
          onVnodeBeforeUnmount: () => runCallbacks({ beforeUnmount: true }),
        })
        : h(
          'div',
          __VUEPRESS_DEV__
            ? 'Page does not exist. This is a fallback content.'
            : '404 Not Found',
        )
  },
})
