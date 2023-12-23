<script lang="ts" setup>
import { computed, ref } from 'vue'
import IconPlus from '../icons/IconPlus.vue'
import NavScreenMenuGroupLink from './NavScreenMenuGroupLink.vue'
import NavScreenMenuGroupSection from './NavScreenMenuGroupSection.vue'

const props = defineProps<{
  text: string
  icon?: string
  items: any[]
}>()

const isOpen = ref(false)

const groupId = computed(
  () => `nav-screen-menu-group-${props.text.replace(' ', '-').toLowerCase()}`
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
        <Icon v-if="icon" :name="icon" />
        <i v-text="text"></i>
      </span>
      <IconPlus class="button-icon" />
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
  border-bottom: 1px solid var(--vp-c-divider);
  height: 48px;
  overflow: hidden;
  transition: border-color 0.5s;
}

.nav-screen-menu-group .items {
  visibility: hidden;
}

.nav-screen-menu-group.open .items {
  visibility: visible;
}

.nav-screen-menu-group.open {
  padding-bottom: 10px;
  height: auto;
}

.nav-screen-menu-group.open .button {
  padding-bottom: 6px;
  color: var(--vp-c-brand);
}

.nav-screen-menu-group.open .button-icon {
  /*rtl:ignore*/
  transform: rotate(45deg);
}

.button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 4px 11px 0;
  width: 100%;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.button:hover {
  color: var(--vp-c-brand);
}

.button-text i {
  font-style: normal;
}

.button-icon {
  width: 14px;
  height: 14px;
  fill: var(--vp-c-text-2);
  transition: fill 0.5s, transform 0.25s;
}

.group:first-child {
  padding-top: 0px;
}

.group + .group,
.group + .item {
  padding-top: 4px;
}
</style>