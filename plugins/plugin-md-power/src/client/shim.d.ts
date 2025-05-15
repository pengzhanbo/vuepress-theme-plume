import type { ReplEditorData } from '../shared/repl.js'

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const comp: ComponentOptions
  export default comp
}

declare module '@internal/md-power/replEditorData' {

  const res: ReplEditorData
  export default res
}

declare global {

  const __MD_POWER_INJECT_OPTIONS__: MarkdownPowerPluginOptions
  const __MD_POWER_DASHJS_INSTALLED__: boolean
  const __MD_POWER_HLSJS_INSTALLED__: boolean
  const __MD_POWER_MPEGTSJS_INSTALLED__: boolean

}
