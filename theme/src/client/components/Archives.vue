<script lang="ts" setup>
import { useArchives, useBlogExtract } from '../composables/index.js'
import IconArchive from './icons/IconArchive.vue'
import ShortPostList from './ShortPostList.vue'

const { archives: archivesLink } = useBlogExtract()
const { archives } = useArchives()
</script>

<template>
  <div class="archives-wrapper">
    <h2 class="archives-title">
      <IconArchive class="icon" />
      <span>{{ archivesLink.text }}</span>
    </h2>
    <div v-if="archives.length" class="archives">
      <template v-for="archive in archives" :key="archive.label">
        <div class="archive">
          <h3 class="archive-title">
            {{ archive.label }}
          </h3>
          <ShortPostList :post-list="archive.list" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.archives-wrapper {
  flex: 1;
  max-width: 768px;
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
  width: 1em;
  height: 1em;
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
  .archives-wrapper {
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
    box-shadow: var(--vp-shadow-2);
  }

  .archive-title {
    padding-bottom: 10px;
    margin-top: 0;
    border-bottom: solid 1px var(--vp-c-divider);
  }
}

@media (min-width: 960px) {
  .archives-wrapper {
    margin-left: auto;
  }
}
</style>
