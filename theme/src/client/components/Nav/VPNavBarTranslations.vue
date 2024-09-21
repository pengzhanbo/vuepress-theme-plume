<script lang="ts" setup>
import VPFlyout from '@theme/VPFlyout.vue'
import VPMenuLink from '@theme/VPMenuLink.vue'
import { useData, useLangs } from '../../composables/index.js'

const { theme } = useData()
const { currentLang, localeLinks } = useLangs()
</script>

<template>
  <VPFlyout
    v-if="localeLinks.length && currentLang.label"
    class="vp-navbar-translations"
    icon="vpi-languages"
    :label="theme.selectLanguageText || 'Change Language'"
  >
    <div class="items">
      <p class="title">
        {{ currentLang.label }}
      </p>

      <template v-for="locale in localeLinks" :key="locale.link">
        <VPMenuLink :item="locale" />
      </template>
    </div>
  </VPFlyout>
</template>

<style lang="scss" scoped>
.vp-navbar-translations {
  display: none;
}

@media (min-width: 1280px) {
  .vp-navbar-translations {
    display: flex;
    align-items: center;
  }
}

.title {
  padding: 0 24px 0 12px;
  font-size: 14px;
  font-weight: 700;
  line-height: 32px;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}
</style>
