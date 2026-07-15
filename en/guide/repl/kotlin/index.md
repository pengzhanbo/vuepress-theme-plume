---
url: /en/guide/repl/kotlin/index.md
---
## Overview

The theme provides Kotlin code demonstrations, supporting online execution of Kotlin code.

::: important
This feature works by submitting code to a server for compilation and execution, and only a single code file can be submitted at a time.

Therefore, please do not use this feature to execute overly complex code, and avoid making execution requests too frequently.
:::

## Configuration

This feature is disabled by default. You can enable it through configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      repl: {
        kotlin: true,
      },
    },
  })
})
```

## Usage

Use the `::: kotlin-repl` container syntax to wrap Kotlin code blocks. The theme will inspect the code block and add an execution button.

### Read-Only Code Demo

Kotlin code demos are read-only by default and cannot be edited.

````md
::: kotlin-repl title="Custom Title"
```kotlin
// your kotlin code
```
:::
````

### Editable Code Demo

If you need online editing and execution, wrap the code block in the `::: kotlin-repl editable` container syntax.

````md
::: kotlin-repl editable title="Custom Title"
```kotlin
// your kotlin code
```
:::
````

## Examples

### Print Content

**Input:**

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

**Output:**

::: kotlin-repl

```kotlin
class Contact(val id: Int, var email: String)

fun main(args: Array<String>) {
    val contact = Contact(1, "mary@gmail.com")
    println(contact.id)
}
```

:::

### Computation

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

### Editable Code Demo

**Input:**

````md
::: kotlin-repl editable
```kotlin
class Contact(val id: Int, var email: String)

fun main(args: Array<String>) {
    val contact = Contact(1, "mary@gmail.com")
    println(contact.id)
}
```
:::
````

**Output:**

::: kotlin-repl editable

```kotlin
class Contact(val id: Int, var email: String)

fun main(args: Array<String>) {
    val contact = Contact(1, "mary@gmail.com")
    println(contact.id)
}
```

:::
