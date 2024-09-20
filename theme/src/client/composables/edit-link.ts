import type { ComputedRef } from 'vue'
import type {
  NavItemWithLink,
} from '../../shared/index.js'
import { computed } from 'vue'
import { useData } from '../composables/data.js'
import { resolveEditLink } from '../utils/index.js'

export function useEditLink(): ComputedRef<null | NavItemWithLink> {
  const { theme, page, frontmatter } = useData()

  return computed(() => {
    const showEditLink
      = frontmatter.value.editLink ?? theme.value.editLink ?? true
    if (!showEditLink)
      return null

    const {
      docsRepo,
      docsBranch = 'main',
      docsDir = '',
      editLinkText,
    } = theme.value

    if (!docsRepo)
      return null

    const editLink = resolveEditLink({
      docsRepo,
      docsBranch,
      docsDir,
      filePathRelative: page.value.filePathRelative,
      editLinkPattern:
        frontmatter.value.editLinkPattern ?? theme.value.editLinkPattern,
    })

    if (!editLink)
      return null

    return {
      text: editLinkText ?? 'Edit this page',
      link: editLink,
    }
  })
}
