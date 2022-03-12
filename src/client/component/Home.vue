<script lang="ts" setup>
import PostList from '@theme/PostList.vue'
import RightSideBar from '@theme/RightSideBar.vue'
import { withBase } from '@vuepress/client'
import { ref } from 'vue'
import { useThemeData } from '../composables/useThemeData'

const themeData = useThemeData()
const bannerStyle = ref({
  'background-image': `url(${withBase(themeData.value.bannerImg)})`,
})
</script>
<template>
  <div class="home-wrapper">
    <div class="home-banner" :style="bannerStyle"></div>
    <div class="home-container">
      <PostList class="flex-1" />
      <RightSideBar></RightSideBar>
    </div>
  </div>
</template>
