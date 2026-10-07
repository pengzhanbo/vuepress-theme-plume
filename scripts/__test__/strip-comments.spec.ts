import { describe, expect, it } from 'vitest'
import { strip, stripRegionComments } from '../strip-comments.js'

describe('strip', () => {
  it('drops regular single-line and multi-line comments', () => {
    const out = strip('// gone\nconst a = 1 /* gone */')

    expect(out).not.toContain('gone')
    expect(out).toContain('const a = 1')
  })

  it('keeps tree-shaking annotations', () => {
    expect(strip('/*#__PURE__*/createApp()')).toContain('/*#__PURE__*/')
    expect(strip('/* @__PURE__ */createApp()')).toContain('@__PURE__')
    expect(strip('/* @__NO_SIDE_EFFECTS__ */function f() {}')).toContain('@__NO_SIDE_EFFECTS__')
  })

  it('keeps dynamic-import ignore hints', () => {
    expect(strip('import(/* @vite-ignore */ url)')).toContain('@vite-ignore')
    expect(strip('import(/* webpackIgnore: true */ url)')).toContain('webpackIgnore')
    expect(strip('import(/* webpackChunkName: "chunk" */ "./a.js")')).toContain('webpackChunkName:')
  })

  it('keeps coverage ignore hints', () => {
    expect(strip('/* c8 ignore next */\nif (a) {}')).toContain('c8 ignore')
    expect(strip('/* v8 ignore next */\nif (a) {}')).toContain('v8 ignore')
  })
})

describe('stripRegionComments', () => {
  it('removes rolldown region markers but keeps the code', () => {
    const out = stripRegionComments('//#region a\nconst a = 1\n//#endregion\n')

    expect(out).toBe('const a = 1\n')
  })
})
