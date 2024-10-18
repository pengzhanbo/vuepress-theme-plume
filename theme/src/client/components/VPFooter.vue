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
    class="vp-footer"
    :class="{ 'has-sidebar': hasSidebar }"
    vp-footer
  >
    <slot name="footer-content">
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
    </slot>
  </footer>
</template>

<style scoped>
.vp-footer {
  position: relative;
  z-index: var(--vp-z-index-footer);
  padding: 24px;
  background-color: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-gutter);
  transition: border-top var(--vp-t-color), background-color var(--vp-t-color);
}

.footer-no-border .vp-footer {
  background-color: transparent;
  border-top: none;
}

.vp-footer p {
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.vp-footer :deep(a) {
  color: var(--vp-c-text-2);
  text-decoration-line: underline;
  text-underline-offset: 2px;
  transition:
    color var(--vp-t-color),
    text-underline-offset var(--vp-t-color);
}

.vp-footer :deep(a:hover) {
  color: var(--vp-c-text-1);
  text-underline-offset: 4px;
}

@media (min-width: 960px) {
  .vp-footer.has-sidebar {
    margin-left: var(--vp-sidebar-width);
  }

  .vp-footer.has-sidebar .container {
    margin-left: calc(0px - var(--vp-sidebar-width));
  }
}

@media (min-width: 1440px) {
  .vp-footer {
    padding: 24px;
  }

  .vp-footer.has-sidebar {
    margin-left: calc((100% - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
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
