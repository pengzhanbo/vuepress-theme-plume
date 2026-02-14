import type { ComputedRef, Ref } from 'vue'
import type { ThemePostsItem } from '../../shared/index.js'
import { computed } from 'vue'
import { toArray } from '../utils/index.js'
import { useData } from './data.js'
import { useLocalePostList } from './posts-data.js'
import { useRouteQuery } from './route-query.js'
import { useTagColors } from './tag-colors.js'

type ShortPostItem = Pick<ThemePostsItem, 'title' | 'path' | 'createTime'>

/**
 * Posts tag item
 *
 * 标签项，包含名称、数量和样式类名
 */
interface PostsTagItem {
  name: string
  count: string | number
  className: string
}

/**
 * Use tags result
 *
 * 标签结果类型
 */
interface UseTagsResult {
  tags: ComputedRef<PostsTagItem[]>
  currentTag: Ref<string>
  postList: ComputedRef<ShortPostItem[]>
  handleTagClick: (tag: string) => void
}

/**
 * Use tags
 *
 * 获取标签列表和当前选中的标签，处理标签相关逻辑
 */
export function useTags(): UseTagsResult {
  const { collection } = useData<'page', 'post'>()
  const list = useLocalePostList()

  const colors = useTagColors()

  const postCollection = computed(() => {
    if (collection.value?.type === 'post')
      return collection.value
    return undefined
  })

  const tags = computed<PostsTagItem[]>(() => {
    const tagTheme = postCollection.value?.tagsTheme ?? 'colored'

    const tagMap: Record<string, number> = {}
    list.value.forEach((item) => {
      if (item.tags) {
        toArray(item.tags).forEach((tag) => {
          if (tagMap[tag])
            tagMap[tag] += 1
          else
            tagMap[tag] = 1
        })
      }
    })
    return Object.keys(tagMap).map(tag => ({
      name: tag,
      count: tagMap[tag] > 99 ? '99+' : tagMap[tag],
      className: colors.value[tag] ? `vp-tag-${colors.value[tag]}` : `tag-${tagTheme}`,
    }))
  })

  const currentTag = useRouteQuery<string>('tag')

  const postList = computed<ShortPostItem[]>(() => {
    if (!currentTag.value)
      return []

    return list.value.filter((item) => {
      if (item.tags)
        return toArray(item.tags).includes(currentTag.value)

      return false
    }).map(item => ({
      title: item.title,
      path: item.path,
      createTime: item.createTime.split(' ')[0].replace(/\//g, '-'),
    }))
  })

  const handleTagClick = (tag: string): void => {
    currentTag.value = tag
  }

  return {
    tags,
    currentTag,
    postList,
    handleTagClick,
  }
}
