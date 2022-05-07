// 8a4e65dd3f2d30e64c828481295e09d1
import type { BaiduTongjiOptions } from '@vuepress-plume/vuepress-plugin-baidu-tongji'
import { baiduTongjiPlugin } from '@vuepress-plume/vuepress-plugin-baidu-tongji'
import type { Plugin } from '@vuepress/core'
import type { PlumeThemePluginOptions } from '../../shared'

export const resolveBaiduTongji = ({
  baiduTongji,
}: PlumeThemePluginOptions): Plugin => {
  if (baiduTongji === false || !baiduTongji?.key) return [] as unknown as Plugin
  return baiduTongjiPlugin(baiduTongji as BaiduTongjiOptions)
}
