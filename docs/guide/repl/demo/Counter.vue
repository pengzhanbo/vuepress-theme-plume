<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="counter">
    <p>
      计数器：{{ count }}
    </p>
    <button type="button" class="btn" @click="count += 1">
      + 1
    </button>
  </div>
</template>

<style scoped>
.btn {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}
</style>
