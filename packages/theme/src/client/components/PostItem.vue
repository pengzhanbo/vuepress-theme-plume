<script lang="ts" setup>
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import type { PropType } from 'vue'
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
</script>
<template>
  <DropdownTransition :delay="index * 0.04">
    <section :key="post.path" class="post-list-item">
      <TopIcon v-if="post.sticky" />
      <h3>
        <AutoLink :item="{ text: post.title, link: post.path }" />
      </h3>
      <PostMeta :post="post" />
      <!--eslint-disable vue/no-v-html-->
      <div v-if="post.excerpt" class="post-excerpt" v-html="post.excerpt"></div>
      <div v-if="post.excerpt" class="post-more">
        <AutoLink :item="{ text: '阅读全文 >>', link: post.path }" />
      </div>
    </section>
  </DropdownTransition>
</template>
