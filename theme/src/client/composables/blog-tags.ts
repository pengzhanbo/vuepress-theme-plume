import { computed } from 'vue'
import type { PlumeThemeBlogPostItem } from '../../shared/index.js'
import { toArray } from '../utils/index.js'
import { useTagColors } from './tag-colors.js'
import { useLocalePostList } from './blog-post-list.js'
import { useRouteQuery } from './route-query.js'

type ShortPostItem = Pick<PlumeThemeBlogPostItem, 'title' | 'path' | 'createTime'>

export function useTags() {
  const list = useLocalePostList()

  const colors = useTagColors()

  const tags = computed(() => {
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
      className: `vp-tag-${colors.value[tag]}`,
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

  const handleTagClick = (tag: string) => {
    currentTag.value = tag
  }

  return {
    tags,
    currentTag,
    postList,
    handleTagClick,
  }
}
