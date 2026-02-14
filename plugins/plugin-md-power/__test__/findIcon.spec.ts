import { describe, expect, it } from 'vitest'
import { getFileIcon } from '../src/node/fileIcons/index.js'

describe('getFileIcon(filename, type)', () => {
  it('should find icon with default', () => {
    expect(getFileIcon('a.js')).toBe('vscode-icons:file-type-js')
    expect(getFileIcon('a.cjs')).toBe('vscode-icons:file-type-js')
    expect(getFileIcon('a.mjs')).toBe('vscode-icons:file-type-js')
    expect(getFileIcon('a.jsx')).toBe('vscode-icons:file-type-reactjs')
    expect(getFileIcon('a.ts')).toBe('vscode-icons:file-type-typescript')
    expect(getFileIcon('a.d.ts')).toBe('vscode-icons:file-type-typescript')
    expect(getFileIcon('a.cjs.map')).toBe('vscode-icons:file-type-jsmap')
    expect(getFileIcon('a.mjs.map')).toBe('vscode-icons:file-type-jsmap')

    expect(getFileIcon('vue')).toBe('vscode-icons:file-type-vue')
    expect(getFileIcon('Svelte')).toBe('vscode-icons:file-type-svelte')
  })

  it('should find icon with folder', () => {
    expect(getFileIcon('xxx', 'folder')).toBe('vscode-icons:default-folder')
    expect(getFileIcon('src', 'folder')).toBe('vscode-icons:folder-type-src')
    expect(getFileIcon('src/client', 'folder')).toBe('vscode-icons:folder-type-client')
  })

  it('should find icon with named file', () => {
    expect(getFileIcon('webpack.config.js')).toBe('vscode-icons:file-type-webpack')
    expect(getFileIcon('vite.config.mjs')).toBe('vscode-icons:file-type-vite')
    expect(getFileIcon('test/vitest.config.js')).toBe('vscode-icons:file-type-js')
  })

  it('should find icon with extensions', () => {
    expect(getFileIcon('a.cpp')).toBe('vscode-icons:file-type-cpp')
    expect(getFileIcon('a.spec.mjs')).toBe('vscode-icons:file-type-light-testjs')
  })

  it('should find icon with partials', () => {
    expect(getFileIcon('LICENSE')).toBe('vscode-icons:file-type-license')
    expect(getFileIcon('Gemfile')).toBe('vscode-icons:file-type-ruby')
  })

  it('should return default icon when not find', () => {
    expect(getFileIcon('a.abcxxx')).toBe('vscode-icons:default-file')
    expect(getFileIcon('a.abcxxx.tbnmmb.z')).toBe('vscode-icons:default-file')
    expect(getFileIcon('abc.', 'file')).toBe('vscode-icons:default-file')
    expect(getFileIcon('abc.', 'folder')).toBe('vscode-icons:default-folder')
    expect(getFileIcon('')).toBe('vscode-icons:default-file')
  })

  it('should handle common file types', () => {
    expect(getFileIcon('README.md')).toBeDefined()
    expect(getFileIcon('package.json')).toBeDefined()
    expect(getFileIcon('style.css')).toBeDefined()
    expect(getFileIcon('index.html')).toBeDefined()
  })

  it('should handle config files', () => {
    expect(getFileIcon('.gitignore')).toBeDefined()
    expect(getFileIcon('.eslintrc')).toBeDefined()
    expect(getFileIcon('tsconfig.json')).toBeDefined()
  })

  it('should handle image files', () => {
    expect(getFileIcon('image.png')).toBeDefined()
    expect(getFileIcon('image.jpg')).toBeDefined()
    expect(getFileIcon('image.svg')).toBeDefined()
    expect(getFileIcon('image.gif')).toBeDefined()
  })

  it('should handle files with path', () => {
    expect(getFileIcon('src/components/Button.vue')).toBe('vscode-icons:file-type-vue')
    expect(getFileIcon('/absolute/path/to/file.ts')).toBe('vscode-icons:file-type-typescript')
  })

  it('should handle files without extension', () => {
    expect(getFileIcon('Makefile')).toBeDefined()
    expect(getFileIcon('Dockerfile')).toBeDefined()
  })

  it('should handle hidden files', () => {
    expect(getFileIcon('.env')).toBeDefined()
    expect(getFileIcon('.npmrc')).toBeDefined()
  })
})
