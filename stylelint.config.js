import { stylelintConfig } from '@pengzhanbo/stylelint-config'

export default stylelintConfig({
  rules: {
    'selector-pseudo-element-no-unknown': [true, {
      ignorePseudoElements: ['input-placeholder'],
    }],
    // 'no-descending-specificity': null,
    'custom-property-empty-line-before': null,
    'property-no-vendor-prefix': null,
    'selector-no-vendor-prefix': null,
    'property-no-unknown': [true, {
      ignoreProperties: ['r', 'font-named-instance'],
    }],
    'declaration-block-no-redundant-longhand-properties': [true, {
      ignoreShorthands: ['inset'],
    }],
    'media-feature-range-notation': null,
  },
})
