<script setup lang="ts">
import VPIcon from '@theme/VPIcon.vue'
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  icon?: string | { svg: string }
}>()

const icon = computed<string | { svg: string } | undefined>(() => {
  if (props.icon?.[0] === '{') {
    try {
      return JSON.parse(icon) as { svg: string }
    }
    catch {}
  }
  return props.icon
})
</script>

<template>
  <article class="vp-card-wrapper">
    <slot name="title">
      <p v-if="title || icon" class="title">
        <VPIcon v-if="icon" :name="icon" />
        <span v-if="title" v-html="title" />
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
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.vp-card-wrapper .body :first-child {
  margin-top: 0;
}

.vp-card-wrapper .body :last-child {
  margin-bottom: 0;
}
</style>
