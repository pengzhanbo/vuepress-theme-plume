<script lang="ts" setup>
import AutoLink from '@theme-plume/AutoLink.vue'
import NavbarDropdown from '@theme-plume/NavbarDropdown.vue'
import { computed } from 'vue'
import type { NavGroup, ResolveNavbarItem } from '../../shared'
import {
  useNavbarConfig,
  useNavbarRepo,
  useNavbarSelectLanguage,
} from '../composables'

defineProps({
  isHeader: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const navbarConfig = useNavbarConfig()
const navbarSelectLanguage = useNavbarSelectLanguage()
const navbarRepo = useNavbarRepo()
const navbarLinks = computed(() => [
  ...navbarConfig.value,
  ...navbarSelectLanguage.value,
  ...navbarRepo.value,
])
</script>

<template>
  <nav v-if="navbarLinks.length" class="navbar-items">
    <div v-for="item in navbarLinks" :key="item.text" class="navbar-item">
      <NavbarDropdown
        v-if="(item as NavGroup<ResolveNavbarItem>).children"
        :item="item"
        :is-header="isHeader"
      />
      <AutoLink v-else :item="item" />
    </div>
  </nav>
</template>

<style lang="scss">
.navbar-wrapper {
  .navbar-items {
    --navbar-line-height: calc(
      var(--navbar-height) - 2 * var(--navbar-padding-v)
    );
    display: inline-block;

    a {
      display: inline-block;
      line-height: 1.4rem;
      color: inherit;

      &:hover,
      &.router-lint-active {
        color: var(--c-text-accent);
      }
    }

    .navbar-item {
      position: relative;
      display: inline-block;
      margin-left: 1.5rem;
      line-height: var(--navbar-line-height);

      &:first-child {
        margin-left: 0;
      }
    }
  }
}
</style>
