import config from '@pengzhanbo/eslint-config-vue'

export default config({
  pnpm: true,
  vue: {
    a11y: true,
  },
  ignores: [
    'lib',
    'docs/snippet/code-block.snippet.md',
    'docs/snippet/whitespace.snippet.md',
  ],
  globals: {
    __VUEPRESS_VERSION__: 'readonly',
    __VUEPRESS_BASE__: 'readonly',
    __VUEPRESS_DEV__: 'readonly',
    __VUEPRESS_SSR__: 'readonly',
    __VUE_HMR_RUNTIME__: 'readonly',
    __VUE_OPTIONS_API__: 'readonly',
    __VUE_PROD_DEVTOOLS__: 'readonly',
  },
}, {
  files: ['**/*.vue'],
  rules: {
    'vue/no-v-text-v-html-on-component': 'off',
    'vue-a11y/click-events-have-key-events': 'off',
    'vue-a11y/no-static-element-interactions': 'off',
  },
}, {
  files: ['**/*.md/*.{js,ts}'],
  rules: {
    'import/no-duplicates': 'off',
    'import/first': 'off',
    'no-new': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'antfu/no-top-level-await': 'off',
  },
}, {
  files: [
    'docs/blog/1.示例/markdown基础.md',
    'docs/blog/4.教程/frontmatter.md',
    'docs/en/guide/markdown/basic.md',
    'docs/en/guide/chart/plantuml.md',
    'docs/en/blog/4.Tutorials/frontmatter.md',
    'docs/en/guide/markdown/env.md',
    'docs/guide/chart/plantuml.md',
    'docs/guide/markdown/annotation.md',
    'docs/guide/markdown/basic.md',
    'docs/guide/markdown/env.md',
  ].map(file => [file, `${file}/*.md`]).flat(),
  rules: {
    'markdown/no-unused-definitions': 'off',
    'markdown/no-duplicate-definitions': 'off',
    'markdown/no-multiple-h1': 'off',
    'markdown/no-space-in-emphasis': 'off',
    'markdown/no-missing-atx-heading-space': 'off',
  },
})
