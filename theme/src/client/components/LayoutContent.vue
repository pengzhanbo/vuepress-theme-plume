<script lang="ts" setup>
import { useSidebar } from '../composables/index.js'

const props = defineProps<{
  isNotFound?: boolean
}>()

const { hasSidebar } = useSidebar()
</script>

<template>
  <div
    id="LayoutContent"
    class="layout-content"
    :class="{ 'has-sidebar': hasSidebar && !props.isNotFound }"
  >
    <slot />
  </div>
</template>

<style scoped>
.layout-content {
  flex-grow: 1;
  flex-shrink: 0;
  margin: var(--vp-layout-top-height, 0px) auto 0;
  width: 100%;
}

.layout-content.is-home {
  width: 100%;
  max-width: 100%;
}

.layout-content.has-sidebar {
  margin: 0;
}

@media (min-width: 960px) {
  .layout-content {
    padding-top: var(--vp-nav-height);
  }

  .layout-content.has-sidebar {
    margin: var(--vp-layout-top-height, 0px) 0 0;
    padding-left: var(--vp-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .layout-content.has-sidebar {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2);
    padding-left: calc(
      (100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width)
    );
  }
}
</style>
