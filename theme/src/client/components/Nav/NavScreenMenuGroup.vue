<script lang="ts" setup>
import { computed, ref } from 'vue'
import VIcon from '../VIcon.vue'
import NavScreenMenuGroupLink from './NavScreenMenuGroupLink.vue'
import NavScreenMenuGroupSection from './NavScreenMenuGroupSection.vue'

const props = defineProps<{
  text: string
  icon?: string | { svg: string }
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
  <div class="nav-screen-menu-group" :class="{ open: isOpen }">
    <button
      class="button"
      :aria-controls="groupId"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span class="button-text">
        <VIcon v-if="icon" :name="icon" />
        <i v-text="text" />
      </span>
      <span class="vpi-plus button-icon" />
    </button>

    <div :id="groupId" class="items">
      <template v-for="item in items" :key="item.text">
        <div v-if="'link' in item" :key="item.text" class="item">
          <NavScreenMenuGroupLink
            :text="item.text"
            :link="item.link"
            :icon="item.icon"
          />
        </div>

        <div v-else class="group">
          <NavScreenMenuGroupSection
            :text="item.text"
            :items="item.items"
            :icon="item.icon"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.nav-screen-menu-group {
  height: 48px;
  overflow: hidden;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: border-color var(--t-color);
}

.nav-screen-menu-group .items {
  visibility: hidden;
}

.nav-screen-menu-group.open .items {
  visibility: visible;
}

.nav-screen-menu-group.open {
  height: auto;
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
  transition: color var(--t-color);
}

.button:hover {
  color: var(--vp-c-brand-1);
}

.nav-screen-menu-group.open .button {
  padding-bottom: 6px;
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

.nav-screen-menu-group.open .button-icon {
  /* rtl:ignore */
  transform: rotate(45deg);
}

.button-text i {
  font-style: normal;
}

.group:first-child {
  padding-top: 0;
}

.group + .group,
.group + .item {
  padding-top: 4px;
}
</style>
