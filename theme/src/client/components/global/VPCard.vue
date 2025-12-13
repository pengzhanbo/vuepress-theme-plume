<script setup lang="ts">
import VPIcon from '@theme/VPIcon.vue'
import { computed } from 'vue'

const { title, icon = '' } = defineProps<{
  title?: string
  icon?: string | { svg: string }
}>()

const iconName = computed<string | { svg: string }>(() => {
  if (typeof icon === 'string' && icon?.[0] === '{') {
    try {
      return JSON.parse(icon) as { svg: string }
    }
    catch {}
  }
  return icon
})
</script>

<template>
  <article class="vp-card-wrapper">
    <slot name="title">
      <p v-if="title || icon" class="title">
        <VPIcon v-if="icon" :name="iconName" />
        <span v-if="title" class="text" v-html="title" />
      </p>
    </slot>
    <div class="body">
      <slot />
    </div>
  </article>
</template>

<style scoped>
.vp-card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 16px 20px;
  margin: 16px 0;
  border: solid 1px var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-1);
  transition: border-color var(--vp-t-color), box-shadow var(--vp-t-color);
}

.vp-card-wrapper:hover {
  box-shadow: var(--vp-shadow-2);
}

.vp-card-wrapper :deep(.vp-icon),
.vp-card-wrapper :deep(.vp-icon-img) {
  margin: 0;
}

.vp-card-wrapper .title {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.vp-card-wrapper .title .text {
  flex: 1 2;
  overflow: hidden;
}

.vp-card-wrapper .body > :first-child {
  margin-top: 0;
}

.vp-card-wrapper .body > :last-child {
  margin-bottom: 0;
}

@media (max-width: 639px) {
  .vp-card-wrapper .body :where(div[class*="language-"], .vp-block) {
    margin: 16px -20px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .vp-card-wrapper .body :where(.vp-code-tabs-nav) {
    margin: 16px -20px 0;
  }

  .vp-card-wrapper .body :deep(.code-block-title-bar) {
    margin-inline: -20px;
  }
}
</style>
