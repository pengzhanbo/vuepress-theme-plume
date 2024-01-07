<script setup lang="ts">
import { useScrollLock } from '@vueuse/core'
import { inBrowser } from '../../utils/index.js'
import NavScreenAppearance from './NavScreenAppearance.vue'
import NavScreenMenu from './NavScreenMenu.vue'
import NavScreenSocialLinks from './NavScreenSocialLinks.vue'
import NavScreenTranslates from './NavScreenTranslations.vue'

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
    <div v-if="open" id="navScreen" class="nav-screen">
      <div class="container">
        <NavScreenMenu class="menu" />
        <NavScreenTranslates class="translations" />
        <NavScreenAppearance class="appearance" />
        <NavScreenSocialLinks class="social-links" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.nav-screen {
  position: fixed;
  inset: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) 0 0 0;

  /* rtl:ignore */

  /* rtl:ignore */
  width: 100%;
  padding: 0 32px;
  overflow-y: auto;
  pointer-events: auto;
  background-color: var(--vp-nav-screen-bg-color);
  border-top: 1px solid var(--vp-c-divider);
  transition: background-color 0.5s;
}

.container {
  max-width: 288px;
  padding: 24px 0 96px;
  margin: 0 auto;
}

.nav-screen.fade-enter-active,
.nav-screen.fade-leave-active {
  transition: opacity 0.25s;
}

.nav-screen.fade-enter-active .container,
.nav-screen.fade-leave-active .container {
  transition: transform 0.25s ease;
}

.nav-screen.fade-enter-from,
.nav-screen.fade-leave-to {
  opacity: 0;
}

.nav-screen.fade-enter-from .container,
.nav-screen.fade-leave-to .container {
  transform: translateY(-8px);
}

@media (min-width: 768px) {
  .nav-screen {
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
