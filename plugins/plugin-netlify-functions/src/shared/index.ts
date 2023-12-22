export interface NetlifyFunctionsOptions {
  /**
   * netlify functions source directory
   *
   * netlify functions 源码目录
   *
   * @default `app.dir.source('.vuepress/functions')`
   */
  sourceDirectory?: string

  /**
   * netlify functions output directory
   *
   * netlify functions 输出目录
   *
   * @default `app.dir.dest('functions')`
   */
  destDirectory?: string

  /**
   * 请求代理来源，将会转发到 functions directory
   *
   * @default `/api`
   */
  proxyPrefix?: string
}

export interface NetlifyFunctionsPluginOptions {
  directory: {
    dest: string
    source: string[]
    temp: string
  }
  proxyPrefix: string
}

export interface UseNetlifyFunctionPluginsOptions {
  directory: string
}
