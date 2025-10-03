<script lang="ts" setup>
import VPShortPostList from '@theme/Posts/VPShortPostList.vue'
import { useArchives, useInternalLink } from '../../composables/index.js'

const { archive: archiveLink } = useInternalLink()
const { archives } = useArchives()
</script>

<template>
  <div class="vp-archives">
    <slot name="posts-archives-before" />

    <h2 class="archives-title">
      <span class="vpi-archive icon" />
      <span>{{ archiveLink?.text ?? 'Archives' }}</span>
    </h2>
    <div v-if="archives.length" class="archives">
      <template v-for="archive in archives" :key="archive.label">
        <div class="archive">
          <h3 class="archive-title">
            {{ archive.title }}
            <span class="total">{{ archive.label }}</span>
          </h3>
          <VPShortPostList :post-list="archive.list" />
        </div>
      </template>
    </div>

    <slot name="posts-archives-after" />
  </div>
</template>

<style scoped>
.vp-archives {
  flex: 1 2;
}

.archives-title {
  display: flex;
  align-items: center;
  padding: 16px;
  margin: 0 -16px 40px;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color);
}

.archives-title .icon {
  margin-right: 8px;
}

.archive {
  padding: 16px;
  margin: 0 -16px 24px;
  background-color: var(--vp-c-bg);
  transition: background-color var(--vp-t-color);
}

.archive-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-right: 16px;
  padding-bottom: 12px;
  padding-left: 16px;
  margin: 0 -16px;
  font-size: 18px;
  font-weight: 700;
  border-bottom: solid 1px var(--vp-c-divider);
  transition: border-bottom var(--vp-t-color);
}

.archive-title .total {
  font-size: 16px;
  font-weight: normal;
  line-height: 16px;
}

@media (min-width: 768px) {
  .archives-title {
    display: none;
  }

  .archive {
    padding: 20px 24px;
    margin: 0 0 24px;
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--vp-t-color);
    transition-property: box-shadow, background-color;
  }

  .archive:hover {
    box-shadow: var(--vp-shadow-2);
  }

  .archive-title {
    padding-right: 24px;
    padding-left: 24px;
    margin: 0 -24px;
    border-bottom: solid 1px var(--vp-c-divider);
    transition: border-bottom var(--vp-t-color);
  }
}

@media (min-width: 1200px) {
  .vp-archives {
    margin-left: 0;
  }
}
</style>
