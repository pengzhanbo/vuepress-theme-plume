<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostIndex } from '../composables/usePostIndex'
import PostMeta from './PostMeta.vue'

const postIndex = usePostIndex()
const router = useRouter()
const route = useRoute()

const postList = computed(() => {
  const tag = route.query.tag as string
  if (route.path === '/tags/' && tag) {
    return postIndex.value.filter((post) =>
      post.frontmatter.tags?.includes(tag)
    )
  }
  return postIndex.value
})

const linkTo = (path: string): void => {
  router.push({ path })
}
</script>

<template>
  <div class="post-list">
    <section
      v-for="post in postList"
      :key="post.path"
      class="post-list-item"
      @click="linkTo(post.path)"
    >
      <PostMeta :post="post" type="postItem"></PostMeta>
      <div v-if="post.excerpt" class="mt-3">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="post-list-excerpt" v-html="post.excerpt"></div>
      </div>
    </section>
  </div>
</template>
