<script lang="ts" setup>
import DarkModeButton from '@theme-plume/DarkModeButton.vue'
import NavbarBrand from '@theme-plume/NavbarBrand.vue'
import NavbarItems from '@theme-plume/NavbarItems.vue'
import ToggleSidebarButton from '@theme-plume/ToggleSidebarButton.vue'
import { computed, onMounted, ref } from 'vue'
import { useAsideNavbar, useThemeLocaleData } from '../composables'
import { getCssValue } from '../utils'

const themeLocale = useThemeLocaleData()

const { triggerAsideNavbar } = useAsideNavbar()

const navbar = ref<HTMLElement | null>(null)
const navbarBrand = ref<HTMLElement | null>(null)

const linksWrapperMaxWith = ref(0)
const linksWrapperStyle = computed(() => {
  if (!linksWrapperMaxWith.value) {
    return {}
  }
  return {
    maxWidth: linksWrapperMaxWith.value + 'px',
  }
})
const enableDarkMode = computed(() => themeLocale.value.darkMode)

onMounted(() => {
  const MOBILE_DESKTOP_BREAKPOINT = 719
  const navbarHorizontalPadding =
    getCssValue(navbar.value, 'paddingLeft') +
    getCssValue(navbar.value, 'paddingRight')
  const handleLinkWrapWidth = (): void => {
    if (window.innerWidth <= MOBILE_DESKTOP_BREAKPOINT) {
      linksWrapperMaxWith.value = 0
    } else {
      linksWrapperMaxWith.value =
        navbar.value!.offsetWidth -
        navbarHorizontalPadding -
        (navbarBrand.value?.offsetWidth || 0)
    }
  }
  handleLinkWrapWidth()
  window.addEventListener('resize', handleLinkWrapWidth, false)
  window.addEventListener('orientationchange', handleLinkWrapWidth, false)
})
</script>
<template>
  <header ref="navbar" class="navbar-wrapper">
    <ToggleSidebarButton @toggle="triggerAsideNavbar(true)" />
    <span ref="navbarBrand">
      <NavbarBrand />
    </span>
    <div class="navbar-items-wrapper" :style="linksWrapperStyle">
      <slot name="before" />
      <NavbarItems class="can-hide" is-header />
      <slot name="after" />
      <DarkModeButton v-if="enableDarkMode" />
      <NavbarSearch />
    </div>
  </header>
</template>
<style lang="scss">
@import '../styles/variables';
.navbar-wrapper {
  --navbar-line-height: calc(
    var(--navbar-height) - 2 * var(--navbar-padding-v)
  );
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100v;
  height: var(--navbar-height);
  padding: var(--navbar-padding-v) var(--navbar-padding-h);
  background-color: var(--c-bg-navbar);
  backdrop-filter: saturate(50%) blur(8px);
  // box-shadow: var(--shadow);
  line-height: var(--navbar-line-height);
  transition: background-color 0.3s ease;

  .logo {
    height: var(--navbar-line-height);
    margin-right: var(--navbar-padding-v);
    vertical-align: top;
  }

  .site-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--c-text);
    position: relative;
    transition: color 0.3s ease;
  }

  .navbar-items-wrapper {
    display: flex;
    white-space: nowrap;
    font-size: 0.9rem;
    height: var(--navbar-line-height);

    .search-box {
      flex: 0 0 auto;
      vertical-align: top;
    }

    .navbar-items .navbar-item {
      & > .router-link-active {
        color: var(--c-text-accent);
      }
    }
  }
}

.DocSearch {
  transition: background-color var(--t-color);
}

@media (max-width: $MQMobile) {
  .navbar-wrapper {
    padding-left: 4rem;

    .can-hide {
      display: none;
    }

    .site-name {
      width: calc(100vw - 9.4rem);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
