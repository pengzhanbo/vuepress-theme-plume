---
title: Kotlin
author: pengzhanbo
icon: tabler:brand-kotlin
createTime: 2024/04/22 09:44:37
permalink: /guide/repl/kotlin/
---

## 概述

主题提供了 Kotlin 代码演示，支持 在线运行 Kotlin 代码。

::: important
该功能通过将 代码提交到 服务器 进行 编译并执行，且一次只能提交单个代码文件。

因此，请不要使用此功能 执行 过于复杂的代码，也不要过于频繁的进行执行请求。
:::

## 配置

该功能默认不启用，你可以通过配置来启用它。

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        repl: true,
      },
    }
  })
})
```

:::

## 使用

使用 `::: kotlin-repl` 容器语法 将 Rust 代码块包裹起来。主题会检查代码块并添加执行按钮。

````md
::: kotlin-repl
```kotlin
// your kotlin code
```
:::
````

## 示例

### 打印内容

**输入：**

````md
::: kotlin-repl
```kotlin
class Contact(val id: Int, var email: String)

fun main(args: Array<String>) {
    val contact = Contact(1, "mary@gmail.com")
    println(contact.id)
}
```
:::
````

**输出：**

::: kotlin-repl

```kotlin
class Contact(val id: Int, var email: String)

fun main(args: Array<String>) {
    val contact = Contact(1, "mary@gmail.com")
    println(contact.id)
}
```

:::

### 运算

::: kotlin-repl

```kotlin
fun mul(a: Int, b: Int): Int {
    return a * b
}

fun main(args: Array<String>) {
    print(mul(-2, 4))
}
```

:::
