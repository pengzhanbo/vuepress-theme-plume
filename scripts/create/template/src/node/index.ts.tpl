import { {{ lowerName }}Plugin } from './plugin.js'

export * from './plugin.js'
{{#if shared }}
export * from '../shared/index.js'
{{/if}}

export default {{ lowerName }}Plugin
