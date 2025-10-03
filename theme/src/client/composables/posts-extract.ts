import type { ComputedRef } from 'vue'
import type { PostsCategory } from './posts-category.js'
import { computed } from 'vue'
import { useData } from './data.js'
import { useInternalLink } from './internal-link.js'
import { usePostsCategory } from './posts-category.js'
import { useLocalePostList } from './posts-data.js'
import { useTags } from './posts-tags.js'

interface PostsExtractLink {
  link?: string
  text?: string
  total: number
}

export function usePostsExtract(): {
  hasPostsExtract: ComputedRef<boolean>
  tags: ComputedRef<PostsExtractLink>
  archives: ComputedRef<PostsExtractLink>
  categories: ComputedRef<PostsExtractLink>
} {
  const { collection } = useData<'page', 'post'>()
  const postList = useLocalePostList()
  const { tags: tagsList } = useTags()
  const { categories: categoryList } = usePostsCategory()
  const links = useInternalLink()

  const hasPostsExtract = computed<boolean>(() =>
    collection.value?.type === 'post' && (
      collection.value.archives !== false
      || collection.value.tags !== false
      || collection.value.categories !== false
    ),
  )

  const tags = computed<PostsExtractLink>(() => ({
    link: links.tags.value?.link,
    text: links.tags.value?.text,
    total: tagsList.value.length,
  }))

  const archives = computed<PostsExtractLink>(() => ({
    link: links.archive.value?.link,
    text: links.archive.value?.text,
    total: postList.value.length,
  }))

  const categories = computed<PostsExtractLink>(() => ({
    link: links.categories.value?.link,
    text: links.categories.value?.text,
    total: getCategoriesTotal(categoryList.value),
  }))

  return {
    hasPostsExtract,
    tags,
    archives,
    categories,
  }
}

function getCategoriesTotal(categories: PostsCategory): number {
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
