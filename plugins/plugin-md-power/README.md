# vuepress-plugin-md-power

为 vuepress 提供 丰富的 markdown 语法支持。

## 功能

- caniuse 支持，提供前端各种特性在各个浏览器版本中的支持情况查看器
- 嵌入 PDF 支持
- 嵌入 视频支持，当前支持嵌入 bilibili 和 youtube 的视频
- 内联 iconify 图标支持

## 安装

```sh
pnpm add vuepress-plugin-md-power
```

## 使用

```ts
import { defineUserConfig } from 'vuepress'
import { md } from 'vuepress-plugin-md-power'

export default defineUserConfig({
  plugins: [
    markdownPowerPlugin({
      caniuse: true,
      pdf: true,
      bilibili: true,
      youtube: true,
      icons: true,
    })
  ]
})
```

### caniuse

插件默认不启用该功能，你需要手动设置 `caniuse` 为 `true`

#### 语法

```md
@[caniuse](feature)
@[caniuse image](feature)
@[caniuse embed{versions}](feature)
```

你可以从 [caniuse](https://caniuse.bitsofco.de/) 获取 feature 的值。

默认情况下，插件通过 `iframe` 嵌入 `caniuse` 的支持情况查看器。
你也可以使用 `@[caniuse image](feature)` 直接嵌入图片。

caniuse 默认查看最近的5个浏览器版本。你可以通过 `{versions}` 手动设置查看的浏览器版本。
格式为 `{number,number,...}`。取值范围为 `-5 ~ 3` 。

- 小于0 表示低于当前浏览器版本的支持情况
- 0 表示当前浏览器版本的支持情况
- 大于0 表示高于当前浏览器版本的支持情况

如 `{-2,-1,1,2}` 表示查看低于当前 2 个版本 到 高于当前 2 个版本的支持情况。

### pdf

插件默认不启用该功能，你需要手动设置 `pdf` 为 `true`

#### 语法

```md
@[pdf](url)
@[pdf 1](url)
@[pdf 1 no-toolbar width="100%" height="600px" zoom="1" ratio="16:9"](url)
```

`url` 只支持绝对路径以及完整的资源链接地址，请勿传入相对路径。

你可以在 `pdf` 后紧跟空格，设置一个数字表示默认显示的  pdf 页码

- `no-toolbar` 表示不显示工具栏
- `width` 设置宽度
- `height` 设置高度
- `zoom` 设置缩放
- `ratio` 设置宽高比， 仅当 `width` 有值， `height` 未设置时有效

### icons

插件默认不启用该功能，你需要手动设置 `icons` 为 `true`。

你还需要手动安装 `@iconify/json` 依赖。

```sh
pnpm add @iconify/json
```

#### 语法

```md
::collect:icon::
::collect:icon =size::
::collect:icon /color::
::collect:icon =size /color::
```

你可以从 [icon-sets.iconify](https://icon-sets.iconify.design/) 获取 图标集。

显示 `logos` 图标集合下的 `vue` 图标

```md
::logos:vue::
```

图标默认大小为 `1em` ，你可以通过 `=size` 设置图标大小

```md
::logos:vue =1.2em::
```

图标默认颜色为 `currentColor` 你可以通过 `/color` 设置图标颜色

```md
::logos:vue /blue::
```

也可以通过 `=size /color` 设置图标大小和颜色

```md
::logos:vue =1.2em /blue::
```

### bilibili

插件默认不启用该功能，你需要手动设置 `bilibili` 为 `true`

#### 语法

```md
@[bilibili](bvid)
@[bilibili autoplay time="0"](bvid)
@[bilibili p1 autoplay time="0" ratio="16:9"](aid cid)
```

- 设置 `autoplay` 以自动播放视频。
- 设置 `time` 以指定开始播放的时间点，单位为秒。还可以传入 `mm:ss` 或者 `hh:mm:ss`。
- 如果为 分p（非合集），还可以设置 `p\d` （第\d 个分p），此时可以只传入 `aid` 和 `cid`。
- 设置 `ratio` 以指定视频的宽高比。

### youtube

插件默认不启用该功能，你需要手动设置 `youtube` 为 `true`

#### 语法

```md
@[youtube](id)
@[youtube autoplay loop ratio="16:9" star="0" end="0"](id)
```

- `id` 为 YouTube 视频 ID
- `autoplay` 为是否自动播放
- `loop` 为是否循环播放
- `ratio` 为视频的宽高比
- `star` 为开始时间，单位为秒，还可以传入 `mm:ss` 或者 `hh:mm:ss`。
- `end` 为结束时间，单位为秒，还可以传入 `mm:ss` 或者 `hh:mm:ss`。

### CodePen

插件默认不启用该功能，你需要手动设置 `codepen` 为 `true`

#### 语法

```md
@[codepen](user/slash)
@[codepen preview editable title="" height="400px" tab="css,result" theme="dark"](user/slash)
```

- `user` 为 CodePen 用户名
- `slash` 为 CodePen slash
- `preview` 为是否为预览模式
- `editable` 为是否为可编辑模式
- `title` 为标题
- `height` 为高度
- `tab` 为选项卡，默认为 `result`, 多个以逗号分隔，如 `css,result`
- `theme` 为主题， 可选值包括 `dark` 和 `light`

### Replit

插件默认不启用该功能，你需要手动设置 `replit` 为 `true`

#### 语法

```md
@[replit](user/repl-name)
@[replit title="" height="450px" theme="dark"](user/repl-name#filepath)
```

- `user` 为 Replit 用户名
- `repl-name` 为 Replit Repl 名
- `filepath` 为文件路径
- `title` 为标题
- `height` 为高度
- `theme` 为主题， 可选值包括 `dark` 和 `light`

### CodeSandbox

插件默认不启用该功能，你需要手动设置 `codesandbox` 为 `true`

#### 语法

```md
@[codesandbox](id)
@[codesandbox button](workspace/id)
@[codesanbox title="xxx" layout="Editor+Preview" height="500px" navbar="false" console](id#filepath)
```

- `id`: Code Sandbox ID
- `title`: Code Sandbox 标题
- `layout`: 代码预览布局 可选值： `Preview`， `Editor`， `Editor+Preview`
- `height`: 代码预览高度
- `navbar`: 是否显示导航栏，默认为 true
- `console`: 是否显示控制台，默认为 false
- `filepath`: 文件路径

### JSFiddle

插件默认不启用该功能，你需要手动设置 `jsfiddle` 为 `true`

#### 语法

```md
@[jsfiddle](user/id)
@[jsfiddle theme="dark" tab="js,css,html,result" height="500px"](user/id)
```

- `user`: 用户
- `id`: jsfiddle id
- `theme`: 主题模式， 可选值： `"light" | "dark"`
- `tab`: 选项卡， 可选值：`"js" | "css" | "html" | "result"`, 多个用 `","` 分割，
  顺序将决定选项卡的排序，默认为 `js,css,html,result`
- `height`: 高度
