<script setup lang="ts">
import { useToggle } from '@vueuse/core'

const [value, toggle] = useToggle()
</script>

<template>
  <div>
    <p>Value: {{ value ? 'ON' : 'OFF' }}</p>
    <div style="display: flex;gap: 16px;">
      <button class="btn" @click="toggle()">
        Toggle
      </button>
      <button class="btn" @click="value = true">
        Set On
      </button>
      <button class="btn" @click="value = false">
        Set Off
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}
</style>
