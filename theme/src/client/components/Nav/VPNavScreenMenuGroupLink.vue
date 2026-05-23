<script lang="ts" setup>
import type { ResolvedNavItemWithLink } from '../../../shared/index.js'
import VPBadge from '@theme/global/VPBadge.vue'
import VPIcon from '@theme/VPIcon.vue'
import VPLink from '@theme/VPLink.vue'
import { computed, inject } from 'vue'
import { useData } from '../../composables/index.js'
import { isActive } from '../../utils/index.js'

const { item } = defineProps<{
  item: ResolvedNavItemWithLink
}>()

const { page } = useData()

const isActiveLink = computed(() =>
  isActive(
    page.value.path,
    item.activeMatch || item.link,
    !!item.activeMatch,
  ),
)

const closeScreen = inject('close-screen') as () => void
</script>

<template>
  <VPLink
    class="vp-nav-screen-menu-group-link"
    :class="{ active: isActiveLink }"
    :href="item.link"
    :target="item.target"
    :rel="item.rel"
    :no-icon="item.noIcon"
    @click="closeScreen"
  >
    <VPIcon v-if="item.icon" :name="item.icon" />
    <span v-html="item.text" />
    <VPBadge
      v-if="item.badge"
      class="vp-menu-badge"
      v-bind="typeof item.badge === 'string' ? { text: item.badge } : item.badge"
    />
  </VPLink>
</template>

<style scoped>
.vp-nav-screen-menu-group-link {
  display: block;
  margin-left: 12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 32px;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.vp-nav-screen-menu-group-link:hover,
.vp-nav-screen-menu-group-link.active {
  color: var(--vp-c-brand-1);
}
</style>
