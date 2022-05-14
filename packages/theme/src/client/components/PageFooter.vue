<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeLocaleData } from '../composables'

const themeLocale = useThemeLocaleData()

const footer = computed(() => {
  return themeLocale.value.footer
})
</script>
<template>
  <footer v-if="footer" class="theme-plume-footer">
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-if="footer.content"
      class="theme-plume-footer-content"
      v-html="footer.content"
    ></div>
    <div
      v-if="footer.copyright"
      class="theme-plume-footer-copyright"
      v-html="footer.copyright"
    ></div>
  </footer>
</template>
<style lang="scss">
.theme-plume-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 1.25rem;
  background-color: var(--c-bg-container);
  box-shadow: var(--shadow-footer);
  font-size: 0.875rem;
  text-align: center;

  .theme-plume-footer-content {
    flex: 1;
  }
  .theme-plume-footer-copyright {
    margin: auto;
    padding: 0 1.25rem;
  }
}
</style>
