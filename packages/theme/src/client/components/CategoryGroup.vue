<script lang="ts" setup>
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import type { FunctionalComponent, PropType } from 'vue'
import { h } from 'vue'
import type { CategoryItem } from '../composables'
const props = defineProps({
  category: {
    type: Object as PropType<CategoryItem>,
    required: true,
  },
  head: {
    type: Number,
    default: 2,
  },
  index: {
    type: Number,
    required: true,
  },
})
const Heading: FunctionalComponent = () => {
  const head = props.head > 4 ? 4 : props.head
  return h(
    `h${head}`,
    { id: props.category.label.trim().replace(/\s+/g, '-') },
    [props.category.label]
  )
}
</script>
<template>
  <DropdownTransition :delay="index * 0.04">
    <section class="category-group-wrapper">
      <Heading />
      <ul class="category-list">
        <li
          v-for="post in category.postList"
          :key="post.path"
          class="category-item"
        >
          <span>[{{ post.createTime }}]</span>
          <RouterLink :to="post.path">{{ post.title }}</RouterLink>
        </li>
      </ul>
      <CategoryGroup
        v-for="(cate, i) in category.children"
        :key="cate.type + '__' + i"
        :category="cate"
        :head="head + 1"
        :index="i"
      />
    </section>
  </DropdownTransition>
</template>
<style lang="scss">
.category-group-wrapper {
  padding: 1.25rem 1.5rem;
  background-color: var(--c-bg-container);
  border-radius: var(--p-around);
  margin-bottom: 1.25rem;
  // box-shadow: var(--shadow);
  transition: box-shadow var(--t-color);

  .category-group-wrapper {
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    margin-left: 1.25rem;
    border-bottom: solid 1px var(--c-border);

    &:last-child {
      border-bottom: none;
    }

    .category-group-wrapper {
      margin-left: 0;
    }
  }

  .category-list {
    list-style: none;
    padding-left: 1.25rem;
  }

  .category-item {
    span {
      color: var(--c-text-lighter);
      margin-right: 1.25rem;
    }

    a {
      color: var(--c-text);

      &:hover {
        color: var(--c-text-accent);
      }
    }
  }
}
</style>
