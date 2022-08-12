{
  "extends": "../../tsconfig.base.json",
  "references": [
    {{#if client}}
    {
      "path": "./tsconfig.esm.json"
    },
    {{/if}}
    {
      "path": "./tsconfig.cjs.json"
    }
  ],
  "files": []
}
