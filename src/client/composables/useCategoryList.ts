import { ref } from 'vue'
import type { Ref } from 'vue'
import type { PostItemIndex } from '../../shared'
import { usePostIndex } from './usePostIndex'

export interface CategoryItem {
  label: string
  type: string | number
  children: CategoryList
  postList: PostItemIndex[]
}

export type CategoryList = CategoryItem[]

export type CategoryListRef = Ref<CategoryList>

const categoriesRaw: CategoryList = []

usePostIndex().value.forEach((post) => {
  const category = post.category
  let index = 1
  let cate = category[0]
  let first = categoriesRaw.find((c) => c.type === cate.type)
  if (!first) {
    first = {
      label: cate.name,
      type: cate.type,
      children: [],
      postList: [],
    }
    categoriesRaw.push(first)
  }
  if (category.length === 1) {
    first.postList.push(post)
  }
  let children = first.children
  while ((cate = category[index])) {
    let current = children.find((c) => c.type === cate.type)
    if (!current) {
      current = {
        label: cate.name,
        type: cate.type,
        children: [],
        postList: [],
      }
    }
    children.push(current)
    children = current.children
    if (index === category.length - 1) {
      current.postList.push(post)
    }
    index++
  }
})

export const categoryList: CategoryListRef = ref(
  categoriesRaw.sort((left, right) => {
    return left.type > right.type ? 1 : -1
  })
)
export const useCategoryList = (): CategoryListRef => categoryList
