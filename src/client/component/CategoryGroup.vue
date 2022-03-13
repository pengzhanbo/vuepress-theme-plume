<script lang="ts" setup>
import type { Component } from 'vue'
import { h, withDefaults } from 'vue'
import type { CategoryItem } from '../composables'
import { dayjs } from '../utils/dayjs'

interface Props {
  category: CategoryItem
  head: number
}
const props = withDefaults(defineProps<Props>(), {
  head: 2,
})

const format = (date: string | undefined): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

const getCount = (category: CategoryItem, count = 0): number => {
  count += category.postList.length
  if (category.children.length > 0) {
    category.children.forEach((child) => {
      count += child.postList.length
    })
  }
  return count
}

const TitleFnComponent = (): Component => {
  const head = props.head > 4 ? 4 : props.head
  return h(`h${head}`, { id: props.category.label }, [
    props.category.label,
    h('span', `(${getCount(props.category)})`),
  ])
}
</script>
<template>
  <div class="category-group-wrapper">
    <TitleFnComponent />
    <ul>
      <li
        v-for="post in category.postList"
        :key="post.path"
        class="category-group-item"
      >
        <span class="mr-5">[{{ format(post.frontmatter.createTime) }}]</span>
        <RouterLink :to="post.path">{{ post.title }}</RouterLink>
      </li>
    </ul>
    <CategoryGroup
      v-for="cate in category.children"
      :key="'' + head + cate.type"
      :category="cate"
      :head="head + 1"
    />
  </div>
</template>
