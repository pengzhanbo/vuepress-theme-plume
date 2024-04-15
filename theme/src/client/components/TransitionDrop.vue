<script setup lang="ts">
interface Props {
  delay?: number
  duration?: number
  appear?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 0.25,
})

let _transition = ''

function setStyle(item: Element) {
  const el = item as HTMLElement
  if (_transition === '') {
    const value = window.getComputedStyle(el).transition
    _transition = value && !value.includes('all') ? `${value}, ` : ''
  }
  el.style.transform = 'translateY(-20px)'
  el.style.opacity = '0'
  el.style.transition = `transform ${props.duration}s ease-in-out ${props.delay}s, opacity ${props.duration}s ease-in-out ${props.delay}s`
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
    name="drop"
    mode="out-in"
    :appear="appear"
    @before-appear="setStyle"
    @after-appear="unsetStyle"
    @enter="setStyle"
    @after-enter="unsetStyle"
    @before-leave="setStyle"
  >
    <slot />
  </Transition>
</template>
