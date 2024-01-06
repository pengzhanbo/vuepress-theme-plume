<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useDarkMode } from '../composables/index.js'
import { useThemeLocaleData } from '../composables/themeData.js'
import { APPEARANCE_KEY } from '../utils/index.js'
import IconMoon from './icons/IconMoon.vue'
import IconSun from './icons/IconSun.vue'
import Switch from './Switch.vue'

const theme = useThemeLocaleData()
const checked = ref(false)
const isDark = useDarkMode()

const toggle = typeof document !== 'undefined' ? useAppearance() : () => {}

onMounted(() => {
  checked.value = document.documentElement.classList.contains('dark')
})

function useAppearance() {
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  const classList = document.documentElement.classList

  let userPreference = localStorage.getItem(APPEARANCE_KEY)

  let isDark
    = (theme.value.appearance === 'dark' && userPreference == null)
    || (userPreference === 'auto' || userPreference == null
      ? query.matches
      : userPreference === 'dark')

  query.onchange = (e) => {
    if (userPreference === 'auto')
      setClass((isDark = e.matches))
  }

  setClass(isDark)

  function toggle() {
    setClass((isDark = !isDark))

    userPreference = isDark
      ? query.matches
        ? 'auto'
        : 'dark'
      : query.matches
        ? 'light'
        : 'auto'

    localStorage.setItem(APPEARANCE_KEY, userPreference)
  }

  function setClass(dark: boolean): void {
    const css = document.createElement('style')
    css.type = 'text/css'
    css.appendChild(
      document.createTextNode(
        `:not(.switch-appearance):not(.switch-appearance *) {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -o-transition: none !important;
  -ms-transition: none !important;
  transition: none !important;
}`,
      ),
    )
    document.head.appendChild(css)

    checked.value = dark
    classList[dark ? 'add' : 'remove']('dark')

    const _ = window.getComputedStyle(css).opacity
    document.head.removeChild(css)
  }

  return toggle
}

watch(checked, (newIsDark) => {
  isDark.value = newIsDark
})
</script>

<template>
  <Switch
    class="switch-appearance"
    aria-label="toggle dark mode"
    :aria-checked="checked"
    @click="toggle"
  >
    <IconSun class="sun" />
    <IconMoon class="moon" />
  </Switch>
</template>

<style scoped>
.sun {
  opacity: 1;
}

.moon {
  opacity: 0;
}

.dark .sun {
  opacity: 0;
}

.dark .moon {
  opacity: 1;
}

.dark .switch-appearance :deep(.check) {
  /* rtl:ignore */
  transform: translateX(18px);
}
</style>
