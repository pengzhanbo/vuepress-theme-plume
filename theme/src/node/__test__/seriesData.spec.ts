import type { Page } from 'vuepress'
import type { ThemePageData } from '../../shared/index.js'
import type { ResolvedSeries } from '../features/series/index.js'
import { describe, expect, it } from 'vitest'
import { toSeriesData } from '../prepare/series.js'

function createResolvedSeries(id: string, locale = '/'): ResolvedSeries {
  return {
    id,
    locale,
    lang: locale === '/' ? 'en' : locale.slice(1, -1),
    title: id,
    order: 'auto',
    nav: true,
    chapters: [{
      page: {} as Page<ThemePageData>,
      path: `/blog/${id}/`,
      title: id,
      order: 1,
      draft: false,
    }],
  }
}

describe('toSeriesData', () => {
  it('should group series by locale and keep every series', () => {
    const data = toSeriesData([
      createResolvedSeries('vue'),
      createResolvedSeries('notes'),
      createResolvedSeries('vue', '/zh/'),
    ])

    expect(Object.keys(data)).toEqual(['/', '/zh/'])
    expect(Object.hasOwn(data['/']!, 'vue')).toBe(true)
    expect(Object.keys(data['/']!)).toEqual(['vue', 'notes'])
    expect(Object.keys(data['/zh/']!)).toEqual(['vue'])
  })

  it('should serialize the chapter data used by the client', () => {
    const data = toSeriesData([createResolvedSeries('vue')])

    expect(JSON.parse(JSON.stringify(data))).toEqual({
      '/': {
        vue: {
          id: 'vue',
          title: 'vue',
          nav: true,
          link: undefined,
          chapters: [{
            path: '/blog/vue/',
            title: 'vue',
            order: 1,
            createTime: undefined,
            readingTime: undefined,
            draft: undefined,
          }],
        },
      },
    })
  })
})
