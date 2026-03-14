---
url: /en/guide/markdown/include/index.md
---
## Overview

The theme supports including file snippets in Markdown files.

File inclusion is enabled by default, and you can customize its behavior through configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      include: { // [!code ++:3]
        // ... options
      },
    }
  })
})
```

## Syntax

Use `<!-- @include: filename -->` to include a file.

To include specific parts of a file, you can specify line ranges:

* `<!-- @include: filename{start-end} -->`
* `<!-- @include: filename{start-} -->`
* `<!-- @include: filename{-end} -->`

You can also include file regions:

* `<!-- @include: filename#region -->`

::::tip File Regions
File regions are a concept from VSCode, where region content is surrounded by `#region` and `#endregion` comments.

::: code-tabs

@tab HTML

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- region snippet -->
    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi,
      repellendus. Voluptatibus alias cupiditate at, fuga tenetur error officiis
      provident quisquam autem, porro facere! Neque quibusdam animi quaerat
      eligendi recusandae eaque.
    </p>
    <!-- endregion snippet -->
    <p>
      Veniam harum illum natus omnis necessitatibus numquam architecto eum
      dignissimos, quos a adipisci et non quam maxime repellendus alias ipsum,
      vero praesentium laborum commodi perferendis velit repellat? Vero,
      cupiditate sequi.
    </p>
  </body>
</html>
```

@tab Markdown

```md
## Hello world

<!-- #region snippet -->

Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
inventore iure quo aut doloremque, ipsum ab voluptatem ipsa, velit laborum
illo quae omnis reiciendis hic, ut dolorem non debitis in!

<!-- #endregion snippet -->

Veniam harum illum natus omnis necessitatibus numquam architecto eum
dignissimos, quos a adipisci et non quam maxime repellendus alias ipsum,
vero praesentium laborum commodi perferendis velit repellat? Vero,
cupiditate sequi.
```

@tab TS

```ts
import { include } from '@mdit/plugin-include'
import MarkdownIt from 'markdown-it'

// #region snippet
const mdIt = MarkdownIt().use(include, {
  // your options, currentPath is required
  currentPath: env => env.filePath,
})
// #endregion snippet

mdIt.render('<!-- @include: ./path/to/include/file.md -->', {
  filePath: 'path/to/current/file.md',
})
```

@tab JS

```js
const { include } = require('@mdit/plugin-include')
const MarkdownIt = require('markdown-it')

// #region snippet
const mdIt = MarkdownIt().use(include, {
  // your options, currentPath is required
  currentPath: env => env.filePath,
})
// #endregion snippet

mdIt.render('<!-- @include: ./path/to/include/file.md -->', {
  filePath: 'path/to/current/file.md',
})
```

@tab css

```css
html,
body {
  margin: 0;
  padding: 0;
}

/* #region snippet */
h1 {
  font-size: 1.5rem;
}
/* #endregion snippet */

h2 {
  font-size: 1.2rem;
}
```

@tab Less

```less
html,
body {
  margin: 0;
  padding: 0;
}

/* #region snippet */
h1 {
  font-size: 1.5rem;
}
/* #endregion snippet */

h2 {
  font-size: 1.2rem;
}
```

@tab Sass

```scss
html,
body {
  margin: 0;
  padding: 0;
}

/* #region snippet */
h1 {
  font-size: 1.5rem;
}
/* #endregion snippet */

h2 {
  font-size: 1.2rem;
}
```

@tab Java

```java
public class HelloWorld {
  // #region snippet
  public static void main(String args[]){
    System.out.println("Hello World");
  }
  // #endregion snippet
}
```

@tab Python

```py
class MyClass:
    msg = "world"

    #region snippet
    def sayHello(self):
        print("Hello " + self.msg + "!")
    #region snippet

    def sayBye(self):
        print("Bye " + self.msg + "!")
```

@tab Visual Basic

```vb
Imports System

Module Module1
   # Region snippet
   Sub Main()
     Console.WriteLine("Hello World!")
     Console.WriteLine("Press Enter Key to Exit.")
     Console.ReadLine()
   End Sub
   # EndRegion
End Module
```

@tab Bat

```bat
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
echo Requesting administrative privileges...
goto UACPrompt
) else ( goto gotAdmin )

::#region snippet
:UACPrompt
echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
"%temp%\getadmin.vbs"
exit /B
::#endregion snippet

:gotAdmin
if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
pushd "%CD%"
CD /D "%~dp0"
```

@tab C#

```cs
using System;

namespace HelloWorldApp {

    class Geeks {

        // #region snippet
        static void Main(string[] args) {

            // statement
            // printing Hello World!
            Console.WriteLine("Hello World!");

            // To prevents the screen from
            // running and closing quickly
            Console.ReadKey();
        }
        // #endregion snippet
    }
}
```

@tab C/C++

```cpp
#include <iostream>
#include <vector>

std::vector<int> v;

#pragma region snippet
int f() {
  for (int item : v) std::cout << item << std::endl;
  return v.size();
}
#pragma endregion snippet

int main() {
  int n, u;
  std::cin >> n;
  for (int i = 1; i <= n; ++i) {
    std::cin >> u;
    v.push_back(u);
  }
  std::cout << f();
  return 0;
}
```

:::

::::

## Configuration

You can also configure an object to customize the file path resolution and inclusion behavior.

```ts
interface IncludeOptions {
  /**
   * Handler for resolving include file paths
   *
   * @default (path) => path
   */
  resolvePath?: (path: string, cwd: string | null) => string
  /**
   * Whether to deeply include nested Markdown files
   *
   * @default false
   */
  deep?: boolean
  /**
   * Whether to use `<!-- @include: xxx -->` instead of `@include: xxx` for file inclusion
   *
   * @default true
   */
  useComment?: boolean
  /**
   * Whether to resolve relative image paths in included Markdown files
   *
   * @default true
   */
  resolveImagePath?: boolean
  /**
   * Whether to resolve relative file paths in included Markdown files
   *
   * @default true
   */
  resolveLinkPath?: boolean
}
```

For example: You can use `@src` as an alias for your source directory.

```ts{5-11} title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      include: {
        resolvePath: (file) => {
          if (file.startsWith('@src'))
            return file.replace('@src', path.resolve(__dirname, '..'))

          return file
        },
      },
    }
  })
})
```

Additionally, if you want to place Markdown files directly alongside your actual files but don't
want them rendered as pages, you can set the `pagePatterns` option in your VuePress configuration.
For more details, refer to [pagePatterns](https://vuejs.press/zh/reference/config.html#pagepatterns).

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  // Now any file with `.snippet.md` extension will not be rendered as a page
  pagePatterns: ['**/*.md', '!**/*.snippet.md', '!.vuepress', '!node_modules'], // [!code ++]
  theme: plumeTheme({
    markdown: {
      include: true
    }
  })
})
```

## Examples

Given a `foo.snippet.md` file in your project:
:::: code-tabs
@tab foo.snippet.md

```md
### Level 3 Heading

This is content from the foo.snippet.md file.

::: info
Content included in an info container.
:::

<!-- region snippet -->
This is content wrapped by `<!-- region snippet -->`.

Included via `<!-- @include: ./foo.snippet.md#snippet -->`.
<!-- endregion snippet -->
```

::::

Using `<!-- @include: ./foo.snippet.md -->` to include the entire file:

:::: window title="Include by file"

### Level 3 Heading

This is the content of the `foo.snippet.md` file.

:::info
Content of the info container
:::

This is the content wrapped by `<!-- region snippet -->`.

It can be imported via `<!-- @include: ./foo.snippet.md#snippet -->`.

::::

Using `<!-- @include: ./foo.snippet.md{5-7} -->` to include lines 5-7 of the file:

:::: window title="Include by lines"

:::info
Content of the info container
:::

::::

Using `<!-- @include: ./foo.snippet.md#snippet -->` to include the `snippet` region:

:::: window title="Include by file region"

This is the content wrapped by `<!-- region snippet -->`.

It can be imported via `<!-- @include: ./foo.snippet.md#snippet -->`.

::::
