<script setup lang="ts">
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import { ref } from 'vue'
import NavScreenAppearance from './NavScreenAppearance.vue'
import NavScreenMenu from './NavScreenMenu.vue'
import NavScreenSocialLinks from './NavScreenSocialLinks.vue'
import NavScreenTranslates from './NavScreenTranslations.vue'

defineProps<{
  open: boolean
}>()

const screen = ref<HTMLElement | null>(null)

function lockBodyScroll() {
  disableBodyScroll(screen.value!, { reserveScrollBarGap: true })
}

function unlockBodyScroll() {
  clearAllBodyScrollLocks()
}
</script>

<template>
  <Transition
    name="fade"
    @enter="lockBodyScroll"
    @after-leave="unlockBodyScroll"
  >
    <div v-if="open" ref="screen" class="nav-screen">
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
  top: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 1px);
  /*rtl:ignore*/
  right: 0;
  bottom: 0;
  /*rtl:ignore*/
  left: 0;
  padding: 0 32px;
  width: 100%;
  background-color: var(--vp-nav-screen-bg-color);
  overflow-y: auto;
  transition: background-color 0.5s;
  pointer-events: auto;
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

.container {
  margin: 0 auto;
  padding: 24px 0 96px;
  max-width: 288px;
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
