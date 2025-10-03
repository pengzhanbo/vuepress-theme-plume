<script lang="ts" setup>
import type { Ref } from 'vue'
import VPBadge from '@theme/global/VPBadge.vue'
import VPLink from '@theme/VPLink.vue'
import { useReadingTimeLocale } from '@vuepress/plugin-reading-time/client'
import { computed, inject, ref } from 'vue'
import { useData, useInternalLink, usePostsPageData, useTagColors } from '../composables/index.js'

const { page, frontmatter: matter, theme, collection } = useData<'post'>()
const colors = useTagColors()
const readingTime = useReadingTimeLocale()
const { tags: tagsLink } = useInternalLink()
const { isPosts } = usePostsPageData()

const createTime = computed(() => {
  const show = theme.value.createTime ?? true
  if (!show || (show === 'only-posts' && !isPosts.value))
    return ''
  if (matter.value.createTime)
    return matter.value.createTime.split(/\s|T/)[0].replace(/\//g, '-')

  return ''
})

const tags = computed(() => {
  const tagTheme = collection.value?.tagsTheme ?? 'colored'
  if (matter.value.tags) {
    return matter.value.tags.slice(0, 4).map(tag => ({
      name: tag,
      className: colors.value[tag] ? `vp-tag-${colors.value[tag]}` : `tag-${tagTheme}`,
    }))
  }

  return []
})

const badge = computed(() => {
  if (matter.value.badge) {
    return typeof matter.value.badge === 'string' ? { text: matter.value.badge } : matter.value.badge
  }
  return false
})

// 无法准确判断是否存在 doc-meta 插槽，因此需要通过 provide 传递
const hasDocMetaSlot = inject<Ref<boolean>>('doc-meta-slot-exists', ref(false))

const hasMeta = computed(() =>
  readingTime.value.time
  || tags.value.length
  || createTime.value
  || hasDocMetaSlot.value,
)
</script>

<template>
  <h1 class="vp-doc-title page-title" :class="{ padding: !hasMeta }">
    <VPBadge v-if="page.frontmatter.draft" type="warning" text="DRAFT" />
    {{ page.title }}
    <VPBadge v-if="badge" :type="badge.type || 'tip'" :text="badge.text" />
  </h1>

  <div v-if="hasMeta" class="vp-doc-meta">
    <slot name="doc-meta-before" />

    <p v-if="readingTime.time && matter.readingTime !== false" class="reading-time">
      <span class="vpi-books icon" />
      <span>{{ readingTime.words }}</span>
      <span>{{ readingTime.time }}</span>
    </p>

    <p v-if="tags.length > 0">
      <span class="vpi-tag icon" />
      <VPLink
        v-for="tag in tags"
        :key="tag.name"
        class="tag"
        :class="tag.className"
        :href="tagsLink?.link && isPosts ? `${tagsLink.link}?tag=${tag.name}` : undefined"
      >
        {{ tag.name }}
      </VPLink>
    </p>

    <slot name="doc-meta-after" />

    <p v-if="createTime" class="create-time">
      <span class="vpi-clock icon" /><span>{{ createTime }}</span>
    </p>
  </div>
</template>

<style scoped>
.vp-doc-title {
  margin-bottom: 0.7rem;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  transition: color var(--vp-t-color);
}

.vp-doc-title.padding {
  padding-bottom: 4rem;
}

.vp-doc-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem 0 0.5rem;
  margin-bottom: 2rem;
  font-size: 14px;
  color: var(--vp-c-text-3);
  border-bottom: solid 1px var(--vp-c-divider);
  transition: color var(--vp-t-color), border-bottom var(--vp-t-color);
}

.vp-doc-meta p {
  display: flex;
  gap: 6px;
  align-items: center;
}

.vp-doc-meta .icon {
  width: 14px;
  height: 14px;
}

.vp-doc-meta .tag {
  display: inline-block;
  padding: 3px 5px;
  font-size: 12px;
  line-height: 1;
  color: var(--vp-tag-color);
  background-color: var(--vp-tag-bg);
  border-radius: 3px;
}

.vp-doc-meta .create-time {
  text-align: right;
}

@media (min-width: 768px) {
  .vp-doc-meta .create-time {
    flex: 1 2;
    justify-content: right;
  }
}
</style>
