import { describe, expect, it } from 'vitest'

// Replicate the extractContentByHeadings logic for isolated testing
const HEADING_HASH_REG = /^#+/
const HEADING_ATTRS_REG = /(?:\{[^}]*\})?$/

interface ParsedHeading {
  lineIndex: number
  level: number
  text: string
}

function extractContentByHeadings(content: string, headings: string[]): string {
  if (!headings.length)
    return content

  const containers: Record<string, string> = {}

  content = content.replaceAll(/(?<mark>:{3,})[\s\S]*?\k<mark>/g, (matched) => {
    const key = `CONTAINER_${Object.keys(containers).length}`
    containers[key] = matched
    return `<!--container:${key}-->`
  })
  const lines = content.split(/\r?\n/)

  const allHeadings: ParsedHeading[] = []

  for (let i = 0; i < lines.length; i++) {
    let text = lines[i].trimEnd()
    let level = 0
    text = text.replace(HEADING_HASH_REG, (matched) => {
      level = matched.length
      return ''
    })
    if (level) {
      text = text.replace(HEADING_ATTRS_REG, '').trim()
      allHeadings.push({ lineIndex: i, level, text })
    }
  }

  let targetHeadingIndex = -1
  let currentLevel = 0
  let headingPointer = 0

  for (let i = 0; i < allHeadings.length; i++) {
    const heading = allHeadings[i]

    if (headingPointer === 0) {
      if (heading.text === headings[0]) {
        headingPointer++
        currentLevel = heading.level
        if (headingPointer === headings.length) {
          targetHeadingIndex = i
          break
        }
      }
    }
    else {
      if (heading.level > currentLevel && heading.text === headings[headingPointer]) {
        headingPointer++
        currentLevel = heading.level
        if (headingPointer === headings.length) {
          targetHeadingIndex = i
          break
        }
      }
      else if (heading.level <= currentLevel) {
        if (heading.text === headings[0]) {
          headingPointer = 1
          currentLevel = heading.level
        }
        else {
          headingPointer = 0
          currentLevel = 0
        }
      }
    }
  }

  if (targetHeadingIndex === -1) {
    return ''
  }

  const targetHeading = allHeadings[targetHeadingIndex]
  const startLine = targetHeading.lineIndex + 1
  const targetLevel = targetHeading.level

  let endLine = lines.length
  for (let i = targetHeadingIndex + 1; i < allHeadings.length; i++) {
    if (allHeadings[i].level <= targetLevel) {
      endLine = allHeadings[i].lineIndex
      break
    }
  }

  const result = lines.slice(startLine, endLine).join('\n').trim()

  return result.replaceAll(/<!--container:(.*?)-->/g, (_, key) => containers[key] ?? '')
}

describe('extractContentByHeadings', () => {
  it('should return full content when no headings specified', () => {
    const content = '# Title\n\nSome content here.'
    expect(extractContentByHeadings(content, [])).toBe(content)
  })

  it('should extract content under single heading', () => {
    const content = `# Title

Intro content.

## Section 1

Section 1 content.

## Section 2

Section 2 content.`

    expect(extractContentByHeadings(content, ['Section 1'])).toBe('Section 1 content.')
  })

  it('should extract content under nested heading', () => {
    const content = `# Title

## Level 2

### Level 3

Deep content.

## Back to Level 2

Other content.`

    expect(extractContentByHeadings(content, ['Level 2', 'Level 3'])).toBe('Deep content.')
  })

  it('should stop at sibling heading of same level', () => {
    const content = `# Title

## Section A

Content A.

## Section B

Content B.

### Nested in B

Nested content.`

    expect(extractContentByHeadings(content, ['Section A'])).toBe('Content A.')
    expect(extractContentByHeadings(content, ['Section B'])).toBe('Content B.\n\n### Nested in B\n\nNested content.')
  })

  it('should handle heading with attributes', () => {
    const content = `# Title

## Section {#id .class data=value}

Section content with attributes.`

    expect(extractContentByHeadings(content, ['Section'])).toBe('Section content with attributes.')
  })

  it('should preserve container syntax that appears within the extracted content', () => {
    const content = `## Section

::: info
Container content
:::

Content after container.`

    const result = extractContentByHeadings(content, ['Section'])
    expect(result).toContain('::: info')
    expect(result).toContain('Container content')
    expect(result).toContain('Content after container')
  })

  it('should handle multiple containers within extracted content', () => {
    const content = `## Section

::: info
First container
:::

::: warning
Second container
:::

Content.`

    const result = extractContentByHeadings(content, ['Section'])
    expect(result).toContain('::: info')
    expect(result).toContain('First container')
    expect(result).toContain('::: warning')
    expect(result).toContain('Second container')
  })

  it('should return empty string when heading not found', () => {
    const content = `# Title

## Section

Content.`

    expect(extractContentByHeadings(content, ['Nonexistent'])).toBe('')
  })

  it('should handle deeply nested structure', () => {
    const content = `# H1

## H2a

### H3a

H3a content.

### H3b

H3b content.

## H2b

H2b content.`

    expect(extractContentByHeadings(content, ['H2a', 'H3b'])).toBe('H3b content.')
    expect(extractContentByHeadings(content, ['H2a'])).toContain('H3a content')
    expect(extractContentByHeadings(content, ['H2a'])).toContain('H3b content')
    expect(extractContentByHeadings(content, ['H2a'])).not.toContain('H2b content')
  })

  it('should handle content with code blocks', () => {
    const content = `# Title

## Section

\`\`\`js
const x = 1;
\`\`\`

More content.`

    const result = extractContentByHeadings(content, ['Section'])
    expect(result).toContain('```js')
    expect(result).toContain('const x = 1;')
    expect(result).toContain('More content.')
  })

  it('should handle content with blockquotes', () => {
    const content = `# Title

## Section

> Blockquote text

Paragraph after.`

    const result = extractContentByHeadings(content, ['Section'])
    expect(result).toContain('> Blockquote text')
    expect(result).toContain('Paragraph after.')
  })

  it('should handle headings at different levels with same text', () => {
    const content = `# Title

## Summary

Summary content.

## Details

### Summary

Nested summary under details.

## Conclusion

Conclusion content.`

    // Should match first "Summary" at level 2
    expect(extractContentByHeadings(content, ['Summary'])).toBe('Summary content.')
  })

  it('should handle heading with trailing spaces', () => {
    const content = `# Title

## Section

Section content.`

    expect(extractContentByHeadings(content, ['Section'])).toBe('Section content.')
  })
})
