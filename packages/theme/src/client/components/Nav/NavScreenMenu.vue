<script lang="ts" setup>
import { useThemeLocaleData } from '../../composables/index.js'
import NavScreenMenuGroup from './NavScreenMenuGroup.vue'
import NavScreenMenuLink from './NavScreenMenuLink.vue'

const theme = useThemeLocaleData()
</script>

<template>
  <nav v-if="theme.navbar" class="nav-screen-menu">
    <template v-for="item in theme.navbar" :key="item.text">
      <NavScreenMenuLink
        v-if="'link' in item"
        :text="item.text"
        :link="item.link"
      />
      <NavScreenMenuGroup v-else :text="item.text || ''" :items="item.items" />
    </template>
  </nav>
</template>
