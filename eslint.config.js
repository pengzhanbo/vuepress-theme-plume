import config from '@pengzhanbo/eslint-config-vue'

export default config({
  ignores: [
    'lib',
    'docs/notes/theme/snippet/code-block.snippet.md',
    'docs/notes/theme/snippet/whitespace.snippet.md',
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
})
