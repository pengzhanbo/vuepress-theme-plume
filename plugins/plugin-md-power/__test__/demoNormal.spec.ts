import { describe, expect, it } from 'vitest'
import { parseEmbedCode } from '../src/node/demo/normal.js'

describe('parseEmbedCode', () => {
  it('should parse basic HTML code', () => {
    const code = '<div>Hello World</div>'
    const result = parseEmbedCode(code)

    expect(result.html).toBe('<div>Hello World</div>')
    expect(result.script).toBe('')
    expect(result.css).toBe('')
    expect(result.jsType).toBe('js')
    expect(result.cssType).toBe('css')
  })

  it('should parse HTML with script', () => {
    const code = `<div>Hello</div>
<script>
const message = 'Hello World'
</script>`
    const result = parseEmbedCode(code)

    expect(result.html?.trim()).toBe('<div>Hello</div>')
    expect(result.script?.trim()).toBe('const message = \'Hello World\'')
    expect(result.jsType).toBe('js')
  })

  it('should parse HTML with TypeScript script', () => {
    const code = `<div>Hello</div>
<script lang="ts">
const message: string = 'Hello World'
</script>`
    const result = parseEmbedCode(code)

    expect(result.jsType).toBe('ts')
    expect(result.script?.trim()).toBe('const message: string = \'Hello World\'')
  })

  it('should parse HTML with style', () => {
    const code = `<div class="container">Hello</div>
<style>
.container { color: red; }
</style>`
    const result = parseEmbedCode(code)

    expect(result.html?.trim()).toBe('<div class="container">Hello</div>')
    expect(result.css?.trim()).toBe('.container { color: red; }')
    expect(result.cssType).toBe('css')
  })

  it('should parse HTML with SCSS style', () => {
    const code = `<div>Hello</div>
<style lang="scss">
.container {
  .inner { color: red; }
}
</style>`
    const result = parseEmbedCode(code)

    expect(result.cssType).toBe('scss')
  })

  it('should parse HTML with Less style', () => {
    const code = `<div>Hello</div>
<style lang="less">
@color: red;
.container { color: @color; }
</style>`
    const result = parseEmbedCode(code)

    expect(result.cssType).toBe('less')
  })

  it('should parse HTML with Stylus style', () => {
    const code = `<div>Hello</div>
<style lang="stylus">
color = red
.container
  color color
</style>`
    const result = parseEmbedCode(code)

    expect(result.cssType).toBe('stylus')
  })

  it('should parse HTML with Stylus style (styl extension)', () => {
    const code = `<div>Hello</div>
<style lang="styl">
color = red
.container
  color color
</style>`
    const result = parseEmbedCode(code)

    expect(result.cssType).toBe('stylus')
  })

  it('should parse HTML with config', () => {
    const code = `<div>Hello</div>
<script type="config">
{
  "jsLib": ["https://cdn.example.com/lib.js"],
  "cssLib": ["https://cdn.example.com/style.css"]
}
</script>`
    const result = parseEmbedCode(code)

    expect(result.imports?.trim()).toContain('jsLib')
    expect(result.imports?.trim()).toContain('cssLib')
  })

  it('should parse complete code with all parts', () => {
    const code = `<div id="app">{{ message }}</div>
<script type="config">
{ "jsLib": ["vue"] }
</script>
<script lang="ts">
import { ref } from 'vue'
const message = ref<string>('Hello')
</script>
<style lang="scss">
#app { color: blue; }
</style>`
    const result = parseEmbedCode(code)

    expect(result.html?.trim()).toBe('<div id="app">{{ message }}</div>')
    expect(result.imports).toContain('vue')
    expect(result.jsType).toBe('ts')
    expect(result.cssType).toBe('scss')
  })

  it('should handle empty code', () => {
    const result = parseEmbedCode('')

    expect(result.html).toBe('')
    expect(result.script).toBe('')
    expect(result.css).toBe('')
  })

  it('should handle code with only whitespace', () => {
    const result = parseEmbedCode('   \n  \n  ')

    expect(result.html?.trim()).toBe('')
  })

  it('should handle unknown script lang as js', () => {
    const code = `<script lang="unknown">
console.log('test')
</script>`
    const result = parseEmbedCode(code)

    expect(result.jsType).toBe('js')
  })

  it('should handle unknown style lang as css', () => {
    const code = `<style lang="unknown">
.test { color: red }
</style>`
    const result = parseEmbedCode(code)

    expect(result.cssType).toBe('css')
  })
})
