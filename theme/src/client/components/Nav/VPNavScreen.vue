<script setup lang="ts">
import VPNavScreenAppearance from '@theme/Nav/VPNavScreenAppearance.vue'
import VPNavScreenMenu from '@theme/Nav/VPNavScreenMenu.vue'
import VPNavScreenSocialLinks from '@theme/Nav/VPNavScreenSocialLinks.vue'
import VPNavScreenTranslates from '@theme/Nav/VPNavScreenTranslations.vue'
import { useScrollLock } from '@vueuse/core'
import { inBrowser } from '../../utils/index.js'

defineProps<{
  open: boolean
}>()

const isLocked = useScrollLock(inBrowser ? document.body : null)
</script>

<template>
  <Transition
    name="fade"
    @enter="isLocked = true"
    @after-leave="isLocked = false"
  >
    <div v-if="open" id="navScreen" class="vp-nav-screen">
      <div class="container">
        <slot name="nav-screen-content-before" />
        <VPNavScreenMenu class="menu" />
        <VPNavScreenTranslates class="translations" />
        <VPNavScreenAppearance class="appearance" />
        <VPNavScreenSocialLinks class="social-links" />
        <slot name="nav-screen-content-after" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.vp-nav-screen {
  position: fixed;
  top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px));

  /* rtl:ignore */
  right: 0;
  bottom: 0;

  /* rtl:ignore */
  left: 0;
  width: 100%;
  padding: 0 32px;
  overflow-y: auto;
  pointer-events: auto;
  background-color: var(--vp-nav-screen-bg-color);
  transition: background-color var(--vp-t-color);
}

.container {
  max-width: 288px;
  padding: 24px 0 96px;
  margin: 0 auto;
}

.vp-nav-screen.fade-enter-active,
.vp-nav-screen.fade-leave-active {
  transition: opacity var(--vp-t-color);
}

.vp-nav-screen.fade-enter-active .container,
.vp-nav-screen.fade-leave-active .container {
  transition: transform var(--vp-t-color);
}

.vp-nav-screen.fade-enter-from,
.vp-nav-screen.fade-leave-to {
  opacity: 0;
}

.vp-nav-screen.fade-enter-from .container,
.vp-nav-screen.fade-leave-to .container {
  transform: translateY(-8px);
}

@media (min-width: 768px) {
  .vp-nav-screen {
    display: none;
  }
}

.menu + .translations,
.menu + .appearance,
.translations + .appearance {
  margin-top: 24px;
}

.menu + .social-links {
  margin-top: 16px;
}

.appearance + .social-links {
  margin-top: 16px;
}
</style>
