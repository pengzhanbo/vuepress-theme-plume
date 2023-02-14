# `@vuepress-plume/vuepress-plugin-auto-frontmatter`

自动生成 `*.md` 文件的 `frontmatter` 配置。

## Install
```
yarn add @vuepress-plume/vuepress-plugin-auto-frontmatter
```
## Usage
``` js
// .vuepress/config.js
import  { autoFrontmatterPlugin } from '@vuepress-plume/vuepress-plugin-auto-frontmatter'
export default {
  //...
  plugins: [
    autoFrontmatterPlugin({
      formatter: {
        createTime(formatTime, matter, file) {
          if (formatTime) return formatTime
          return file.createTime
        }
      }
    })
  ]
  // ...
}
```

## `autoFrontmatterPlugin([options])`

### options

`{ include?: string | string[]; exclude?: string | string[]; formatter: Formatter }`

- `include` 
  include 匹配字符串或数组，匹配需要自动生成 `frontmatter` 的 md文件。
  默认预设为 `['**/*.md']`。

- `exclude`
  exclude 排除不需要的文件
  默认预设为： `['!.vuepress/', '!node_modules/']`

- `formatter`
  配置`frontmatter`每个字段的生成规则。
  ```ts
  interface MarkdownFile {
    filepath: string
    relativePath: string
    content: string
    createTime: Date
  }

  interface FormatterFn<T = any, K = object> {
    (value: T, data: K, file: MarkdownFile): T
  }

  type FormatterObject<K = object, T = any> = Record<
    string,
    FormatterFn<T, K>
  >

  type FormatterArray = {
    include: string
    formatter: FormatterObject
  }[]

  type Formatter = FormatterObject | FormatterArray

  /**
   * formatterObj 对象中的 key 即为 frontmatter 配置中的key
   * 其方法返回的值将作为 frontmatter[key] 的值
   * *.md
   * ---
   * createTime: 2022-03-26T11:46:50.000Z
   * ---
   */
  const formatterObj: Formatter  = {
    createTime(formatTime, matter, file) {
      if (formatTime) return formatTime
      return file.createTime
    }
  }

  const formatterArr: Formatter = [
    {
      // 更精细化的匹配某个 md文件，支持glob 匹配字符串
      include: '**/{README,index}.md',
      // formatter 仅对 glob命中的文件有效
      formatter: {
        home(value, matter, file) {
          return value
        }
      },
      {
        // 通配，如果文件没有被其他精细glob命中，
        // 则使用 通配 formatter
        // 如果是数组，必须有且用一个 include 为 * 的 项
        include: '*',
        formatter: {
          title(title) {
            return title || '默认标题'
          }
        }
      }
    }
  ]

  ```

## Why ?

- **为什么需要这个插件？**
  
  有时候在开发一些主题时，期望使用户更专注于内容的编写，尽可能减少配置性的工作，可以将一些重复性的必要的配置
  直接通过本插件自动生成。
