<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeLocaleData } from '../../composables/index.js'
import Flyout from '../Flyout/index.vue'
import SocialLinks from '../SocialLinks.vue'
import SwitchAppearance from '../SwitchAppearance.vue'

const theme = useThemeLocaleData()

const hasExtraContent = computed(
  () => theme.value.appearance || theme.value.social
)
</script>

<template>
  <Flyout v-if="hasExtraContent" class="navbar-extra" label="extra navigation">
    <div v-if="theme.appearance" class="group">
      <div class="item appearance">
        <p class="label">Appearance</p>
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
  line-height: 32px;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
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
