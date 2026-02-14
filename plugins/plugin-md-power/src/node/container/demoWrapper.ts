import type { Markdown } from 'vuepress/markdown'
import { resolveAttrs } from '.././utils/resolveAttrs.js'
import { createContainerPlugin } from './createContainer.js'

/**
 * Demo wrapper attributes
 *
 * 演示包装器属性
 */
interface DemoWrapperAttrs {
  title?: string
  img?: string
  noPadding?: boolean
  height?: string
}

/**
 * Demo wrapper plugin - Enable demo wrapper container
 *
 * 演示包装器插件 - 启用演示包装器容器
 *
 * Syntax: :::demo-wrapper img no-padding title="xxx" height="100px"
 * 语法：:::demo-wrapper img no-padding title="xxx" height="100px"
 *
 * @param md - Markdown instance / Markdown 实例
 */
export function demoWrapperPlugin(md: Markdown): void {
  createContainerPlugin(md, 'demo-wrapper', {
    before: (info: string) => {
      const { attrs } = resolveAttrs<DemoWrapperAttrs>(info)
      const wrapperClasses: string[] = ['demo-wrapper']
      let containerStyle = ''
      if (attrs.title)
        wrapperClasses.push('has-title')

      if (attrs.img)
        wrapperClasses.push('only-img')

      if (attrs.noPadding)
        wrapperClasses.push('no-padding')

      if (attrs.height) {
        const h = Number.parseFloat(attrs.height) === Number(attrs.height) ? `${attrs.height}px` : attrs.height
        containerStyle += `--demo-container-height: ${h};`
        wrapperClasses.push('has-height')
      }

      return `<div class="${wrapperClasses.join(' ')}">
  <div class="demo-head">
    <div class="demo-ctrl"><i></i><i></i><i></i></div>
    ${attrs.title ? `<h4 class="demo-title"><p>${attrs.title}</p></h4>` : ''}
  </div>
  <div class="demo-container" ${containerStyle ? `style="${containerStyle}"` : ''}>\n`
    },
    after: () => '</div></div>',
  })
}
