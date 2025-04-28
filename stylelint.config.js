import { stylelintConfig } from '@pengzhanbo/stylelint-config'

export default stylelintConfig({
  rules: {
    'custom-property-empty-line-before': null,
    'property-no-vendor-prefix': null,
    'selector-no-vendor-prefix': null,
    'declaration-block-no-redundant-longhand-properties': [true, {
      ignoreShorthands: ['inset'],
    }],
    'media-feature-range-notation': null,
    'color-function-notation': ['modern', {
      ignore: ['with-var-inside'],
    }],
  },
})
