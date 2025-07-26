export interface TableContainerOptions {
  /**
   * 表格对齐方式
   * - 'left': 左对齐
   * - 'center': 居中对齐
   * - 'right': 右对齐
   *
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right'
  /**
   * 表格复制
   * - true: 等同于 `all`，支持复制为 html 和 markdown 格式
   * - 'all': 支持复制为 html 和 markdown 格式
   * - 'html': 只支持复制为 html 格式
   * - 'md': 只支持复制为 markdown 格式
   * - `false`: 禁用复制
   *
   * @default true
   */
  copy?: boolean | 'all' | 'html' | 'md'

  /**
   * 表格宽度是否为最大内容宽度
   *
   * 最大内容宽度时，行内元素不再自动换行，超出容器宽度时表格显示滚动条
   *
   * @default false
   */
  maxContent?: boolean
}
