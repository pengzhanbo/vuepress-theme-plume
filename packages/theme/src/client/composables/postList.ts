import type { Ref } from 'vue'
import { ref } from 'vue'
import type { PostItem } from '../../shared/index.js'
import { usePostIndex } from './postIndex.js'

export type PostListData = PostItem[]
export type PostListRef = Ref<PostListData>

interface UsePostList {
  postList: PostListRef
  total: Ref<number>
  page: Ref<number>
  setPostListPage: (page: number) => void
  resetPostIndex: (postIndex: PostListData) => void
}

export const usePostList = (): UsePostList => {
  const postIndex = ref(usePostIndex().value)
  const pageNum = 10
  const total = ref(postIndex.value.length)
  let totalPage = Math.ceil(postIndex.value.length / pageNum)
  const postList = ref<PostListData>([])
  const page = ref(1)

  const setPostListPage = (_page = 1): void => {
    _page = _page - 1
    if (_page < 0) _page = 0
    if (_page > totalPage) _page = totalPage - 1
    const start = _page * pageNum
    const end = start + pageNum
    postList.value = postIndex.value.filter((_: PostItem, index: number) => {
      return start <= index && index < end
    })
    page.value = _page + 1
  }
  const resetPostIndex = (_postIndex: PostListData): void => {
    postIndex.value = _postIndex
    totalPage = Math.ceil(postIndex.value.length / pageNum)
    total.value = postIndex.value.length
    setPostListPage(1)
  }
  setPostListPage(1)

  return { postList, setPostListPage, page, total, resetPostIndex }
}
