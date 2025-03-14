import { defineComponent, h, ref } from 'vue'
import styles from './Counter.module.css'

export default defineComponent({
  setup() {
    const count = ref(0)
    return () => h('div', {
      class: 'counter',
    }, [
      h('p', `计数器：${count.value}`),
      h('button', {
        type: 'button',
        class: styles.btn,
        onClick: () => count.value += 1,
      }, '+ 1'),
    ])
  },
})
