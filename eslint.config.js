import config from '@pengzhanbo/eslint-config-vue'

export default config({
  // todo: 正则校验
  // 当前项目中的 正则 还并不能完全通过 规则，存在 53 个问题
  // 但处理起来比较麻烦，因此将会作为一项比较长期的工作来完成。
  regexp: false,
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
  },
})
