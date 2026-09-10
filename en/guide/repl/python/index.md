---
url: /en/guide/repl/python/index.md
---
## Overview

The theme provides Python code demonstration functionality, supporting online execution of Python code.

## Installation

Online Python execution is powered by [pyodide](https://pyodide.org/en/latest/). Please ensure `pyodide` is available before use.

::: npm-to

```sh
npm install pyodide
```

:::

## Configuration

This feature is disabled by default. You can enable it through configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      repl: {
        python: true,
      },
    },
  })
})
```

## Usage

Use the `::: python-repl` container syntax to wrap Python code blocks. The theme will detect the code blocks and add execution buttons.

::: warning The support for python-repl is limited and currently only supports:

* Execution of basic Python syntax (no backend dependencies)
* Import of basic Python libraries
* Standard output stream (stdout) capture
* If the last statement is an expression (and the code doesn't end with a semicolon), the expression value will be returned
* Exception message output

:::

### Read-only Code Demo

Python code demos are read-only by default and cannot be edited.

````md
::: python-repl title="Custom Title"
```python
# your python code
```
:::
````

### Editable Code Demo

For online editing and execution, wrap the code block in the `::: python-repl editable` container syntax.

````md
::: python-repl editable title="Custom Title"
```python
# your python code
```
:::
````

## Examples

### Print Content

**Input:**

````md
::: python-repl
```python
def hello_world():
    return 'Hello World!'

hello_world()
```
:::
````

**Output:**

::: python-repl

```python
def hello_world():
    print('Hello World!')

hello_world()
```

:::

### Arithmetic Operations

::: python-repl

```python
def mul(a: int, b: int) -> int:
    return a * b

print(mul(-2, 4))
```

:::

### Editable Code Demo

**Input:**

````md
::: python-repl editable
```python
class Contact:
    def __init__(self, id: int, email: str):
        self.id = id
        self.email = email

contact = Contact(1, 'mary@gmail.com')
print(contact.id)
```
:::
````

**Output:**

::: python-repl editable

```python
class Contact:
    def __init__(self, id: int, email: str):
        self.id = id
        self.email = email

contact = Contact(1, 'mary@gmail.com')
print(contact.id)
```

:::
