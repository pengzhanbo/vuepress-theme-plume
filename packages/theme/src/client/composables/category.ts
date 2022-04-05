import { ref } from 'vue'
import type { Ref } from 'vue'
import type { PostItem } from '../../shared'
import { usePostIndex } from './postIndex'

export interface CategoryItem {
  label: string
  type: string | number
  children: CategoryList
  postList: PostItem[]
}

export type CategoryList = CategoryItem[]

export type CategoryListRef = Ref<CategoryList>

export const useCategoryList = (): CategoryListRef => {
  let categoryListRaw: CategoryList = []
  usePostIndex().value.forEach((post) => {
    if (post.category.length === 0) return
    const category = post.category.map((cate, index) => {
      if (index > 0) {
        return {
          type: post.category
            .slice(0, index + 1)
            .map((c) => c.type)
            .join('-'),
          name: cate.name,
        }
      } else {
        return cate
      }
    })
    let index = 1
    let cate = category[0]
    let first = categoryListRaw.find((c) => c.type === cate.type)
    if (!first) {
      first = {
        label: cate.name,
        type: cate.type,
        children: [],
        postList: [],
      }
      categoryListRaw.push(first)
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
        children.push(current)
      }
      children = current.children
      if (index === category.length - 1) {
        current.postList.push(post)
      }
      index++
    }
  })
  categoryListRaw = categorySort(categoryListRaw)
  sortChildren(categoryListRaw, 1)
  function sortChildren(list: CategoryList, deep: number): void {
    list.forEach((category) => {
      if (category.children.length > 0) {
        category.children = categorySort(category.children, deep)
        sortChildren(category.children, deep + 1)
      }
    })
  }

  return ref(categoryListRaw)
}

function categorySort(children: CategoryList, deep = 0): CategoryList {
  return children.sort((left, right) => {
    const leftType = Number((left.type + '').split('-')[deep])
    const rightType = Number((right.type + '').split('-')[deep])
    return leftType > rightType ? 1 : -1
  })
}
