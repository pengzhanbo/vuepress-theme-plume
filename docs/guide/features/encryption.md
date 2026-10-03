---
title: 加密
icon: mdi:encryption-outline
createTime: 2024/03/04 15:58:48
permalink: /guide/features/encryption/
---

## 加密

主题内置文章加密功能，允许您为文章或整个集合设置密码保护。访问加密页面时，用户需要输入正确的密码才能查看内容。支持单篇文章加密、全局加密以及集合加密等多种模式。

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
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

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
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

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

```md title="frontmatter"
---
title: 加密的文章
password: 123456
---
```

还可以添加 `passwordHint` 选项，用于设置密码提示信息。

```md title="frontmatter"
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
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

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
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

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
被加密的内容 **不再** 被处理为 Vue 模板，解密后改为通过 `v-html` 作为静态 HTML 渲染。

**对于被加密的内容，可以使用：**

- 所有标准的 markdown 语法
- 渲染结果仍为标准 HTML 的主题扩展语法，如 提示容器（`::: tip` / `::: warning` / `::: details` 等）、代码块高亮、表格

**不支持：**

- 输出 Vue 组件的扩展语法，如 `tabs`、`code-tabs`、`code-tree`、`file-tree`、`collapse`、`timeline`、`card`、`table`、`steps`、`chat`、`repl` 等
- 全局 Vue 组件（主题内置的 与 用户自定义的）
- Vue 模板语法，如 `{{ }}` 插值、`v-` 指令与事件绑定
- 从目录中引入内容的语法，如 `@[demo]()`、`@[code]()`、`@[code-tree]()`

**替代方案：**

如果加密内容需要使用 Vue 组件或 Vue 模板语法，请改用 **整页加密**（`password` frontmatter）或 **全站加密**（`encrypt.global`），
它们的内容在构建期正常编译，因此不受上述限制。原因详见下方《如果你是技术开发者》的说明。

**网络环境要求：**
部分内容加密采用 [Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto) 实现，
因此，在 **非 HTTPS 环境** 下，将无法正常工作。
:::

::: details 如果你是技术开发者，你可能需要知道的内容

**加密实现原理：**

部分内容加密采用 [Web Crypto API](https://developer.mozilla.org/zh-CN/docs/Web/API/Crypto) 实现，主要涉及以下步骤：

- **密钥派生**：使用 **PBKDF2**（Password-Based Key Derivation Function 2）算法，结合用户输入的密码和随机盐值（salt）迭代派生出固定长度的密钥，从而增加暴力破解的难度。
- **加密算法**：使用 **AES-CBC**（Advanced Encryption Standard - Cipher Block Chaining）对称加密算法对内容进行加密。
- **编译时加密**：原始 markdown 内容首先经过 markdown 渲染为 HTML 内容后，再进行加密；传输到客户端，再进行解密渲染。

**静态渲染：**

解密后的内容直接作为静态 HTML 渲染，**不再** 被处理为 Vue 模板，因此不支持 Vue 组件与 Vue 模板语法。
此次调整只涉及渲染方式，加密与解密流程本身没有变化。

早期实现依赖 Vue 的运行时模板编译，代价是必须让站点携带模板编译器：所有访问者的页面体积与运行开销都会增加，
站点还需要在安全策略上放宽限制；而它换来的能力仅有"加密片段内可以使用 Vue 组件"。
对静态站点而言这一取舍并不划算，这类需求改用 **整页加密 / 全站加密** 即可满足。

**环境限制：**

由于 Web Crypto API 中的 `crypto.subtle` 仅在 **安全上下文**（Secure Context）中可用，因此部分内容加密功能要求站点运行在 **HTTPS** 环境下（`http://localhost` 也被视为安全上下文）。在非 HTTPS 环境下，加密功能将无法正常工作。
:::

## 相关配置

加密功能的多语言文本配置请参考 [多语言配置](../../config/locales.md#加密相关文本)。
