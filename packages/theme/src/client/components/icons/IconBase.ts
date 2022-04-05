import { defineComponent, h } from 'vue'
import type { VNode } from 'vue'

export const IconBase = defineComponent({
  name: 'IconBase',
  props: {
    name: {
      type: String,
      required: false,
      default: '',
    },
    color: {
      type: String,
      required: false,
      default: 'currentColor',
    },
    viewBox: {
      type: String,
      required: false,
      default: '0 0 20 20',
    },
  },
  setup:
    (props, { slots }) =>
    (): VNode =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          class: ['icon', `${props.name}-icon`],
          viewBox: props.viewBox,
          ariaLabelledby: props.name,
        },
        [
          h('title', { id: props.name, lang: 'en' }, `${props.name}`),
          h('g', { fill: props.color }, slots.default?.()),
        ]
      ),
})
