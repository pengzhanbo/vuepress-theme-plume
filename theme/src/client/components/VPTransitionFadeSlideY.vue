<script lang="ts" setup>
import { computed } from 'vue'
import { useData, useScrollPromise } from '../composables/index.js'

const { theme } = useData()
const { resolve: onBeforeEnter, pending: onBeforeLeave } = useScrollPromise()

const enabledTransition = computed(() => {
  const transition = theme.value.transition
  return typeof transition === 'object'
    ? transition.page !== false
    : transition !== false
})
</script>

<template>
  <Transition
    v-if="enabledTransition"
    name="fade-slide-y"
    mode="out-in"
    @after-enter="onBeforeEnter"
    @before-leave="onBeforeLeave"
  >
    <slot />
  </Transition>
  <slot v-else />
</template>
