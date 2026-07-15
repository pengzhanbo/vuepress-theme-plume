---
url: /en/guide/repl/golang/index.md
---
## Overview

The theme provides Golang code demonstration functionality, supporting online execution of Go code.

::: important
This functionality works by submitting code to a server for compilation and execution.

Therefore, please do not use this feature to execute overly complex code, and avoid making execution requests too frequently.
:::

## Configuration

This feature is disabled by default. You can enable it through configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      repl: {
        go: true,
      },
    },
  })
})
```

## Usage

Use the `::: go-repl` container syntax to wrap Go code blocks. The theme will detect the code blocks and add execution buttons.

### Read-only Code Demo

Golang code demos are read-only by default and cannot be edited.

````md
::: go-repl title="Custom Title"
```go
// your go code
```
:::
````

### Editable Code Demo

For online editing and execution, wrap the code block in the `::: go-repl editable` container syntax.

````md
::: go-repl editable title="Custom Title"
```go
// your go code
```
:::
````

## Examples

### Print Content

**Input:**

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

**Output:**
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

### Editable Code Demo

**Input:**

````md
:::go-repl editable
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

**Output:**

:::go-repl editable

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

### Loop with Random Delay Printing

**Input:**

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

**Output:**

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

### Network Request

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

### Multiple Files

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
