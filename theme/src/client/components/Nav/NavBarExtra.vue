<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeLocaleData } from '../../composables/index.js'
import { useLangs } from '../../composables/langs.js'
import Flyout from '../Flyout/index.vue'
import MenuLink from '../Flyout/MenuLink.vue'
import SocialLinks from '../SocialLinks.vue'
import SwitchAppearance from '../SwitchAppearance.vue'

const theme = useThemeLocaleData()
const { localeLinks, currentLang } = useLangs({ correspondingLink: true })

const hasExtraContent = computed(
  () => theme.value.appearance || theme.value.social,
)
</script>

<template>
  <Flyout v-if="hasExtraContent" class="navbar-extra" label="extra navigation">
    <div
      v-if="localeLinks.length && currentLang.label"
      class="group translations"
    >
      <p class="trans-title">
        {{ currentLang.label }}
      </p>

      <template v-for="locale in localeLinks" :key="locale.link">
        <MenuLink :item="locale" />
      </template>
    </div>

    <div v-if="theme.appearance && theme.appearance !== 'force-dark'" class="group">
      <div class="item appearance">
        <p class="label">
          {{ theme.appearanceText || 'Appearance' }}
        </p>
        <div class="appearance-action">
          <SwitchAppearance />
        </div>
      </div>
    </div>

    <div v-if="theme.social" class="group">
      <div class="item social-links">
        <SocialLinks class="social-links-list" :links="theme.social" />
      </div>
    </div>
  </Flyout>
</template>

<style scoped>
.navbar-extra {
  display: none;
  margin-right: -12px;
}

@media (min-width: 768px) {
  .navbar-extra {
    display: block;
  }
}

@media (min-width: 1280px) {
  .navbar-extra {
    display: none;
  }
}

.trans-title {
  padding: 0 24px 0 12px;
  font-size: 14px;
  font-weight: 700;
  line-height: 32px;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.item.appearance,
.item.social-links {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.item.appearance {
  min-width: 176px;
}

.appearance-action {
  margin-right: -2px;
}

.social-links-list {
  margin: -4px -8px;
}
</style>
