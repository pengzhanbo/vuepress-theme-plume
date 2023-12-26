<script lang="ts" setup>
import { useArchives, useBlogExtract } from '../composables/index.js'
import IconArchive from './icons/IconArchive.vue'
import ShortPostList from './ShortPostList.vue';

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
          <h3 class="archive-title">{{ archive.label }}</h3>
          <ShortPostList :post-list="archive.list" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.archives-wrapper {
  padding: 32px 24px;
  flex: 1;
}

.archives-title {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 40px;
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
  font-size: 18px;
  font-weight: 700;
  margin-top: 2rem;
}
</style>
