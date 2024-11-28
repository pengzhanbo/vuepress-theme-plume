import { computed } from 'vue'
import { type BlogCategory, useBlogCategory } from './blog-category.js'
import { useLocalePostList } from './blog-data.js'
import { useTags } from './blog-tags.js'
import { useData } from './data.js'
import { useInternalLink } from './internal-link.js'

export function useBlogExtract() {
  const { blog } = useData()
  const postList = useLocalePostList()
  const { tags: tagsList } = useTags()
  const { categories: categoryList } = useBlogCategory()
  const links = useInternalLink()

  const hasBlogExtract = computed(() =>
    blog.value.archives !== false
    || blog.value.tags !== false
    || blog.value.categories !== false,
  )

  const tags = computed(() => ({
    link: links.tags.value?.link,
    text: links.tags.value?.text,
    total: tagsList.value.length,
  }))

  const archives = computed(() => ({
    link: links.archive.value?.link,
    text: links.archive.value?.text,
    total: postList.value.length,
  }))

  const categories = computed(() => ({
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
