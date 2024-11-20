<script setup lang="ts">
import type { CopyrightFrontmatter } from '../../shared/index.js'
import VPLink from '@theme/VPLink.vue'
import { computed } from 'vue'
import { useCopyright, useData } from '../composables/index.js'

const props = defineProps<CopyrightFrontmatter>()

const { theme } = useData()
const {
  author,
  creation,
  creationText,
  license,
  sourceUrl,
} = useCopyright(computed(() => props))
</script>

<template>
  <div class="hint-container tip copyright-container">
    <p v-if="author">
      <span>{{ theme.copyrightAuthorText || 'Copyright Ownership:' }}</span>
      <VPLink :href="author.url" no-icon>
        {{ author.name }}
      </VPLink>
    </p>
    <p v-if="sourceUrl">
      <span>{{ creationText }}</span>
      <VPLink :href="sourceUrl" :no-icon="creation === 'original'" data-allow-mismatch>
        {{ sourceUrl }}
      </VPLink>
    </p>
    <p v-if="license">
      <span>{{ theme.copyrightLicenseText || 'License under' }}</span>
      <VPLink :href="license.url" no-icon>
        {{ license.name }}
      </VPLink>
      <template v-if="license.icons">
        <span v-for="icon in license.icons" :key="icon" :class="`vpi-license-${icon}`" />
      </template>
    </p>
  </div>
</template>

<style scoped>
.vp-doc .copyright-container p {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
  margin: 8px 0;
  line-height: 20px;
}

.vp-doc .copyright-container p span:first-of-type {
  font-weight: bold;
}

.vp-doc .copyright-container [class*="vpi-"] {
  width: 1.2em;
  height: 1.2em;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}
</style>

<style>
.vpi-license-cc {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M9 8c1.104 0 2.105.448 2.829 1.173l-1.414 1.413a2 2 0 1 0 0 2.828l1.413 1.414A4.001 4.001 0 0 1 5 12c0-2.208 1.792-4 4-4m9.829 1.173A4.001 4.001 0 0 0 12 12a4.001 4.001 0 0 0 6.828 2.828l-1.414-1.414a2 2 0 1 1 0-2.828zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16'/%3E%3C/svg%3E");
}

.vpi-license-by {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M14 7a2 2 0 1 1-4 0a2 2 0 0 1 4 0m1 4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4h1.5v4h3v-4H15zm-3-9C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 1 16 0a8 8 0 0 1-16 0'/%3E%3C/svg%3E");
}

.vpi-license-nc {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M7.094 5.68A8 8 0 0 1 18.32 16.905l-2.154-2.154A2.5 2.5 0 0 0 14 11h-4a.5.5 0 0 1 0-1.001h5.5V8H13V6h-2v2h-1q-.273.001-.53.056zM5.68 7.094L7.835 9.25A2.5 2.5 0 0 0 10 13h4a.5.5 0 0 1 0 1.001H8.5v2H11v2h2v-2h1q.273-.001.53-.056l2.376 2.376A8 8 0 0 1 5.68 7.095'/%3E%3C/svg%3E");
}

.vpi-license-nd {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M8 9h8v2H8zm0 6v-2h8v2zm-6-3C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16'/%3E%3C/svg%3E");
}

.vpi-license-sa {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M17 12c0-3.314-2.238-6-5-6c-2.177 0-4.03 1.67-4.716 4H6l2.5 3l2.5-3H9.401C9.92 8.805 10.89 8 12 8c1.657 0 3 1.79 3 4s-1.343 4-3 4c-1.11 0-2.08-.804-2.598-1.999H7.285C7.97 16.33 9.823 18 12 18c2.762 0 5-2.686 5-6M12 2a9.97 9.97 0 0 0-7.07 2.93A9.97 9.97 0 0 0 2 12a9.97 9.97 0 0 0 2.93 7.07A9.97 9.97 0 0 0 12 22a9.97 9.97 0 0 0 7.07-2.93A9.97 9.97 0 0 0 22 12a9.97 9.97 0 0 0-2.93-7.07A9.97 9.97 0 0 0 12 2M6.344 6.344A7.97 7.97 0 0 1 12 4c2.208 0 4.206.895 5.656 2.344A7.97 7.97 0 0 1 20 12a7.97 7.97 0 0 1-2.344 5.656A7.97 7.97 0 0 1 12 20a7.97 7.97 0 0 1-5.656-2.344A7.97 7.97 0 0 1 4 12c0-2.208.895-4.206 2.344-5.656'/%3E%3C/svg%3E");
}

.vpi-license-zero {
  --icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M17 12c0-3.314-2.238-6-5-6s-5 2.686-5 6s2.239 6 5 6s5-2.686 5-6m-6.237 3.645l3.562-6.173c.422.69.675 1.57.675 2.528c0 2.21-1.343 4-3 4c-.441 0-.86-.127-1.237-.355M9 12c0-2.21 1.343-4 3-4c.441 0 .86.127 1.237.355l-3.562 6.173C9.253 13.838 9 12.958 9 12m3-10a9.97 9.97 0 0 0-7.07 2.93A9.97 9.97 0 0 0 2 12a9.97 9.97 0 0 0 2.93 7.07A9.97 9.97 0 0 0 12 22a9.97 9.97 0 0 0 7.07-2.93A9.97 9.97 0 0 0 22 12a9.97 9.97 0 0 0-2.93-7.07A9.97 9.97 0 0 0 12 2M6.344 6.344A7.97 7.97 0 0 1 12 4c2.208 0 4.206.895 5.656 2.344A7.97 7.97 0 0 1 20 12a7.97 7.97 0 0 1-2.344 5.656A7.97 7.97 0 0 1 12 20a7.97 7.97 0 0 1-5.656-2.344A7.97 7.97 0 0 1 4 12c0-2.208.895-4.206 2.344-5.656'/%3E%3C/svg%3E");
}
</style>
