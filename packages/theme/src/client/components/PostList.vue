<script lang="ts" setup>
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import PostItem from '@theme-plume/PostItem.vue'
import { usePageFrontmatter } from '@vuepress/client'
import type { PropType } from 'vue'
import { toRefs, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import type { PlumeThemeHomeFrontmatter } from '../../shared'
import type { PostListData } from '../composables'
import { usePostList } from '../composables'
import { scrollTo } from '../utils'
import Pagination from './Pagination.vue'

const props = defineProps({
  postList: {
    type: Array as PropType<PostListData | undefined>,
    required: false,
    default: () => undefined,
  },
})
const router = useRouter()
const frontmatter = usePageFrontmatter<PlumeThemeHomeFrontmatter>()

const propsRef = toRefs(props)
const { postList, total, page, setPostListPage, resetPostIndex } = usePostList()

watch(
  [propsRef.postList],
  ([newPostList]) => {
    newPostList && resetPostIndex(newPostList as unknown as PostListData)
  },
  { immediate: true }
)

const route = useRoute()
let offsetHeight = 0
onBeforeRouteUpdate((to) => {
  if (__VUEPRESS_SSR__) return
  setPostListPage((to.query.p as unknown as number) || 1)
  const { home, banner, mobileBanner } = frontmatter.value
  let top = 0
  if (home && (banner || mobileBanner)) {
    offsetHeight =
      offsetHeight ||
      document.querySelector<HTMLElement>('.navbar-wrapper')?.offsetHeight ||
      0
    top = document.documentElement.clientHeight - offsetHeight
  }
  setTimeout(() => scrollTo(document, top), 0)
})

setPostListPage((route.query.p as unknown as number) || 1)
const togglePage = (currentPage: number): void => {
  router.push({
    path: route.path,
    query: {
      ...route.query,
      p: currentPage,
    },
  })
}
</script>
<template>
  <div class="post-list-wrapper">
    <DropdownTransition>
      <div>
        <PostItem
          v-for="(post, index) in postList"
          :key="post.path"
          :post="post"
          :index="index"
        ></PostItem>
      </div>
    </DropdownTransition>
    <Pagination :page="page" :total="total" @toggle-page="togglePage" />
  </div>
</template>
<style lang="scss">
@import '../styles/_variables';
.post-list-wrapper {
  flex: 1;

  .post-list-item {
    > div {
      position: relative;
      padding: 1.25rem 1.5rem;
      background-color: var(--c-bg-container);
      border-radius: var(--p-around);
      margin-bottom: 1.25rem;
      box-shadow: var(--shadow);
      transition: box-shadow var(--t-color);
      overflow: hidden;

      &:hover {
        box-shadow: var(--shadow-lg);
      }
    }

    .top-icon {
      position: absolute;
      top: 0;
      left: 0;
      width: 2.65rem;
      height: 2.65rem;
      color: var(--c-brand);
    }
  }

  .post-banner {
    position: relative;
    height: 18.75rem;
    margin: -1.25rem -1.5rem 1.25rem -1.5rem;
    overflow: hidden;
    cursor: pointer;

    > div {
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      transform: scale(100%);
      transition: transform var(--t-transform);

      &:hover {
        transform: scale(120%);
      }
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 1.5rem;
      width: 0;
      height: 0;
      border: solid 1.25rem;
      border-color: transparent transparent var(--c-bg-container) transparent;
      z-index: 1;
    }
  }

  h3 {
    width: 100%;
    margin-top: 0;
    overflow: hidden;
    text-overflow: ellipsis;

    a {
      color: var(--c-text);
    }
  }

  .post-excerpt {
    padding-top: 1.25rem;

    :first-child {
      margin-top: 0;
    }
    :last-child {
      margin-bottom: 1rem;
    }
  }

  .post-more {
    text-align: right;

    a {
      display: inline-block;
      padding: 0.5rem 0.75rem;
      border-radius: var(--p-around);
      background-color: var(--c-bg);
      color: var(--c-brand);
    }
  }
}

@media (max-width: $MQMobile) {
  .post-list-wrapper {
    .post-list-item {
      border-radius: 0;
    }
  }
}
</style>
