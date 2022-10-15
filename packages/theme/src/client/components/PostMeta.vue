<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { PostItem } from '../../shared/index.js'
import { useThemeLocaleData } from '../composables/index.js'
import { getColor, normalizePath } from '../utils/index.js'
import { ClockIcon, FolderIcon, TagIcon, UserIcon } from './icons/index.js'

const props = defineProps({
  post: {
    type: Object as PropType<PostItem>,
    required: true,
  },
  border: {
    type: Boolean,
    required: false,
    default: false,
  },
  showAuthor: {
    type: Boolean,
    default: true,
  },
})
const route = useRoute()
const router = useRouter()
const themeLocale = useThemeLocaleData()

const tags = computed(() => {
  return (props.post.tags || []).filter((_, i) => i < 4)
})

const category = computed(() => {
  return (props.post.category || []).filter((cate) =>
    Boolean(cate.name?.trim())
  )
})

const handleTag = (tag: string): void => {
  const tagConfig = themeLocale.value.tag
  if (!tagConfig) return
  const link = tagConfig.link.replace(/^\/|\/$/g, '')
  router.replace({
    path: `/${link}/`,
    query: { tag: normalizePath(tag) },
  })
}
</script>
<template>
  <div class="post-meta" :class="{ border: post.excerpt || border }">
    <div v-if="post.author && showAuthor" class="post-meta-author">
      <UserIcon />
      <span>{{ post.author }}</span>
    </div>
    <div v-if="category.length > 0" class="post-meta-category">
      <FolderIcon />
      <template v-for="(cate, i) in category" :key="cate.type">
        <span>{{ cate.name }}</span>
        <span v-if="i < category.length - 1"> / </span>
      </template>
    </div>
    <div v-if="tags.length > 0">
      <TagIcon />
      <template v-for="tag in tags" :key="tag">
        <span
          class="post-meta-tag"
          :style="{ 'background-color': getColor() }"
          @click="handleTag(tag)"
        >
          {{ tag }}
        </span>
      </template>
    </div>
    <div class="post-meta-create-time">
      <ClockIcon />
      <span>{{ post.createTime }}</span>
    </div>
  </div>
</template>
<style lang="scss">
.post-meta {
  color: var(--c-text-light);
  overflow: hidden;
  font-size: 14px;

  &.border {
    border-bottom: solid 1px var(--c-border);
  }

  & > div {
    float: left;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-right: 1.25rem;
    height: 2rem;
    line-height: 1.5rem;
    padding-bottom: 0.5rem;
  }

  .icon {
    width: 0.875rem;
    height: 0.875rem;
    margin-right: 0.2rem;
    color: var(--c-text-lighter);
  }

  .post-meta-tag {
    display: inline-block;
    height: 1.25rem;
    line-height: 1.25rem;
    padding: 0 0.4rem;
    color: #fff;
    border-radius: 0.75rem;
    margin: 0 0.15rem;
    cursor: pointer;

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
