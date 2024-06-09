<script lang="ts" setup>
import { useLangs } from '../../composables/langs.js'
import { useData } from '../../composables/data.js'
import Flyout from '../Flyout/index.vue'
import MenuLink from '../Flyout/MenuLink.vue'

const { theme } = useData()
const { currentLang, localeLinks } = useLangs()
</script>

<template>
  <Flyout
    v-if="localeLinks.length && currentLang.label"
    class="navbar-translations"
    icon="vpi-languages"
    :label="theme.selectLanguageText || 'Change Language'"
  >
    <div class="items">
      <p class="title">
        {{ currentLang.label }}
      </p>

      <template v-for="locale in localeLinks" :key="locale.link">
        <MenuLink :item="locale" />
      </template>
    </div>
  </Flyout>
</template>

<style lang="scss" scoped>
.navbar-translations {
  display: none;
}

@media (min-width: 1280px) {
  .navbar-translations {
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
  transition: color var(--t-color);
}
</style>
