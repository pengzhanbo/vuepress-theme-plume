<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useThemeLocaleData } from '../composables'

const themeLocale = useThemeLocaleData()
const router = useRouter()

const footer = computed(() => {
  return themeLocale.value.footer
})
const style = ref({})
function setStyle(): void {
  setTimeout(() => {
    if (
      document.documentElement.scrollHeight <=
      document.documentElement.clientHeight
    ) {
      style.value = {
        position: 'fixed',
        bottom: 0,
        left: 0,
      }
    } else {
      style.value = {}
    }
  }, 30)
}
router.beforeEach(() => {
  setStyle()
})
onMounted(() => setStyle())
onBeforeRouteUpdate(() => setStyle())
</script>
<template>
  <footer v-if="footer" class="theme-plume-footer" :style="style">
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
  width: 100%;
  padding: 1.25rem;
  margin-top: 4rem;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: var(--c-bg-container);
  box-shadow: var(--shadow-footer);
  font-size: 14px;
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
