---
title: 加密
icon: mdi:encryption-outline
createTime: 2024/03/04 15:58:48
permalink: /guide/features/encryption/
---

## 加密

在本主题中，支持 **全站加密** 、 **部分页面加密** 和 **部分内容加密** 等多种灵活的加密方式。

::: warning 提示
由于 `vuepress` 是静态站点，其自身限制的原因，**加密** 仅仅只是 看起来 看不到内容，
并且在 编译时，不再将 内容 预渲染到 `html` 中，但实际上 还是能够从 站点源文件 中获取到内容。
因此，不建议将 **加密** 功能 认为是 安全可靠的。

请尽量避免将 **加密功能** 应用于需要 **严格保密** 的内容 中。
:::

**已解锁的文章，仅在当前会话中可见。**

## 启用加密功能

在 主题配置中，添加 `encrypt` 选项。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    encrypt: {
      // more options...
    }
  })
})
```

## 全站加密

有些情况下，你可能 需要对 全站进行加密。
因此，你可以通过 `encrypt.global` 选项配置全站加密。
然后，通过配置 `encrypt.admin` 选项，设置一个或多个密码。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    encrypt: {
      global: true,
      admin: ['123456'],
    }
  })
})
```

## 部分页面加密

大多数情况下，你可能只需需要 加密 某一篇文章、某一个目录 等。
因此，你可以通过 `encrypt.rules` 选项配置部分加密。

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    encrypt: {
      rules: {
        // 可以是 md 文件的相对路径，对该文件加密
        '前端/基础.md': '123456',
        // 可以是 文件夹的路径，对该目录下所有文章加密
        '/notes/vuepress-theme-plume/': '123456',
        // 可以是 访问地址的请求路径，对该访问路径下所有文章加密
        '/vuepress-theme-plume/': '123456',
        // 可以是 具体的某个页面的请求路径，对该页面加密
        '/article/f8dnci3/': '123456',
        // 如果是 `^` 开头，则匹配该正则表达式的页面也会加密
        '^/(a|b)/': '123456',
      }
    }
  })
})
```

`encrypt.rules` 的 **键** 将作为 匹配规则，**值** 将作为 该规则对应的密码，可以设置 一个或多个密码。

:::tip 说明

- 密码 必须是 普通的字符串。
- 如果是 加密的是 整个目录，解锁时也是解锁整个目录，而不是解锁该目录下的某个文章。
- `encrypt.admin` 也可用于解锁 **部分加密** 的页面。
- 使用 `encrypt.admin` 解锁后，被认为是管理员访问，其它未解锁页面也默认解锁。
:::

### Frontmatter

在 Markdown 文件的 `Frontmatter` 中，可以使用 `password` 设置文章的密码。

```md
---
title: 加密的文章
password: 123456
---
```

还可以添加 `passwordHint` 选项，用于设置密码提示信息。

```md
---
title: 加密的文章
password: 123456
passwordHint: 密码是 123456
---
```

### 示例

点击访问 [加密文章，密码：123456](/article/enx7c9s/)

## 部分内容加密

### 配置

部分内容加密通过 `::: encrypt` 容器实现，需要配置 `markdown.encrypt` 选项：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      encrypt: true, // [!code ++]
    }
  })
})
```

还可以给 `::: encrypt` 容器设置统一的默认密码：

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      encrypt: {
        password: 123456, // [!code ++]
      }
    }
  })
})
```

### 使用

使用 `::: encrypt` 容器，将需要加密的内容包裹起来。
可以在容器中添加 `password` / `pwd` 属性，设置该容器的密码。
如果没有设置密码，将使用默认密码。

还可以在容器上添加 `hint` 属性，设置密码提示信息。

```md /password="123456"/
::: encrypt password="123456" hint="密码是连续的 6 位数"
这是加密的内容
:::
```

::: info 密码仅有一个生效，不支持同时设置多个密码。
:::

### 示例

**输入：**

```md
::: encrypt password="123456"
这是加密的内容
:::
```

**输出：**

::: encrypt password="123456"
这是加密的内容
:::

**输入：**

```md
::: encrypt password="654321" hint="密码是连续的 6 位数"
这是加密的内容2
:::
```

**输出：**

::: encrypt password="654321" hint="密码是连续的 6 位数"
这是加密的内容2
:::

::: warning 使用限制
**对于被加密的内容，可以使用：**

- 所有标准的 markdown 语法
- 主题提供的 大多数扩展语法，但不包括：
  - `@[demo]()` 从目录中引入的代码示例
  - `@[code]()` 从目录中引入的代码片段
  - `@[code-tree]()` 从目录中引入的代码树
- 主题提供的 全局 vue 组件
- 用户自定义的 全局 vue 组件
- 被加密的内容，不能包含可执行的脚本，如有特殊交互，请通过组件实现。

**网络环境要求：**
部分内容加密采用 [Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) 实现，
因此，在 **非 HTTPS 环境** 下，将无法正常工作。
:::

::: details 如果你是技术开发者，你可能需要知道的内容

原始 markdown 内容首先进过 markdown 渲染为 HTML 内容后，再进行加密；传输到客户端，再进行解密渲染。
解密后的内容会被包装为一个动态的 vue 组件，html 作为 template 传给该动态组件，因此，涉及到运行时编译 template
的内容。这导致了如果启用部分内容加密功能，那么就需要将 vue 切换到 `esm-bundler` 版本，以支持运行时编译，
这会比默认的 `runtime-only` 版本性能差一些，体积也会增加。
:::

## 相关配置

以下配置支持在 [多语言配置](../../config/locales.md) 中使用。

### encryptGlobalText

- **类型**： `string`
- **默认值**： `'Only password can access this site'`
- **说明**：

  全站加密时，提示信息。支持 HTML。如果你期望为访客提供获取密码的联系方式，你可能会需要这个配置。

### encryptPageText

- **类型**： `string`
- **默认值**： `'Only password can access this page'`
- **说明**：

  部分加密时，提示信息。支持 HTML。如果你期望为访客提供获取密码的联系方式，你可能会需要这个配置。

### encryptButtonText

- **类型**： `string`
- **默认值**： `'Confirm'`
- **说明**： 确认按钮的文本

### encryptPlaceholder

- **类型**： `string`
- **默认值**： `'Enter password'`
- **说明**： 密码输入框的占位符

### 示例

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': {
        encryptButtonText: 'Confirm',
        encryptPlaceholder: 'Enter password',
        encryptGlobalText: 'Only password can access this site',
        encryptPageText: 'Only password can access this page',
      }
    }
  })
})
```
