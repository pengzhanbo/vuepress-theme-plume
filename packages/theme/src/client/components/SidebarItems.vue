<script lang="ts" setup>
import AutoLink from '@theme-plume/AutoLink.vue'
import type { PropType } from 'vue'
import type { SidebarOptions } from '../../shared'

defineProps({
  sidebarList: {
    type: Array as PropType<SidebarOptions>,
    required: true,
  },
})
</script>
<template>
  <ul class="sidebar-items">
    <li v-for="sidebar in sidebarList" :key="sidebar.text">
      <AutoLink
        v-if="sidebar.link"
        :item="{ text: sidebar.text, link: sidebar.link }"
      />
      <p v-else>{{ sidebar.text }}</p>
      <SidebarItems :sidebar-list="sidebar.children" />
    </li>
  </ul>
</template>
<style lang="scss">
.plume-theme-sidebar-wrapper {
  .sidebar-items {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      a {
        color: var(--c-text);
        margin: 0.25rem 0;

        &:hover {
          color: var(--c-text-accent);
        }

        &.router-link-active {
          color: var(--c-text-accent);
        }
      }
      p {
        font-weight: 600;
        margin: 0.25rem 0;
      }
    }
    .sidebar-items {
      font-size: 16px;
      padding-left: 1.25rem;

      li a {
        font-weight: 300;
      }
    }
  }
}
</style>
