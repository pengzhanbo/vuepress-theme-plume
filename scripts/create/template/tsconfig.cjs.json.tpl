{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./lib"
  },
  "include": [
    {{#if shared}}
    "./src/shared",
    {{/if}}
    "./src/node"
  ]
}
