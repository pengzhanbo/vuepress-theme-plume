import type { ComputedRef } from 'vue'
import type { BlogCategory } from './blog-category.js'
import { computed } from 'vue'
import { useBlogCategory } from './blog-category.js'
import { useLocalePostList } from './blog-data.js'
import { useTags } from './blog-tags.js'
import { useData } from './data.js'
import { useInternalLink } from './internal-link.js'

interface BlogExtractLink {
  link?: string
  text?: string
  total: number
}

export function useBlogExtract(): {
  hasBlogExtract: ComputedRef<boolean>
  tags: ComputedRef<BlogExtractLink>
  archives: ComputedRef<BlogExtractLink>
  categories: ComputedRef<BlogExtractLink>
} {
  const { blog } = useData()
  const postList = useLocalePostList()
  const { tags: tagsList } = useTags()
  const { categories: categoryList } = useBlogCategory()
  const links = useInternalLink()

  const hasBlogExtract = computed<boolean>(() =>
    blog.value.archives !== false
    || blog.value.tags !== false
    || blog.value.categories !== false,
  )

  const tags = computed<BlogExtractLink>(() => ({
    link: links.tags.value?.link,
    text: links.tags.value?.text,
    total: tagsList.value.length,
  }))

  const archives = computed<BlogExtractLink>(() => ({
    link: links.archive.value?.link,
    text: links.archive.value?.text,
    total: postList.value.length,
  }))

  const categories = computed<BlogExtractLink>(() => ({
    link: links.categories.value?.link,
    text: links.categories.value?.text,
    total: getCategoriesTotal(categoryList.value),
  }))

  return {
    hasBlogExtract,
    tags,
    archives,
    categories,
  }
}

function getCategoriesTotal(categories: BlogCategory): number {
  let total = 0
  for (const category of categories) {
    if (category.type === 'category') {
      total += 1
      if (category.items.length) {
        total += getCategoriesTotal(category.items)
      }
    }
  }
  return total
}
