<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeLocaleData } from '../composables/index.js'
import BloggerInfo from './BloggerInfo.vue'
const themeLocale = useThemeLocaleData()

const showInfo = computed(() => {
  const avatar = themeLocale.value.avatar || {}
  return avatar.name || avatar.url
})
</script>
<template>
  <aside v-if="showInfo" class="blog-info-wrapper">
    <BloggerInfo />
  </aside>
</template>
<style lang="scss">
@import '../styles/variables';
.blog-info-wrapper {
  width: 18.75rem;
  margin-left: 1.25rem;
  position: sticky;
  top: calc(var(--navbar-height) + 1.25rem);
  border-left: solid 1px var(--c-border);
}

@media (max-width: $MQMobile) {
  .blog-info-wrapper {
    display: none;
  }
}
</style>
