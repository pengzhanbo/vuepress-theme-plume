# REPL (run code in the browser)

Four container forms, each rendering an in-page editor + runtime:

| Container | Language | Enable |
| --- | --- | --- |
| `:::rust-repl` | Rust | `markdown: { repl: true }` |
| `:::go-repl` | Go | same |
| `:::kotlin-repl` | Kotlin | same |
| `:::python-repl` | Python | same |

```ts
markdown: {
  repl: true,
  // or per-language options
  repl: { theme: 'github-light', rust: {}, go: {}, kotlin: {}, python: {} },
}
```

## Syntax

````md
:::rust-repl
```rust
fn main() {
    println!("Hello, Plume!");
}
```
:::
````

The code block inside must use the matching language. `repl` is **not** related to `@[replit]`.

## `@[replit]` — deprecated

`markdown.replit: true` and `@[replit](user/repl-name)` still parse but Replit shut down its embedding
service; do not use them for new content.

```md
@[replit title="" width="100%" height="450px" theme="dark"](user/repl-name#filepath)
```

## Related

`docs/guide/repl/frontend.md` covers `::: demo` (front-end live demos) — see `resources/demo.md`.
