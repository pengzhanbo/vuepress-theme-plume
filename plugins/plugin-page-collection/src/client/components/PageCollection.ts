import { defineComponent, h } from 'vue'
import { usePageCollection } from '../composables/index.js'

export default defineComponent({
  name: 'PageCollection',
  setup() {
    const collection = usePageCollection()
    return () =>
      h(
        'span',
        {
          class: 'page-collection',
        },
        `阅读数：${collection.visitCount}`,
      )
  },
})
