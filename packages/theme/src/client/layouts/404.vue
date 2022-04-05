<script lang="ts" setup>
import { useRouteLocale } from '@vuepress/client'
import { useThemeLocaleData } from '../composables'

const routeLocale = useRouteLocale()
const themeLocale = useThemeLocaleData()

const message = themeLocale.value.notFound ?? ['Not Found']
const getMsg = (): string => message[Math.floor(Math.random() * message.length)]
const homeLink = themeLocale.value.home ?? routeLocale.value
const homeText = themeLocale.value.backToHome ?? 'Back to home'
</script>
<template>
  <div class="theme-plume not-found">
    <div class="not-found-content">
      <blockquote>{{ getMsg() }}</blockquote>

      <RouterLink :to="homeLink">{{ homeText }}</RouterLink>
    </div>
  </div>
</template>

<style lang="scss">
.not-found {
  width: 100%;

  &-content {
    padding: 1.25rem;
  }
}
</style>
