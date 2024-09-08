<script setup lang="ts">
defineProps<{
  contributors: string[]
}>()
</script>

<template>
  <div class="contributors">
    <div v-for="contributor in contributors" :key="contributor" class="contributor">
      <img :src="`https://github.com/${contributor}.png`" :alt="contributor">
      <a :href="`https://github.com/${contributor}`" target="_blank" rel="noopener noreferrer">{{ contributor }}</a>
    </div>
  </div>
</template>

<style scoped>
.contributors {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 32px;
  margin-bottom: 64px;
}

.contributor {
  display: flex;
  gap: 8px;
  align-items: center;
}

.contributor img {
  width: 32px;
  height: 32px;
  border-radius: 100%;

  object-fit: contain;
}

.contributor a {
  text-decoration: none;
}
</style>
