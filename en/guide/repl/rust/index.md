---
url: /en/guide/repl/rust/index.md
---
## Overview

The theme provides Rust code demonstration functionality, supporting online execution of Rust code.

::: important
This functionality works by submitting code to a server for compilation and execution, and only a single code file can be submitted at a time.

Therefore, please do not use this feature to execute overly complex code, and avoid making execution requests too frequently.
:::

## Configuration

This feature is disabled by default. You can enable it through configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      repl: {
        rust: true,
      },
    },
  })
})
```

## Usage

Use the `::: rust-repl` container syntax to wrap Rust code blocks. The theme will detect the code blocks and add execution buttons.

### Read-only Code Demo

Rust code demos are read-only by default and cannot be edited.

````md
::: rust-repl title="Custom Title"
```rust
// your rust code
```
:::
````

### Editable Code Demo

For online editing and execution, wrap the code block in the `::: rust-repl editable` container syntax.

````md
::: rust-repl editable title="Custom Title"
```rust
// your rust code
```
:::
````

## Examples

### Print Content

**Input:**

````md
::: rust-repl title="Print Content"
```rust
fn main() {
    println!("Hello, world!");
}
```
:::
````

**Output:**

::: rust-repl title="Print Content"

```rust
fn main() {
    println!("Hello, world!");
}
```

:::

Click the Execute button to run the code.

### Print Error Information

**Input:**

````md
::: rust-repl
```rust
fn main() {
    printlnl!("Hello, world!");
}
```
:::
````

**Output:**

::: rust-repl

```rust
fn main() {
    printlnl!("Hello, world!");
}
```

:::

### Wait for Child Process Execution

**Input:**

````md
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
````

**Output:**

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

### Editable Demo

**Input:**

````md
::: rust-repl editable
```rust
fn main() {
    println!("Hello, world!");
}
```
:::
````

**Output:**

::: rust-repl editable

```rust
fn main() {
    println!("Hello, world!");
}
```

:::
