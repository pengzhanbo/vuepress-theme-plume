# PlantUML

PlantUML diagrams are written as **bare `@start…/@end…` blocks** — not fenced code blocks.

## Enable

```ts
markdown: {
  plantuml: true,
  // or a self-hosted renderer (default server is the public https://www.plantuml.com/plantuml)
  plantuml: [{ server: 'https://your-plantuml-server/' }],
}
```

The default public server **sends the diagram source to plantuml.com** — mention this when the content is
private, and suggest self-hosting or another diagram type.

## Syntax

```md
@startuml
Alice -> Bob: Authentication Request
Bob -> Alice: Authentication Accepted
@enduml
```

Supported start/end pairs:

`@startuml/@enduml`, `@startmindmap/@endmindmap`, `@startgantt/@endgantt`, `@startwbs/@endwbs`,
`@startjson/@endjson`, `@startyaml/@endyaml`, `@startsalt/@endsalt`, `@startregex/@endregex`.

## Example

```md
@startuml
skinparam backgroundColor transparent

actor User
User -> Site: 访问页面
Site -> Site: 读取 markdown
Site --> User: 渲染 HTML
@enduml
```
