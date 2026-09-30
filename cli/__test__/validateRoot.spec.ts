import { describe, expect, it } from 'vitest'
import { validateRoot } from '../src/prompt.js'

describe('validateRoot', () => {
  it('should accept relative paths within the working directory', () => {
    expect(validateRoot('docs')).toBeUndefined()
    expect(validateRoot('./docs')).toBeUndefined()
    expect(validateRoot('my-project')).toBeUndefined()
    expect(validateRoot('packages/docs')).toBeUndefined()
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

  it('should reject illegal characters', () => {
    expect(validateRoot('foo<bar')).toBe('hint.root.illegal')
    expect(validateRoot('foo>bar')).toBe('hint.root.illegal')
    expect(validateRoot('foo|bar')).toBe('hint.root.illegal')
    expect(validateRoot('foo*bar')).toBe('hint.root.illegal')
    expect(validateRoot('foo:bar')).toBe('hint.root.illegal')
    expect(validateRoot('foo?bar')).toBe('hint.root.illegal')
  })
})
