{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ES2020",
    "rootDir": "./src",
    "outDir": "./lib",
    "types": [
      "@vuepress/client/types"
    ]
  },
  "include": [
    {{#if shared}}
    "./src/shared",
    {{/if}}
    "./src/client"
  ]
}
