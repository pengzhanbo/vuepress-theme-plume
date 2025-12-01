<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed } from 'vue'

const { list } = defineProps<{
  list: Record<string, string>
}>()

const emojiList = computed(() => {
  return Object.entries(list).map(([key, value]) => ({
    source: `:${key}:`,
    rendered: value,
  }))
})

const { copy, copied, text } = useClipboard()
</script>

<template>
  <div class="emoji-wrapper">
    <ul>
      <li
        v-for="{ source, rendered } in emojiList" :key="source"
        :class="{ copied: copied && text === source }"
      >
        <Abbreviation @click="copy(source)">
          {{ rendered }}
          <template #tooltip>
            {{ source }}
          </template>
        </Abbreviation>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.emoji-wrapper ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  list-style: none;
}

.emoji-wrapper ul li {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  margin: 0;
  font-size: 28px;
  cursor: pointer;
  border: solid 1px var(--vp-c-divider);
  border-radius: 4px;
  transition: border-color var(--vp-t-color);
}

.emoji-wrapper ul li.copied {
  position: relative;
  border-color: var(--vp-c-brand);
}

.emoji-wrapper ul li.copied::after {
  position: absolute;
  right: 0;
  bottom: 0;
  display: inline-block;
  width: 14px;
  height: 14px;
  font-size: 14px;
  line-height: 14px;
  color: var(--vp-c-success-1);
  text-align: center;
  vertical-align: -0.125em;
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z'/%3E%3C/svg%3E");
  background-color: var(--vp-c-success-soft);
}

.emoji-wrapper ul li .vp-abbr {
  text-decoration: none;
  cursor: inherit;
}
</style>
