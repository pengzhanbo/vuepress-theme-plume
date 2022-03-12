<script lang="ts" setup>
import Icon from '@theme/Icon.vue'
import TagSidebar from '@theme/TageSidebar.vue'
import { withBase } from '@vuepress/client'
import { computed } from 'vue'
import { useThemeData } from '../composables/useThemeData'

const themeData = useThemeData()
const avatarUrl = computed(() => {
  return withBase(themeData.value.avatarUrl)
})
</script>
<template>
  <div class="right-sidebar-wrapper">
    <div class="profile-wrapper">
      <img :src="avatarUrl" alt="" />
      <div class="profile-link">
        <a v-if="themeData.github" :href="themeData.github" target="_blank"
          ><Icon type="github" size="xs" />
        </a>
        <a
          v-if="themeData.email"
          :href="'mailto:' + themeData.email"
          target="_blank"
          ><Icon type="email" size="xs" />
        </a>
      </div>
      <h3>{{ themeData.avatar }}</h3>
      <p v-if="themeData.description">
        {{ themeData.description }}
      </p>
    </div>
    <TagSidebar></TagSidebar>
  </div>
</template>
