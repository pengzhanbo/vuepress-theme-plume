<script lang="ts" setup>
import { useScrollPromise } from '../composables/index.js'

const { resolve: onBeforeEnter, pending: onBeforeLeave } = useScrollPromise()
</script>

<template>
  <Transition
    name="fade-slide-y"
    mode="out-in"
    @before-enter="onBeforeEnter"
    @before-leave="onBeforeLeave"
  >
    <slot />
  </Transition>
</template>
