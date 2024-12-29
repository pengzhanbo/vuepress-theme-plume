<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  contributors: ({ github: string, name: string } | string)[]
}>()

const list = computed(() =>
  props.contributors.map(contributor =>
    typeof contributor === 'string' ? { github: contributor, name: contributor } : contributor),
)
</script>

<template>
  <div class="contributors">
    <div v-for="contributor in list" :key="contributor.github" class="contributor">
      <img :src="`https://avatars.githubusercontent.com/${contributor.github}?v=4`" :alt="contributor.name" loading="lazy" width="460" height="460">
      <a :href="`https://github.com/${contributor.github}`" target="_blank" rel="noopener noreferrer">{{ contributor.name }}</a>
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
  cursor: default;
  border-radius: 100%;

  object-fit: contain;
}

.contributor a {
  text-decoration: none;
}
</style>
