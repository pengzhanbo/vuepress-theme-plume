<script setup lang="ts">
import type { CopyrightFrontmatter, CopyrightOptions } from '../../shared/index.js'
import VPCopyright from '@theme/VPCopyright.vue'
import VPDocHeader from '@theme/VPDocHeader.vue'
import { computed } from 'vue'
import { isPlainObject } from 'vuepress/shared'
import { useData } from '../composables/index.js'

const { theme, frontmatter } = useData<'post'>()

const copyright = computed<CopyrightFrontmatter | null>(() => {
  if ((frontmatter.value.copyright ?? theme.value.copyright ?? false) === false) {
    return null
  }
  const docCopyright = (isPlainObject(frontmatter.value.copyright)
    ? frontmatter.value.copyright
    : { license: frontmatter.value.copyright === true ? '' : frontmatter.value.copyright }) as CopyrightFrontmatter
  if (!theme.value.copyright)
    return docCopyright

  const themeCopyright = (isPlainObject(theme.value.copyright)
    ? theme.value.copyright
    : { license: theme.value.copyright === true ? undefined : theme.value.copyright }) as CopyrightOptions

  docCopyright.license ??= themeCopyright.license

  return docCopyright
})
</script>

<template>
  <div v-if="copyright" class="vp-doc-copyright">
    <VPDocHeader anchor="doc-copyright">
      {{ theme.copyrightText || 'Copyright' }}
    </VPDocHeader>

    <VPCopyright v-bind="copyright" />
  </div>
</template>
