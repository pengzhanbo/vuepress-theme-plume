<script lang="ts" setup>
import type { ThemeBadge, ThemeIcon } from '../../../shared/index.js'
import VPBadge from '@theme/global/VPBadge.vue'
import VPNavScreenMenuGroupLink from '@theme/Nav/VPNavScreenMenuGroupLink.vue'
import VPNavScreenMenuGroupSection from '@theme/Nav/VPNavScreenMenuGroupSection.vue'
import VPIcon from '@theme/VPIcon.vue'
import { FadeInExpandTransition } from '@vuepress/helper/client'
import { computed, ref } from 'vue'

import '@vuepress/helper/transition/fade-in-height-expand.css'

const props = defineProps<{
  text: string
  icon?: ThemeIcon
  badge?: string | ThemeBadge
  items: any[]
}>()

const isOpen = ref(false)

const groupId = computed(
  () => `nav-screen-menu-group-${props.text.replace(' ', '-').toLowerCase()}`,
)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="vp-nav-screen-menu-group" :class="{ open: isOpen }">
    <button
      class="button"
      :aria-controls="groupId"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span class="button-text">
        <VPIcon v-if="icon" :name="icon" />
        <span v-html="text" />
        <VPBadge
          v-if="badge"
          class="vp-menu-badge"
          v-bind="typeof badge === 'string' ? { text: badge } : badge"
        />
      </span>
      <span class="vpi-plus button-icon" />
    </button>

    <FadeInExpandTransition>
      <div v-show="isOpen" :id="groupId" class="vp-nav-screen-menu-group-container">
        <div class="items">
          <template v-for="item in items" :key="item.text">
            <div v-if="'link' in item" :key="item.text" class="item">
              <VPNavScreenMenuGroupLink :item="item" />
            </div>

            <div v-else class="group">
              <VPNavScreenMenuGroupSection
                :text="item.text"
                :items="item.items"
                :icon="item.icon"
              />
            </div>
          </template>
        </div>
      </div>
    </FadeInExpandTransition>
  </div>
</template>

<style scoped>
.vp-nav-screen-menu-group {
  min-height: 48px;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: border-color var(--vp-t-color);
}

.vp-nav-screen-menu-group .items {
  padding-top: 6px;
  padding-bottom: 10px;
}

.button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 4px 11px 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.button:hover {
  color: var(--vp-c-brand-1);
}

.vp-nav-screen-menu-group.open .button {
  color: var(--vp-c-brand-1);
}

.button-icon {
  width: 14px;
  height: 14px;
  fill: var(--vp-c-text-2);
  transition:
    fill 0.5s,
    transform 0.25s;
}

.vp-nav-screen-menu-group.open .button-icon {
  /* rtl:ignore */
  transform: rotate(45deg);
}

.group:first-child {
  padding-top: 0;
}

.group + .group,
.group + .item {
  padding-top: 4px;
}
</style>
