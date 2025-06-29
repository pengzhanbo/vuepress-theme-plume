---
url: /guide/repl/python/index.md
---
## 概述

主题提供了 Python 代码演示，支持在线运行 Python 代码。

## 安装

python 在线执行由 [pyodide](https://pyodide.org/en/latest/) 提供，使用前请确保有 `pyodide` 可用

::: npm-to

```sh
npm install pyodide
```

:::

## 配置

该功能默认不启用，你可以通过配置来启用它。

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

## 使用

使用 `::: python-repl` 容器语法 将 python 代码块包裹起来。主题会检查代码块并添加执行按钮。

::: warning python-repl 的支持是有限的，目前只支持：

* 基本 Python 语法的执行（不依赖后端）
* 可导入 Python 基本库
* 标准输出流（stdout）捕获输出
* 最后一条语句是一个表达式（且代码不以分号结尾），则会返回该表达式的值。
* 异常信息输出

:::

### 只读代码演示

Python 代码演示默认是只读的，不可编辑。

````md
::: python-repl title="自定义标题"
```python
// your python code
```
:::
````

### 可编辑代码演示

如果需要在线编辑并执行，需要将代码块包裹在 `::: python-repl editable` 容器语法中。

````md
::: python-repl editable title="自定义标题"
```python
// your python code
```
:::
````

## 示例

### 打印内容

**输入：**

````md
::: python-repl
```python
def hello_world():
    return 'Hello World!'

hello_world()
```
:::
````

**输出：**

::: python-repl

```python
def hello_world():
    print('Hello World!')

hello_world()
```

:::

### 运算

::: python-repl

```python
def mul(a: int, b: int) -> int:
    return a * b

print(mul(-2, 4))
```

:::

### 可编辑代码演示

**输入：**

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

**输出：**

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
