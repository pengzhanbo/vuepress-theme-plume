<script lang="ts" setup>
import { useSiteData, withBase } from '@vuepress/client'
import { ref } from 'vue'

const siteData = useSiteData()
const navListRaw = [
  { label: '首页', link: '/' },
  { label: '栏目', link: '/category/' },
  { label: '标签', link: '/tags/' },
  { label: '归档', link: '/archives/' },
]
const navList = ref(
  navListRaw.map(({ label, link }) => ({
    label,
    link: withBase(link),
  }))
)
</script>

<template>
  <div class="navbar-wrapper">
    <div class="flex items-center">
      <!-- <div class="blog-logo">
        <img src="" />
      </div> -->
      <div class="blog-title">
        <h3>{{ siteData.title }}</h3>
      </div>
    </div>
    <div class="flex items-center">
      <RouterLink
        v-for="nav in navList"
        :key="nav.link"
        :to="nav.link"
        class="nav-link"
      >
        <span>{{ nav.label }}</span>
      </RouterLink>
    </div>
  </div>
</template>
