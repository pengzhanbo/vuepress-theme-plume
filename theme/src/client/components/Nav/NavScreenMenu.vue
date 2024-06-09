<script lang="ts" setup>
import { useData } from '../../composables/data.js'
import NavScreenMenuGroup from './NavScreenMenuGroup.vue'
import NavScreenMenuLink from './NavScreenMenuLink.vue'

const { theme } = useData()
</script>

<template>
  <nav v-if="theme.navbar" class="nav-screen-menu">
    <template v-for="item in theme.navbar" :key="item.text">
      <NavScreenMenuLink
        v-if="'link' in item"
        :text="item.text"
        :link="item.link"
        :icon="item.icon"
      />
      <NavScreenMenuGroup
        v-else
        :text="item.text || ''"
        :items="item.items"
        :icon="item.icon"
      />
    </template>
  </nav>
</template>
