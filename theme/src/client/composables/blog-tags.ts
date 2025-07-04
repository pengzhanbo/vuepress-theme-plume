import type { ComputedRef, Ref } from 'vue'
import type { ThemeBlogPostItem } from '../../shared/index.js'
import { computed } from 'vue'
import { toArray } from '../utils/index.js'
import { useLocalePostList } from './blog-data.js'
import { useData } from './data.js'
import { useRouteQuery } from './route-query.js'
import { useTagColors } from './tag-colors.js'

type ShortPostItem = Pick<ThemeBlogPostItem, 'title' | 'path' | 'createTime'>

interface BlogTagItem {
  name: string
  count: string | number
  className: string
}

interface UseTagsResult {
  tags: ComputedRef<BlogTagItem[]>
  currentTag: Ref<string>
  postList: ComputedRef<ShortPostItem[]>
  handleTagClick: (tag: string) => void
}

export function useTags(): UseTagsResult {
  const { blog } = useData()
  const list = useLocalePostList()

  const colors = useTagColors()

  const tags = computed<BlogTagItem[]>(() => {
    const tagTheme = blog.value.tagsTheme ?? 'colored'

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
