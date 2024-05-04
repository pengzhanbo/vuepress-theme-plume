---
title: Golang
author: pengzhanbo
icon: devicon-plain:go
createTime: 2024/04/22 09:44:30
permalink: /guide/repl/golang/
---

## 概述

主题提供了 Golang 代码演示，支持 在线运行 Go 代码。

::: important
该功能通过将 代码提交到 服务器 进行 编译并执行。

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
        repl: {
          go: true,
        },
      },
    }
  })
})
```

:::

## 使用

使用 `::: go-repl` 容器语法 将 Go 代码块包裹起来。主题会检查代码块并添加执行按钮。

### 只读代码演示

golang 代码演示默认是只读的，不可编辑。

````md
::: go-repl 自定义标题
```go
// your go code
```
:::
````

### 可编辑代码演示

如果需要在线编辑并执行，需要将代码块包裹在 `::: go-repl#editable` 容器语法中

````md
::: go-repl#editable 自定义标题
```go
// your go code
```
:::
````

## 示例

### 打印内容

**输入：**

````md
:::go-repl
```go
package main

import (
  "fmt"
)

func main() {
  fmt.Println("Hello World")
}
```
:::
````

**输出：**
:::go-repl

```go
package main

import (
  "fmt"
)

func main() {
  fmt.Println("Hello World")
}
```

:::

### 可编辑代码演示

**输入：**

````md
:::go-repl#editable
```go
package main

import (
  "fmt"
)

func main() {
  fmt.Println("Hello World")
}
```
:::
````

**输出：**

:::go-repl#editable

```go
package main

import (
  "fmt"
)

func main() {
  fmt.Println("Hello World")
}
```

:::

### 循环随机延迟打印

**输入：**

````md
:::go-repl
```go
package main

import (
  "fmt"
  "math/rand"
  "time"
)

func main() {
  for i := 0; i < 10; i++ {
    dur := time.Duration(rand.Intn(1000)) * time.Millisecond
    fmt.Printf("Sleeping for %v\n", dur)
    // Sleep for a random duration between 0-1000ms
    time.Sleep(dur)
  }
  fmt.Println("Done!")
}
```
:::
````

**输出：**

:::go-repl

```go
package main

import (
  "fmt"
  "math/rand"
  "time"
)

func main() {
  for i := 0; i < 10; i++ {
    dur := time.Duration(rand.Intn(1000)) * time.Millisecond
    fmt.Printf("Sleeping for %v\n", dur)
    // Sleep for a random duration between 0-1000ms
    time.Sleep(dur)
  }
  fmt.Println("Done!")
}
```

:::

### 网络请求

::: go-repl

```go
package main

import (
  "fmt"
  "io"
  "log"
  "net"
  "net/http"
  "os"
)

func main() {
  http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello, playground")
  })

  log.Println("Starting server...")
  l, err := net.Listen("tcp", "localhost:8080")
  if err != nil {
    log.Fatal(err)
  }
  go func() {
    log.Fatal(http.Serve(l, nil))
  }()

  log.Println("Sending request...")
  res, err := http.Get("http://localhost:8080/hello")
  if err != nil {
    log.Fatal(err)
  }

  log.Println("Reading response...")
  if _, err := io.Copy(os.Stdout, res.Body); err != nil {
    log.Fatal(err)
  }
}
```

:::

### 多文件

::: go-repl

```go{10-12}
package main

import (
  "play.ground/foo"
)

func main() {
  foo.Bar()
}
-- go.mod --
module play.ground
-- foo/foo.go --
package foo

import "fmt"

func Bar() {
  fmt.Println("This function lives in an another file!")
}

```

:::
