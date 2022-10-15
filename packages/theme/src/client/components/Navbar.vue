<script lang="ts" setup>
import DarkModeButton from '@theme-plume/DarkModeButton.vue'
import NavbarBrand from '@theme-plume/NavbarBrand.vue'
import NavbarItems from '@theme-plume/NavbarItems.vue'
import ToggleSidebarButton from '@theme-plume/ToggleSidebarButton.vue'
import { computed, onMounted, ref } from 'vue'
import { useAsideNavbar, useThemeLocaleData } from '../composables/index.js'
import { getCssValue } from '../utils/index.js'

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
    <span ref="navbarBrand" class="navbar-brand-wrapper">
      <NavbarBrand />
    </span>
    <div class="navbar-items-wrapper" :style="linksWrapperStyle">
      <slot name="before" />
      <div class="navbar-item-search">
        <NavbarSearch />
      </div>
      <NavbarItems class="can-hide" is-header />
      <slot name="after" />
      <DarkModeButton v-if="enableDarkMode" />
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
  width: 100%;
  height: var(--navbar-height);
  padding: 0 0 0 var(--navbar-padding-h);
  background-color: var(--c-bg-navbar);
  backdrop-filter: saturate(50%) blur(8px);
  // box-shadow: var(--shadow);
  line-height: var(--navbar-line-height);
  transition: background-color 0.3s ease;

  .navbar-brand-wrapper {
    display: inline-block;
    height: 100%;
  }
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
    align-items: center;
    flex-grow: 1;
    white-space: nowrap;
    font-size: 0.9rem;
    height: 100%;
    padding-right: var(--navbar-padding-h);

    .navbar-item-search {
      flex-grow: 1;
      padding-left: 1.5rem;
    }

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

    .navbar-items-wrapper {
      justify-content: flex-end;
      .navbar-item-search {
        flex-grow: 0;
      }
    }
  }
}
</style>
