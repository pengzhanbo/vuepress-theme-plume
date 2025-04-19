<script lang="ts" setup>
import VPNavScreenMenuGroup from '@theme/Nav/VPNavScreenMenuGroup.vue'
import VPNavScreenMenuLink from '@theme/Nav/VPNavScreenMenuLink.vue'
import { useNavbarData } from '../../composables/index.js'

const navbar = useNavbarData()
</script>

<template>
  <nav v-if="navbar.length" class="vp-nav-screen-menu">
    <template v-for="item in navbar" :key="item.text">
      <VPNavScreenMenuLink
        v-if="'link' in item"
        :item="item"
      />
      <VPNavScreenMenuGroup
        v-else
        :text="item.text || ''"
        :items="item.items"
        :icon="item.icon"
        :badge="item.badge"
      />
    </template>
  </nav>
</template>
