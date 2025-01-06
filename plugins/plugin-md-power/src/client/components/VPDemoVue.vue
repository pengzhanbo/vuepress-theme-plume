<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title?: string
  desc?: string
}>()

const showCode = ref(false)
function toggleCode() {
  showCode.value = !showCode.value
}
</script>

<template>
  <div class="vp-demo-wrapper vue">
    <div class="demo-draw">
      <slot />
    </div>
    <div v-if="title || desc" class="demo-info">
      <p v-if="title" class="title">
        {{ title }}
      </p>
      <p v-if="desc" class="desc">
        {{ desc }}
      </p>
    </div>
    <div class="demo-ctrl">
      <span class="vpi-demo-code" @click="toggleCode" />
    </div>
    <div v-show="showCode" class="demo-code">
      <slot name="code" />
    </div>
  </div>
</template>
