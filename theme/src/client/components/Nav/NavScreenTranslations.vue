<script setup lang="ts">
import { ref } from 'vue'
import { useLangs } from '../../composables/langs.js'
import AutoLink from '../AutoLink.vue'

const { localeLinks, currentLang } = useLangs()
const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div
    v-if="localeLinks.length && currentLang.label"
    class="nav-screen-translations"
    :class="{ open: isOpen }"
  >
    <button class="title" @click="toggle">
      <span class="vpi-languages icon lang" />
      {{ currentLang.label }}
      <span class="vpi-chevron-down icon chevron" />
    </button>

    <ul class="list">
      <li v-for="locale in localeLinks" :key="locale.link" class="item">
        <AutoLink class="link" :href="locale.link">
          {{ locale.text }}
        </AutoLink>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.nav-screen-translations {
  height: 24px;
  overflow: hidden;
}

.nav-screen-translations.open {
  height: auto;
}

.title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}

.icon {
  font-size: 16px;
}

.icon.lang {
  margin-right: 8px;
}

.icon.chevron {
  margin-left: 4px;
}

.list {
  padding: 4px 0 0 24px;
}

.link {
  font-size: 13px;
  line-height: 32px;
  color: var(--vp-c-text-1);
  transition: color var(--t-color);
}
</style>
