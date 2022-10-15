import { reactive } from 'vue'
import { usePostAllIndex } from './postIndex.js'
import { useTagList } from './tag.js'

export interface PostStatData {
  postTotal: number
  tagTotal: number
  categoryTotal: number
}

export const usePostStat = (): PostStatData => {
  const data: PostStatData = Object.create(null)

  const postIndex = usePostAllIndex()
  const tagList = useTagList()

  data.postTotal = postIndex.value.length
  data.tagTotal = tagList.value.length

  const categorySet = new Set()

  postIndex.value.forEach((post) => {
    const category = post.category || []
    category.forEach((cate) => categorySet.add(cate.name))
  })

  data.categoryTotal = categorySet.size

  const stat = reactive<PostStatData>(data)
  return stat
}
