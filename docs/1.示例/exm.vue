<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>
    <p>
      计数器：{{ count }}
    </p>
    <button type="button" style=" padding: 0 8px;border: 1px solid var(--vp-c-divider);" @click="count += 1">
      + 1
    </button>
  </div>
</template>
