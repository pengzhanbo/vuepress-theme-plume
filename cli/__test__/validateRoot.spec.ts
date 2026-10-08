import { describe, expect, it } from 'vitest'
import { normalizeRoot, validateRoot } from '../src/prompt.js'

describe('validateRoot', () => {
  it('should accept relative paths within the working directory', () => {
    expect(validateRoot('docs')).toBeUndefined()
    expect(validateRoot('./docs')).toBeUndefined()
    expect(validateRoot('my-project')).toBeUndefined()
    expect(validateRoot('packages/docs')).toBeUndefined()
  })

  it('should accept the current directory and nested relative paths', () => {
    // `init .` / `init ./` 指向当前目录，是合法输入；由 `normalizeRoot` 负责归一化。
    // `init .` / `init ./` target the current directory, which is valid input;
    // `normalizeRoot` is responsible for normalizing it.
    expect(validateRoot('.')).toBeUndefined()
    expect(validateRoot('./')).toBeUndefined()
    expect(validateRoot('a/b/c')).toBeUndefined()
    expect(validateRoot('./a/b/c/')).toBeUndefined()
  })

  it('should accept empty values', () => {
    expect(validateRoot()).toBeUndefined()
    expect(validateRoot('')).toBeUndefined()
  })

  it('should reject absolute paths', () => {
    expect(validateRoot('/tmp/evil')).toBe('hint.root')
    expect(validateRoot('/')).toBe('hint.root')
  })

  it('should reject parent path segments', () => {
    expect(validateRoot('..')).toBe('hint.root')
    expect(validateRoot('../evil')).toBe('hint.root')
    expect(validateRoot('../../evil')).toBe('hint.root')
    expect(validateRoot('foo/../../etc')).toBe('hint.root')
  })

  it('should reject windows style parent path segments', () => {
    expect(validateRoot('..\\evil')).toBe('hint.root')
    expect(validateRoot('foo\\..\\bar')).toBe('hint.root')
  })

  it('should reject whitespace', () => {
    expect(validateRoot('my docs')).toBe('hint.root.whitespace')
    expect(validateRoot('my project/docs')).toBe('hint.root.whitespace')
    expect(validateRoot('docs ')).toBe('hint.root.whitespace')
    expect(validateRoot(' docs')).toBe('hint.root.whitespace')
  })

  it('should reject illegal characters', () => {
    expect(validateRoot('foo<bar')).toBe('hint.root.illegal')
    expect(validateRoot('foo>bar')).toBe('hint.root.illegal')
    expect(validateRoot('foo|bar')).toBe('hint.root.illegal')
    expect(validateRoot('foo*bar')).toBe('hint.root.illegal')
    expect(validateRoot('foo:bar')).toBe('hint.root.illegal')
    expect(validateRoot('foo?bar')).toBe('hint.root.illegal')
  })
})

describe('normalizeRoot', () => {
  it('should treat ./ and . as the current directory', () => {
    // 回归：`init ./` 曾归一化为空字符串，导致生成不可运行的项目。
    // Regression: `init ./` used to normalize to an empty string, which
    // produced an unrunnable project.
    expect(normalizeRoot('./')).toBe('.')
    expect(normalizeRoot('.')).toBe('.')
    expect(normalizeRoot('')).toBe('.')
    expect(normalizeRoot('.//')).toBe('.')
  })

  it('should strip a leading ./ and trailing separators', () => {
    expect(normalizeRoot('./docs')).toBe('docs')
    expect(normalizeRoot('./docs/')).toBe('docs')
    expect(normalizeRoot('docs/')).toBe('docs')
    expect(normalizeRoot('a/b/c/')).toBe('a/b/c')
  })

  it('should keep nested paths and dot-directories intact', () => {
    expect(normalizeRoot('a/b/c')).toBe('a/b/c')
    // 只剥离 `./` 前缀，不应吞掉 `.hidden` 这类目录名的首字符。
    // Only the `./` prefix is stripped; the leading dot of a directory such as
    // `.hidden` must not be consumed.
    expect(normalizeRoot('.hidden')).toBe('.hidden')
    expect(normalizeRoot('.vuepress/docs')).toBe('.vuepress/docs')
  })
})
