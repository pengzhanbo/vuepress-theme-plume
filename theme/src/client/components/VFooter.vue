<script setup lang="ts">
import { useSidebar, useThemeLocaleData } from '../composables/index.js'

const theme = useThemeLocaleData()
const { hasSidebar } = useSidebar()
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <footer
    v-if="theme.footer"
    class="plume-footer"
    :class="{ 'has-sidebar': hasSidebar }"
  >
    <div class="container">
      <p
        v-if="theme.footer.message"
        class="message"
        v-html="theme.footer.message"
      />
      <p
        v-if="theme.footer.copyright"
        class="copyright"
        v-html="theme.footer.copyright"
      />
    </div>
  </footer>
</template>

<style scoped>
.plume-footer {
  position: relative;
  z-index: var(--vp-z-index-footer);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
  transition: all 0.25s;
}

.plume-footer.has-sidebar {
  display: none;
}

.plume-footer :deep(a) {
  text-decoration-line: underline;
  text-underline-offset: 2px;
  transition:
    color,
    text-underline-offset 0.25s;
}

.plume-footer :deep(a:hover) {
  color: var(--vp-c-text-1);
  text-underline-offset: 4px;
}

@media (min-width: 768px) {
  .plume-footer {
    padding: 32px;
  }
}

.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
}

.message,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.message {
  order: 2;
}

.copyright {
  order: 1;
}
</style>
