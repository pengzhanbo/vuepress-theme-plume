<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeLocaleData } from '../composables/index.js'

const theme = useThemeLocaleData()

const avatar = computed(() => theme.value.avatar)
</script>

<template>
  <div v-if="avatar" class="blog-avatar-wrapper">
    <div class="avatar-profile">
      <p v-if="avatar.url">
        <img :src="avatar.url" :alt="avatar.name" />
      </p>
      <div>
        <h3>{{ avatar.name }}</h3>
        <p>{{ avatar.description }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blog-avatar-wrapper {
  position: sticky;
  top: calc(var(--vp-nav-height) + 2rem);
  width: 270px;
  margin-left: 2rem;
  margin-top: 2rem;
  border-left: solid 1px var(--vp-c-divider);
  text-align: center;
  padding: 1rem 0;

  img {
    width: 50%;
    margin: auto;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-top: 1.5rem;
  }
}

@media (max-width: 768px) {
  .blog-avatar-wrapper {
    display: none;
  }
}
</style>
