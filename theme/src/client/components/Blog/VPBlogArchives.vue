<script lang="ts" setup>
import VPShortPostList from '@theme/Blog/VPShortPostList.vue'
import { useArchives, useInternalLink } from '../../composables/index.js'

const { archive: archiveLink } = useInternalLink()
const { archives } = useArchives()
</script>

<template>
  <div class="vp-blog-archives">
    <slot name="blog-archives-before" />

    <h2 class="archives-title">
      <span class="vpi-archive icon" />
      <span>{{ archiveLink?.text ?? 'Archives' }}</span>
    </h2>
    <div v-if="archives.length" class="archives">
      <template v-for="archive in archives" :key="archive.label">
        <div class="archive">
          <h3 class="archive-title">
            {{ archive.label }}
          </h3>
          <VPShortPostList :post-list="archive.list" />
        </div>
      </template>
    </div>

    <slot name="blog-archives-after" />
  </div>
</template>

<style scoped>
.vp-blog-archives {
  flex: 1;
  padding: 32px 24px;
  margin: 0 auto;
}

.archives-title {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.archives-title .icon {
  margin-right: 8px;
}

.archive {
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.archive:last-of-type {
  border-bottom: none;
}

.archive-title {
  margin-top: 2rem;
  font-size: 18px;
  font-weight: 700;
}

@media (min-width: 768px) {
  .vp-blog-archives {
    padding: 32px 0;
    margin-left: 20px;
  }

  .archives-title {
    display: none;
  }

  .archive {
    padding: 20px;
    margin-bottom: 24px;
    background-color: var(--vp-c-bg);
    border-bottom: none;
    border-radius: 8px;
    box-shadow: var(--vp-shadow-1);
    transition: var(--t-color);
    transition-property: border-bottom, box-shadow, background-color;
  }

  .archive:hover {
    box-shadow: var(--vp-shadow-2);
  }

  .archive-title {
    padding-bottom: 10px;
    margin-top: 0;
    border-bottom: solid 1px var(--vp-c-divider);
    transition: border-bottom var(--t-color);
  }
}

@media (min-width: 1200px) {
  .vp-blog-archives {
    margin-left: 0;
  }
}
</style>
