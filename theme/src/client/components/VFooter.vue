<script setup lang="ts">
import { useCssVar } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { useData, useSidebar } from '../composables/index.js'
import { inBrowser } from '../utils/index.js'

const { theme } = useData()
const { hasSidebar } = useSidebar()

const footerHeight = useCssVar('--vp-footer-height', inBrowser ? document.body : null)
const footer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (theme.value.footer && footer.value)
    footerHeight.value = `${footer.value.offsetHeight}px`
})
</script>

<template>
  <footer
    v-if="theme.footer"
    ref="footer"
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
  padding: 24px;
  border-top: 1px solid var(--vp-c-gutter);
  transition: all var(--t-color);
}

.footer-no-border .plume-footer {
  border-top: none;
}

.plume-footer p {
  color: var(--vp-c-text-2);
  transition: color var(--t-color);
}

.plume-footer :deep(a) {
  color: var(--vp-c-text-2);
  text-decoration-line: underline;
  text-underline-offset: 2px;
  transition:
    color var(--t-color),
    text-underline-offset var(--t-color);
}

.plume-footer :deep(a:hover) {
  color: var(--vp-c-text-1);
  text-underline-offset: 4px;
}

@media (min-width: 1440px) {
  .plume-footer {
    padding: 24px;
  }

  .plume-footer.has-sidebar {
    margin-right: calc(0px - ((100vw - var(--vp-layout-max-width)) / 2));
  }
}

.container {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  text-align: center;
}

.message,
.copyright {
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

.message {
  order: 2;
}

.copyright {
  order: 1;
}
</style>
