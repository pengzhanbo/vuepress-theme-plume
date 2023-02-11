<script lang="ts" setup>
import { useSidebar } from '../composables/index.js'
import PageAside from './PageAside.vue'

const { hasSidebar, hasAside } = useSidebar()
</script>
<template>
  <div
    class="plume-page"
    :class="{ 'has-sidebar': hasSidebar, 'has-aside': hasAside }"
  >
    <div class="container">
      <div v-if="hasAside" class="aside">
        <div class="aside-curtain" />
        <div class="aside-container">
          <div class="aside-content">
            <PageAside />
          </div>
        </div>
      </div>
      <div class="content">
        <div class="content-container">
          <main class="main">
            <Content class="plume-content" />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plume-page {
  position: relative;
  display: flex;
}
.plume-page {
  padding: 32px 24px 96px;
  width: 100%;
}

@media (min-width: 768px) {
  .plume-page {
    padding: 48px 32px 128px;
  }
}

@media (min-width: 960px) {
  .plume-page {
    padding: 32px 32px 0;
  }

  .plume-page:not(.has-sidebar) .container {
    display: flex;
    justify-content: center;
    max-width: 992px;
  }

  .plume-page:not(.has-sidebar) .content {
    max-width: 752px;
  }
}

@media (min-width: 1280px) {
  .plume-page .container {
    display: flex;
    justify-content: center;
  }

  .plume-page .aside {
    display: block;
  }
}

@media (min-width: 1440px) {
  .plume-page:not(.has-sidebar) .content {
    max-width: 784px;
  }

  .plume-page:not(.has-sidebar) .container {
    max-width: 1204px;
  }
}

.container {
  margin: 0 auto;
  width: 100%;
}

.aside {
  position: relative;
  display: none;
  order: 2;
  flex-grow: 1;
  padding-left: 32px;
  width: 100%;
  max-width: 256px;
}

.aside-container {
  position: sticky;
  top: 0;
  margin-top: calc(
    (var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1 - 32px
  );
  padding-top: calc(
    var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 32px
  );
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.aside-container::-webkit-scrollbar {
  display: none;
}

.aside-curtain {
  position: fixed;
  bottom: 0;
  z-index: 10;
  width: 224px;
  height: 32px;
  background: linear-gradient(transparent, var(--vp-c-bg) 70%);
}

.aside-content {
  display: flex;
  flex-direction: column;
  min-height: calc(
    100vh - (var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 32px)
  );
  padding-bottom: 32px;
}

.content {
  position: relative;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 960px) {
  .content {
    padding: 0 32px 128px;
  }
}

@media (min-width: 1280px) {
  .content {
    order: 1;
    margin: 0;
    min-width: 640px;
  }
}

.content-container {
  margin: 0 auto;
}

.plume-page.has-aside .content-container {
  max-width: 688px;
}
</style>
