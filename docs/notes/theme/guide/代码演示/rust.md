---
title: Rust
author: pengzhanbo
icon: logos:rust
createTime: 2024/04/22 09:44:43
permalink: /guide/repl/rust/
---

## 概述

主题提供了 Rust 代码演示，支持 在线运行 Rust 代码。

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

使用 `::: rust-repl` 容器语法 将 Rust 代码块包裹起来。主题会检查代码块并添加执行按钮。

````md
::: rust-repl
```rust
// your rust code
```
:::
````

## 示例

### 打印内容

**输入：**

````md
::: rust-repl
```rust
fn main() {
    println!("Hello, world!");
}
```
:::
````

**输出：**

::: rust-repl

```rust
fn main() {
    println!("Hello, world!");
}
```

:::

点击 执行 按钮，即可执行代码。

### 打印错误信息

**输入：**

````md
::: rust-repl
```rust
fn main() {
    printlnl!("Hello, world!");
}
```
:::
````

**输出：**

::: rust-repl

```rust
fn main() {
    printlnl!("Hello, world!");
}
```

:::

### 等待子进程执行

::: rust-repl

```rust
use std::process::Command;

fn main() {
    let mut child = Command::new("sleep").arg("5").spawn().unwrap();
    let _result = child.wait().unwrap();

    println!("reached end of main");
}
```

:::
