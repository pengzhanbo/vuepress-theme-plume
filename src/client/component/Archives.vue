<script lang="ts" setup>
import * as dayjs from 'dayjs'
import { useArchivesList } from '../composables/useArchives'

const archivesList = useArchivesList()

const format = (date: string | number | undefined): string => {
  return dayjs(date).format('MM-DD')
}
</script>
<template>
  <div class="archives-list-wrapper">
    <h2>归档</h2>
    <div
      v-for="archives in archivesList"
      :key="archives.label"
      class="archives-list-container"
    >
      <h3>{{ archives.label }}</h3>
      <ul>
        <li
          v-for="post in archives.postList"
          :key="post.path"
          class="archives-item"
        >
          <span>[{{ format(post.frontmatter.createTime) }}]</span>
          <RouterLink :to="post.path">{{ post.title }}</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
