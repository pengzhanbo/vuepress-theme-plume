import { describe, expect, it } from 'vitest'
import { interopDefault } from '../src/node/utils/package.js'

describe('interopDefault', () => {
  it('should return default export if exists', async () => {
    const module = { default: { name: 'test' }, other: 'value' }
    const result = await interopDefault(Promise.resolve(module))
    expect(result).toEqual({ name: 'test' })
  })

  it('should return module itself if no default export', async () => {
    const module = { name: 'test', value: 123 }
    const result = await interopDefault(Promise.resolve(module))
    expect(result).toEqual({ name: 'test', value: 123 })
  })

  it('should handle non-object default', async () => {
    const module = { default: 'string value' }
    const result = await interopDefault(Promise.resolve(module))
    expect(result).toBe('string value')
  })

  it('should handle function default', async () => {
    const fn = () => 'function result'
    const module = { default: fn }
    const result = await interopDefault(Promise.resolve(module))
    expect(result).toBe(fn)
    expect(result()).toBe('function result')
  })

  it('should handle primitive values', async () => {
    const result = await interopDefault(Promise.resolve(42))
    expect(result).toBe(42)
  })

  it('should handle string values', async () => {
    const result = await interopDefault(Promise.resolve('hello'))
    expect(result).toBe('hello')
  })

  it('should handle array values', async () => {
    const arr = [1, 2, 3]
    const result = await interopDefault(Promise.resolve(arr))
    expect(result).toEqual([1, 2, 3])
  })

  it('should handle nested object default', async () => {
    const module = {
      default: {
        nested: {
          deep: 'value',
        },
      },
    }
    const result = await interopDefault(Promise.resolve(module))
    expect(result).toEqual({ nested: { deep: 'value' } })
  })

  it('should handle class as default', async () => {
    class TestClass {
      value = 'test'
    }
    const module = { default: TestClass }
    const result = await interopDefault(Promise.resolve(module))
    expect(result).toBe(TestClass)
    // eslint-disable-next-line new-cap
    expect(new result().value).toBe('test')
  })

  it('should return module for falsy default values', async () => {
    const module = { default: 0 }
    const result = await interopDefault(Promise.resolve(module))
    expect(result).toEqual({ default: 0 })
  })

  it('should return module for empty string default', async () => {
    const module = { default: '' }
    const result = await interopDefault(Promise.resolve(module))
    expect(result).toEqual({ default: '' })
  })

  it('should return module for false as default', async () => {
    const module = { default: false }
    const result = await interopDefault(Promise.resolve(module))
    expect(result).toEqual({ default: false })
  })

  it('should return module for null as default', async () => {
    const module = { default: null }
    const result = await interopDefault(Promise.resolve(module))
    expect(result).toEqual({ default: null })
  })
})
