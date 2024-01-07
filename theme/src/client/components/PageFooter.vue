<script lang="ts" setup>
import { computed } from 'vue'
import {
  useContributors,
  useEditNavLink,
  useLastUpdated,
  usePageNav,
  useThemeLocaleData,
} from '../composables/index.js'
import AutoLink from './AutoLink.vue'
import IconEdit from './icons/IconEdit.vue'

const themeLocale = useThemeLocaleData()
const editNavLink = useEditNavLink()
const lastUpdated = useLastUpdated()
const contributors = useContributors()
const { prev, next } = usePageNav()

const showFooter = computed(() => {
  return editNavLink.value || lastUpdated.value || contributors.value || prev.value || next.value
})
</script>

<template>
  <footer v-if="showFooter" class="page-footer">
    <div v-if="editNavLink || lastUpdated" class="edit-info">
      <div v-if="editNavLink" class="edit-link">
        <AutoLink
          class="edit-link-button"
          :href="editNavLink.link"
          :no-icon="true"
        >
          <IconEdit class="edit-link-icon" aria-label="edit icon" />
          {{ editNavLink.text }}
        </AutoLink>
      </div>

      <div v-if="lastUpdated" class="last-updated">
        <p class="last-updated-text">
          {{ themeLocale.lastUpdatedText || 'Last updated' }}:
          <time :datetime="lastUpdated" class="last-updated-time">
            {{ lastUpdated }}
          </time>
        </p>
      </div>
    </div>

    <div v-if="contributors && contributors.length" class="contributors">
      <span class="contributors-label">
        {{ themeLocale.contributorsText || 'Contributors' }}:
      </span>
      <span class="contributors-info">
        <template v-for="(contributor, index) in contributors" :key="contributor">
          <span class="contributor" :title="`email: ${contributor.email}`">
            {{ contributor.name }}
          </span>
          <template v-if="index !== contributors.length - 1">, </template>
        </template>
      </span>
    </div>

    <nav v-if="prev?.link || next?.link" class="prev-next">
      <div class="pager">
        <AutoLink
          v-if="prev?.link"
          class="pager-link prev"
          :href="prev.link"
        >
          <span class="desc" v-html="themeLocale.prevPageLabel || 'Previous page'" />
          <span class="title" v-html="prev.text" />
        </AutoLink>
      </div>
      <div class="pager">
        <AutoLink
          v-if="next?.link"
          class="pager-link next"
          :href="next.link"
        >
          <span class="desc" v-html="themeLocale.nextPageLabel || 'Next page'" />
          <span class="title" v-html="next.text" />
        </AutoLink>
      </div>
    </nav>
  </footer>
</template>

<style scoped>
.page-footer {
  margin-top: 96px;
}

@media (min-width: 640px) {
  .edit-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 6px;
  }
}

.edit-link-button {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  color: var(--vp-c-brand-1);
  border: 0;
  transition: color 0.25s;
}

.edit-link-button:hover {
  color: var(--vp-c-brand-2);
}

@media print {
  .edit-link-button {
    display: none;
  }
}

.edit-link-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  fill: currentcolor;
}

.last-updated-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

@media (min-width: 640px) {
  .last-updated-text {
    font-size: 14px;
    font-weight: 500;
    line-height: 32px;
  }
}

.contributors {
  padding-bottom: 6px;
  margin-top: -10px;
  font-size: 14px;
  line-height: 32px;
  text-align: left;
}

@media (min-width: 640px) {
  .contributors {
    text-align: right;
  }
}

.contributors-label {
  padding-right: 10px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.contributors-info {
  color: var(--vp-c-text-2);

  .contributor {
    color: var(--vp-c-text-3);
  }
}

.prev-next {
  display: grid;
  grid-row-gap: 8px;
  padding-top: 24px;
  margin-top: 10px;
  border-top: 1px solid var(--vp-c-divider);
}

@media (min-width: 640px) {
  .prev-next {
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 16px;
  }
}

.pager-link {
  display: block;
  width: 100%;
  height: 100%;
  padding: 11px 16px 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: border-color 0.25s;
}

.pager-link:hover {
  border-color: var(--vp-c-brand-1);
}

.pager-link.next {
  margin-left: auto;
  text-align: right;
}

.desc {
  display: block;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

.title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}
</style>
