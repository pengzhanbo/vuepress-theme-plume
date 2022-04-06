<script lang="ts" setup>
import BlogInfo from '@theme-plume/BlogInfo.vue'
import DropdownTransition from '@theme-plume/DropdownTransition.vue'
import type { PageHeader } from '@vuepress/client'
import { computed } from 'vue'
import { useArchive } from '../composables'
import Toc from './Toc'

const archiveList = useArchive()

const headers = computed(() => {
  return archiveList.value.map(({ year }) => {
    return {
      level: 2,
      slug: year,
      title: year,
      children: [],
    } as PageHeader
  })
})
</script>
<template>
  <div class="archive-wrapper">
    <div class="archive-container">
      <DropdownTransition>
        <div class="archive-content">
          <div class="archive-box">
            <div
              v-for="archive in archiveList"
              :key="archive.year"
              class="archive-items"
            >
              <h2>
                <a
                  class="header-anchor"
                  :href="'#' + archive.year"
                  aria-hidden="true"
                  >#</a
                >
                {{ archive.year }}
              </h2>
              <ul class="archive-list">
                <li v-for="child in archive.children" :key="child.link">
                  <span>{{ child.date }}</span>
                  <RouterLink :to="child.link">{{ child.text }}</RouterLink>
                </li>
              </ul>
            </div>
          </div>
          <div class="archive-toc">
            <Toc :headers="headers" />
          </div>
        </div>
      </DropdownTransition>
      <BlogInfo></BlogInfo>
    </div>
  </div>
</template>
<style lang="scss">
@import '../styles/_mixins';

.archive-wrapper {
  @include wrapper;

  .archive-container {
    @include container_wrapper;
    display: flex;
    align-items: flex-start;
    padding: 1.25rem 0;
  }

  .archive-content {
    display: flex;
    align-items: flex-start;
    flex: 1;

    .archive-box {
      flex: 1;
    }
  }

  .archive-items {
    h2 {
      position: relative;
      margin: 0 0 0 4rem;
      border-left: solid 4px var(--c-border);
      border-bottom: none;
      padding: 1.25rem;

      &::before {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        background-color: var(--c-bg-container);
        border-radius: 6px;
        border: solid 2px var(--c-border-dark);
        position: absolute;
        top: 50%;
        left: -2px;
        transform: translate(-50%, -50%);
      }
    }
  }

  .archive-list {
    list-style: none;
    padding-left: 0;
    margin: 0;

    li {
      position: relative;
      margin-left: 4rem;
      border-left: solid 4px var(--c-border);
      padding: 1.25rem;

      &::before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: var(--c-bg-container);
        border-radius: 5px;
        border: solid 2px var(--c-border-dark);
        position: absolute;
        top: 50%;
        left: -2px;
        transform: translate(-50%, -50%);
        transition: border-color var(--t-color);
      }

      > span {
        position: absolute;
        left: -1.25rem;
        top: 50%;
        transform: translate(-100%, -50%);
        color: var(--c-text-light);
        font-size: 14px;
        transition: color var(--t-color);
      }

      > a {
        display: inline-block;
        width: 100%;
        padding: 0.5rem 1.25rem;
        background-color: var(--c-bg-container);
        border-radius: var(--p-around);
        box-shadow: var(--shadow-sm);
        color: var(--c-text);
        transition: color var(--t-color), box-shadow var(--t-color);
      }

      &:hover {
        > span,
        > a {
          color: var(--c-text-accent);
        }

        > a {
          box-shadow: var(--shadow);
        }

        &::before {
          border-color: var(--c-text-accent);
        }
      }
    }
  }
}
</style>
