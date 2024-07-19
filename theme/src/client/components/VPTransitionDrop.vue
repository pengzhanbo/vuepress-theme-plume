<script setup lang="ts">
import { computed } from 'vue'
import { useData } from '../composables/index.js'

interface Props {
  delay?: number
  duration?: number
  appear?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 0.25,
})

const { theme } = useData()

const enabledTransition = computed(() => {
  const transition = theme.value.transition
  return typeof transition === 'object'
    ? transition.postList !== false
    : transition !== false
})

let _transition = ''

function beforeAppear(item: Element) {
  const el = item as HTMLElement
  el.style.transform = 'translateY(-20px)'
  el.style.opacity = '0'
}
function setStyle(item: Element) {
  const el = item as HTMLElement

  if (!_transition) {
    const value = typeof window !== 'undefined' ? window.getComputedStyle?.(el).transition : ''
    _transition = value && !value.includes('all') ? `${value || ''}, ` : ' '
  }

  el.style.transition = `${_transition}transform ${props.duration}s ease-in-out ${props.delay}s, opacity ${props.duration}s ease-in-out ${props.delay}s`
}

function unsetStyle(item: Element) {
  const el = item as HTMLElement
  el.style.transform = 'translateY(0)'
  el.style.opacity = '1'
  el.style.transition = _transition
}
</script>

<template>
  <Transition
    v-if="enabledTransition"
    name="drop"
    mode="out-in"
    :appear="appear"
    @appear="setStyle"
    @before-appear="beforeAppear"
    @after-appear="unsetStyle"
    @enter="setStyle"
    @after-enter="unsetStyle"
    @before-leave="setStyle"
  >
    <slot />
  </Transition>
  <slot v-else />
</template>
