<script lang="ts" setup>
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import type { PropType } from 'vue'
import { useRouter } from 'vue-router'
import type { PostItem } from '../../shared'
import AutoLink from './AutoLink.vue'
import { TopIcon } from './icons'
import PostMeta from './PostMeta.vue'

defineProps({
  post: {
    type: Object as PropType<PostItem>,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})

const router = useRouter()

const handlePost = (path: string): void => {
  router.push({ path })
}
</script>
<template>
  <DropdownTransition :delay="index * 0.04">
    <section :key="post.path" class="post-list-item">
      <div>
        <TopIcon v-if="post.sticky" />
        <div
          v-if="post.banner"
          class="post-banner"
          @click="handlePost(post.path)"
        >
          <div
            :style="{
              'background-image': `url(${post.banner})`,
            }"
          ></div>
        </div>
        <h3>
          <AutoLink :item="{ text: post.title, link: post.path }" />
        </h3>
        <PostMeta :post="post" />
        <!--eslint-disable vue/no-v-html-->
        <div
          v-if="post.excerpt"
          class="post-excerpt"
          v-html="post.excerpt"
        ></div>
        <div v-if="post.excerpt" class="post-more">
          <AutoLink :item="{ text: '阅读全文', link: post.path }" />
        </div>
      </div>
    </section>
  </DropdownTransition>
</template>
