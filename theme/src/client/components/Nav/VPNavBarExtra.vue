<script lang="ts" setup>
import VPFlyout from '@theme/VPFlyout.vue'
import VPMenuLink from '@theme/VPMenuLink.vue'
import VPSocialLinks from '@theme/VPSocialLinks.vue'
import VPSwitchAppearance from '@theme/VPSwitchAppearance.vue'
import { computed } from 'vue'
import { useData, useLangs } from '../../composables/index.js'

const { theme } = useData()
const { localeLinks, currentLang } = useLangs()

const social = computed(() => {
  const includes = theme.value.navbarSocialInclude ?? []
  if (!includes.length)
    return theme.value.social

  return theme.value.social?.filter(({ icon }) => {
    if (typeof icon === 'string')
      return includes.includes(icon)
    if (icon.name)
      return includes.includes(icon.name)
    return false
  })
})

const hasExtraContent = computed(
  () =>
    (localeLinks.value.length && currentLang.value.label)
    || theme.value.appearance
    || social.value?.length,
)
</script>

<template>
  <VPFlyout
    v-if="hasExtraContent"
    class="vp-navbar-extra"
    label="extra navigation"
  >
    <div
      v-if="localeLinks.length && currentLang.label"
      class="group translations"
    >
      <p class="trans-title">
        {{ currentLang.label }}
      </p>

      <template v-for="locale in localeLinks" :key="locale.link">
        <VPMenuLink :item="locale" />
      </template>
    </div>

    <div v-if="theme.appearance && theme.appearance !== 'force-dark'" class="group">
      <div class="item appearance">
        <p class="label">
          {{ theme.appearanceText || 'Appearance' }}
        </p>
        <div class="appearance-action">
          <VPSwitchAppearance />
        </div>
      </div>
    </div>

    <div v-if="social" class="group">
      <div class="item social-links">
        <VPSocialLinks class="social-links-list" :links="social" />
      </div>
    </div>
  </VPFlyout>
</template>

<style scoped>
.vp-navbar-extra {
  display: none;
  margin-right: -12px;
}

@media (min-width: 768px) {
  .vp-navbar-extra {
    display: block;
  }
}

@media (min-width: 1280px) {
  .vp-navbar-extra {
    display: none;
  }
}

.trans-title {
  padding: 0 24px 0 12px;
  font-size: 14px;
  font-weight: 700;
  line-height: 32px;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
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
