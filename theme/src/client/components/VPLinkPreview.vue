<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { computed, nextTick, shallowRef, useTemplateRef, watch } from 'vue'
import { useData, useLinkPreview, useTagColors } from '../composables/index.js'
import { resolvePreviewPosition } from '../utils/index.js'

import '@vuepress/helper/transition/fade-in-scale-up.css'

const { theme, lang } = useData()
const { enabled, active, options, viewport } = useLinkPreview()
const colors = useTagColors()

/** Max card width / 卡片最大宽度 */
const MAX_WIDTH = 360

/** Min gap to the viewport edges / 与视口边缘的最小间距 */
const MARGIN = 8

/** Gap between the anchor and the card / 卡片与链接的间距 */
const OFFSET = 8

const card = useTemplateRef<HTMLElement>('card')
const size = shallowRef({ width: 0, height: 0 })

const width = computed(() =>
  Math.max(0, Math.min(options.value.maxWidth ?? MAX_WIDTH, viewport.value.width - MARGIN * 2)),
)

const position = computed(() => {
  const state = active.value
  if (!state)
    return null

  return resolvePreviewPosition(
    state.rect,
    { width: width.value, height: size.value.height },
    { width: viewport.value.width, height: viewport.value.height },
    { offset: OFFSET, margin: MARGIN },
  )
})

const updatedDate = computed(() => {
  const time = active.value?.item.updatedTime
  return time ? new Date(time).toLocaleDateString(lang.value, { dateStyle: 'medium' }) : ''
})

const lastUpdatedText = computed(() => theme.value.lastUpdatedText || 'Last updated')

const tags = computed(() =>
  (active.value?.item.tags ?? []).map(tag => ({
    name: tag,
    className: colors.value[tag] ? `vp-tag-${colors.value[tag]}` : 'tag-gray',
  })),
)

function measure(): void {
  const el = card.value
  if (!el)
    return

  const next = { width: el.offsetWidth, height: el.offsetHeight }
  if (next.width !== size.value.width || next.height !== size.value.height)
    size.value = next
}

watch(active, async () => {
  if (!active.value)
    return
  await nextTick()
  measure()
}, { flush: 'post' })

useResizeObserver(card, measure)
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="fade-in-scale-up">
        <div
          v-if="enabled && active && position"
          ref="card"
          class="vp-link-preview"
          role="tooltip"
          aria-hidden="true"
          :data-placement="position.placement"
          :style="{ top: `${position.top}px`, left: `${position.left}px`, width: `${width}px` }"
        >
          <p class="link-preview-title">
            {{ active.item.title }}
          </p>
          <p v-if="active.item.excerpt" class="link-preview-excerpt">
            {{ active.item.excerpt }}
          </p>
          <ul v-if="active.item.headings?.length" class="link-preview-headings">
            <li v-for="heading in active.item.headings" :key="heading">
              {{ heading }}
            </li>
          </ul>
          <div v-if="tags.length || updatedDate" class="link-preview-footer">
            <span v-if="tags.length" class="link-preview-tags">
              <span
                v-for="tag in tags"
                :key="tag.name"
                class="tag"
                :class="tag.className"
              >{{ tag.name }}</span>
            </span>
            <span v-if="updatedDate" class="link-preview-time">
              {{ lastUpdatedText }} {{ updatedDate }}
            </span>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.vp-link-preview {
  position: fixed;
  z-index: var(--vp-z-index-link-preview);
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  pointer-events: none;
  background-color: var(--vp-c-bg);
  border: solid 1px var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-2);
  transition: color var(--vp-t-color), background-color var(--vp-t-color), border-color var(--vp-t-color);
}

.link-preview-title {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.link-preview-excerpt {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.link-preview-headings {
  padding-left: 8px;
  margin: 0;
  list-style: none;
  border-left: solid 2px var(--vp-c-divider);
}

.link-preview-headings li {
  overflow: hidden;
  font-size: 12px;
  line-height: 1.8;
  color: var(--vp-c-text-3);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-preview-footer {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  border-top: solid 1px var(--vp-c-divider);
}

.link-preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.link-preview-tags .tag {
  padding: 2px 5px;
  font-size: 11px;
  line-height: 1;
  color: var(--vp-tag-color);
  background-color: var(--vp-tag-bg);
  border-radius: 3px;
}

.link-preview-time {
  flex-shrink: 0;
  margin-left: auto;
}

@media print {
  .vp-link-preview {
    display: none;
  }
}
</style>
