<script lang="ts" setup>
import { ref } from 'vue'
import type { TagsItem } from '../composables/useTages'
import { useTags } from '../composables/useTages'

const tagList = useTags()
const show = ref(false)
const maxCount = ref(10)

const triggerShow = (): void => {
  show.value = !show.value
}

const getLink = (tag: TagsItem): string => {
  return '/tags/?tag=' + encodeURIComponent(tag.tag)
}
</script>
<template>
  <div class="tags-sidebar-wrapper">
    <h3>标签</h3>
    <div class="tags-sidebar-container">
      <RouterLink
        v-for="(tag, index) in tagList"
        v-show="index < maxCount || show"
        :key="tag.tag"
        :to="getLink(tag)"
      >
        <span>{{ tag.tag }}</span>
        <span>({{ tag.count }})</span>
      </RouterLink>
      <span
        v-if="tagList.length >= maxCount"
        class="tags-more"
        @click="triggerShow"
      >
        {{ show ? '隐藏' : '更多' }}
      </span>
    </div>
  </div>
</template>
