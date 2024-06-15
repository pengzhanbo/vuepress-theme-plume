<script lang="ts" setup>
import { useData } from '../../composables/data.js'
import VPNavScreenMenuGroup from './VPNavScreenMenuGroup.vue'
import VPNavScreenMenuLink from './VPNavScreenMenuLink.vue'

const { theme } = useData()
</script>

<template>
  <nav v-if="theme.navbar" class="vp-nav-screen-menu">
    <template v-for="item in theme.navbar" :key="item.text">
      <VPNavScreenMenuLink
        v-if="'link' in item"
        :text="item.text"
        :link="item.link"
        :icon="item.icon"
      />
      <VPNavScreenMenuGroup
        v-else
        :text="item.text || ''"
        :items="item.items"
        :icon="item.icon"
      />
    </template>
  </nav>
</template>
