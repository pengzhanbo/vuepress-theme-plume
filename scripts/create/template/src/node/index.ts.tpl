import { {{ lowerName }}Plugin } from './plugin'

export * from './plugin'
{{#if shared }}
export * from '../shared'
{{/if}}

export default {{ lowerName }}Plugin
