import type { DemoFile, MarkdownDemoEnv } from '../../../shared/demo.js'

const SCRIPT_RE = /<script.*?>/

export function insertSetupScript({ export: name, path }: DemoFile, env: MarkdownDemoEnv): void {
  const imports = `import ${name ? `${name} from ` : ''}'${path}';`
  const scriptSetup = env.sfcBlocks!.scriptSetup ??= {
    type: 'script',
    content: '<script setup>\n</script>',
    contentStripped: '',
    tagOpen: '<script setup>',
    tagClose: '</script>',
  }
  scriptSetup.contentStripped = `${imports}\n${scriptSetup.contentStripped}`
  scriptSetup.content = scriptSetup.content.replace(SCRIPT_RE, matched => `${matched}\n${imports}`)
}
