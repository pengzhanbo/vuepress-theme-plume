<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vuepress/client'

const route = useRoute()
const backToTop = ref()

watch(
  () => route.path,
  () => backToTop.value.focus(),
)

function focusOnTargetAnchor({ target }: Event) {
  const el = document.getElementById(
    decodeURIComponent((target as HTMLAnchorElement).hash).slice(1),
  )

  if (el) {
    const removeTabIndex = () => {
      el.removeAttribute('tabindex')
      el.removeEventListener('blur', removeTabIndex)
    }

    el.setAttribute('tabindex', '-1')
    el.addEventListener('blur', removeTabIndex)
    el.focus()
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <span ref="backToTop" tabindex="-1" />
  <a
    href="#VPContent"
    class="vp-skip-link visually-hidden"
    @click="focusOnTargetAnchor"
  >
    Skip to content
  </a>
</template>

<style scoped>
.vp-skip-link {
  top: 8px;
  left: 8px;
  z-index: 999;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: bold;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-3);
}

.vp-skip-link:focus {
  width: auto;
  height: auto;
  clip-path: none;
}

@media (min-width: 1280px) {
  .vp-skip-link {
    top: 14px;
    left: 16px;
  }
}
</style>
