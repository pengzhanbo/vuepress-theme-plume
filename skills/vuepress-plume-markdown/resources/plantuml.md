# PlantUML

The theme supports embedding [PlantUML](https://plantuml.com/) diagrams within articles.

## Configuration

Enable the feature in `.vuepress/config.ts`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      plantuml: true,
    },
  })
})
```

## Syntax

Use the `plantuml` syntax within a markdown file. Note: The example uses a raw code block,
but typically you would use the `@startuml` and `@enduml` tags directly or inside a code block if the plugin supports it.
The documentation shows:

```md
@startuml
Alice -> Bob: Authentication Request

alt successful case

    Bob -> Alice: Authentication Accepted

else some failure case

    Bob -> Alice: Authentication Failed
    group My own label
    Alice -> Log : Log attack start
        loop 1000 times
            Alice -> Bob: DNS Attack
        end
    Alice -> Log : Log attack end
    end

else Another failure

   Bob -> Alice: Please repeat

end
@enduml
```
