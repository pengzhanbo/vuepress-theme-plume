import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useLocalePostList } from './blog-data.js'

export interface CategoryItemWithPost {
  type: 'post'
  title: string
  path: string
}

export interface CategoryItem {
  id: string
  type: 'category'
  sort: number
  title: string
  items: (CategoryItem | CategoryItemWithPost)[]
}

export type BlogCategory = (CategoryItem | CategoryItemWithPost)[]

export function useBlogCategory(): { categories: ComputedRef<BlogCategory> } {
  const postList = useLocalePostList()

  const categories = computed<BlogCategory>(() => {
    const list: BlogCategory = []

    postList.value.forEach((item) => {
      const categoryList = item.categoryList
      if (!categoryList || categoryList.length === 0) {
        list.push({ type: 'post', title: item.title, path: item.path })
      }
      else {
        let cate = list
        let i = 0
        while (i < categoryList.length) {
          const { id, name, sort } = categoryList[i]
          const current = cate.find(item => item.type === 'category' && item.id === id)
          if (!current) {
            const items = [] as CategoryItem[]
            cate.push({ type: 'category', title: name, id, sort, items })
            cate = items
          }
          else {
            cate = (current as CategoryItem).items
          }
          i++
        }
        cate.push({ type: 'post', title: item.title, path: item.path })
      }
    })

    return sortCategory(list)
  })

  return { categories }
}

function sortCategory(items: BlogCategory): BlogCategory {
  for (const item of items) {
    if (item.type === 'category' && item.items.length) {
      item.items = sortCategory(item.items)
    }
  }
  return items.sort((a, b) => {
    if (a.type === 'category' && b.type === 'category') {
      return a.sort < b.sort ? -1 : 1
    }
    if (a.type === 'category' && b.type === 'post') {
      return -1
    }
    if (a.type === 'post' && b.type === 'category') {
      return 1
    }
    return 0
  })
}
