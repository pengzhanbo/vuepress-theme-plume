import type { MarkdownEnv } from 'vuepress/markdown'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { calloutPlugin } from '../src/node/obsidian/callouts.js'

function createMockEnv(filePathRelative = 'test.md'): MarkdownEnv {
  return {
    filePathRelative,
    base: '/',
    links: [],
    importedFiles: [],
  }
}

function createMarkdown() {
  return new MarkdownIt({ html: true })
}

describe('calloutPlugin', () => {
  // ==================== Primary Callout Types ====================

  describe('primary callout types', () => {
    const types = ['note', 'tip', 'info', 'success', 'warning', 'caution', 'important', 'details']

    types.forEach((type) => {
      it(`should render ${type} callout`, () => {
        const md = createMarkdown().use(calloutPlugin)
        // Callout format: >[!type] title on same line, content on continuation lines with >
        const result = md.render(`>[!${type}]\n>\n> Content here.`)

        expect(result).toContain(`hint-container ${type}`)
        expect(result).toContain('Content here')
      })
    })

    it('should render note with quote and cite aliases', () => {
      const md = createMarkdown().use(calloutPlugin)

      const quoteResult = md.render('>[!quote]\n>\n> Content.')
      expect(quoteResult).toContain('hint-container note')

      const citeResult = md.render('>[!cite]\n>\n> Content.')
      expect(citeResult).toContain('hint-container note')
    })

    it('should render tip with hint alias', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!hint]\n>\n> Content.')
      expect(result).toContain('hint-container tip')
    })

    it('should render info with todo alias', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!todo]\n>\n> Content.')
      expect(result).toContain('hint-container info')
    })

    it('should render success with check and done aliases', () => {
      const md = createMarkdown().use(calloutPlugin)

      const checkResult = md.render('>[!check]\n>\n> Content.')
      expect(checkResult).toContain('hint-container success')

      const doneResult = md.render('>[!done]\n>\n> Content.')
      expect(doneResult).toContain('hint-container success')
    })

    it('should render warning with question, help, and faq aliases', () => {
      const md = createMarkdown().use(calloutPlugin)

      const questionResult = md.render('>[!question]\n>\n> Content.')
      expect(questionResult).toContain('hint-container warning')

      const helpResult = md.render('>[!help]\n>\n> Content.')
      expect(helpResult).toContain('hint-container warning')

      const faqResult = md.render('>[!faq]\n>\n> Content.')
      expect(faqResult).toContain('hint-container warning')
    })

    it('should render caution with multiple aliases', () => {
      const md = createMarkdown().use(calloutPlugin)
      const aliases = ['attention', 'failure', 'fail', 'missing', 'danger', 'error', 'bug']

      aliases.forEach((alias) => {
        const result = md.render(`>[!${alias}]\n>\n> Content.`)
        expect(result).toContain('hint-container caution')
      })
    })

    it('should render important with example alias', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!example]\n>\n> Content.')
      expect(result).toContain('hint-container important')
    })

    it('should render details with abstract, summary, and tldr aliases', () => {
      const md = createMarkdown().use(calloutPlugin)

      const abstractResult = md.render('>[!abstract]\n>\n> Content.')
      expect(abstractResult).toContain('hint-container details')

      const summaryResult = md.render('>[!summary]\n>\n> Content.')
      expect(summaryResult).toContain('hint-container details')

      const tldrResult = md.render('>[!tldr]\n>\n> Content.')
      expect(tldrResult).toContain('hint-container details')
    })
  })

  // ==================== Case Insensitivity ====================

  describe('case insensitivity', () => {
    it('should handle uppercase type', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!TIP]\n>\n> Content.')
      expect(result).toContain('hint-container tip')
    })

    it('should handle mixed case type', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!Tip]\n>\n> Content.')
      expect(result).toContain('hint-container tip')
    })

    it('should handle lowercase type', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> Content.')
      expect(result).toContain('hint-container tip')
    })
  })

  // ==================== Title Handling ====================

  describe('title handling', () => {
    it('should render custom title text', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip] Custom Title\n>\n> Content.')
      expect(result).toContain('Custom Title')
    })

    it('should render title with + prefix', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip] + Custom Title\n>\n> Content.')
      expect(result).toContain('Custom Title')
    })

    it('should render title with - prefix', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip] - Custom Title\n>\n> Content.')
      expect(result).toContain('Custom Title')
    })

    it('should use default capitalized type when no title', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> Content.')
      expect(result).toContain('Tip')
    })

    it('should render empty title with default', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip] \n>\n> Content.')
      expect(result).toContain('Tip')
    })
  })

  // ==================== Content Rendering ====================

  describe('content rendering', () => {
    it('should render single line content', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> Single line content.')
      expect(result).toContain('Single line content')
    })

    it('should render multi-line content', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> First paragraph.
>
> Second paragraph.`)
      expect(result).toContain('First paragraph')
      expect(result).toContain('Second paragraph')
    })

    it('should render nested list within callout', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> - Item 1
> - Item 2
> - Item 3`)
      expect(result).toContain('Item 1')
      expect(result).toContain('Item 2')
      expect(result).toContain('Item 3')
    })

    it('should render heading within callout', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> ### Nested Heading
>
> Content after heading.`)
      expect(result).toContain('Nested Heading')
      expect(result).toContain('Content after heading')
    })

    it('should render code block within callout', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> \`\`\`js
> const x = 1;
> \`\`\``)
      expect(result).toContain('const x = 1')
    })

    it('should parse content after callout correctly', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> Callout content.
>
After callout paragraph.

## Heading after

More content.`)

      expect(result).toContain('Callout content')
      expect(result).toContain('After callout paragraph')
      expect(result).toContain('Heading after')
    })
  })

  // ==================== Syntax Variations ====================

  describe('syntax variations', () => {
    it('should parse without space after >', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> Content.')
      expect(result).toContain('hint-container tip')
    })

    it('should parse with space after >', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('> [!tip]\n>\n> Content.')
      expect(result).toContain('hint-container tip')
    })

    it('should parse with multiple spaces', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>  [!tip]\n>\n> Content.')
      expect(result).toContain('hint-container tip')
    })

    it('should parse with tab after >', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>\t[!tip]\n>\n> Content.')
      expect(result).toContain('hint-container tip')
    })

    it('should handle tab with space alignment', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('  >\t  [!tip]\n>\n> Content.')
      expect(result).toContain('hint-container tip')
    })
  })

  // ==================== Block Parsing Edge Cases ====================

  describe('block parsing edge cases', () => {
    it('should terminate on empty line outside callout', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> Content.
>
> More content.

After callout.`)

      expect(result).toContain('Content')
      expect(result).toContain('More content')
      expect(result).toContain('After callout')
    })

    it('should terminate on outdented content', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> Content.
   outdented line`)

      expect(result).toContain('Content')
      expect(result).toContain('outdented line')
    })

    it('should handle outdented line as block terminator (line 265)', () => {
      // When the content line is outdented (sCount < blkIndent), the callout ends
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`1. List item
   >[!tip]
   >
   > Content.

2. Next item`)

      expect(result).toContain('Content')
      expect(result).toContain('Next item')
      expect(result).toContain('hint-container tip')
    })

    it('should terminate on horizontal rule', () => {
      const md = createMarkdown().use(calloutPlugin)
      // Using *** instead of - - - to ensure it's recognized as horizontal rule
      const result = md.render(`>[!tip]
>
> Content.
>
> ***`)

      expect(result).toContain('Content')
    })

    it('should terminate when terminator rule matches (lines 280-281)', () => {
      // The terminator rule for blockquote will match when the callout is properly terminated
      // by another blockquote-like structure
      const md = createMarkdown().use(calloutPlugin)
      // After the horizontal rule, the content below should be separate
      const result = md.render(`>[!tip]
>
> Content.

---

After horizontal rule.`)

      expect(result).toContain('Content')
      expect(result).toContain('After horizontal rule')
    })

    it('should handle list terminator correctly (lines 280-281)', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> Callout content.
>
> 1. Ordered list inside`)

      expect(result).toContain('Callout content')
      expect(result).toContain('Ordered list inside')
    })

    it('should terminate on list item', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> Content.
>
> 1. Ordered item`)

      expect(result).toContain('Content')
    })

    it('should handle continuation after blockquote in list', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`1. List item
   >[!tip]
   >
   > Content in callout.
   >
   > More content.

2. Next list item`)

      expect(result).toContain('Content in callout')
      expect(result).toContain('More content')
      expect(result).toContain('Next list item')
    })

    it('should restore state correctly when blkIndent !== 0 (lines 290-304)', () => {
      // When callout is in a list item (non-zero blkIndent) and is terminated
      // by another block, the blkIndent adjustment should be restored
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`1. List item
   >[!tip]
   >
   > Callout content.
   >
   > ---`)

      expect(result).toContain('Callout content')
      expect(result).toContain('hint-container tip')
    })

    it('should handle nested blockquote in callout', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> > Nested quote
>
> Content after nested.`)
      expect(result).toContain('Nested quote')
      expect(result).toContain('Content after nested')
    })

    it('should handle callout with proper terminator restoration', () => {
      // Test for lines 290-304: blkIndent restoration when terminated by other block
      // This requires the callout to be inside a list with non-zero blkIndent
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`1. List item
   >[!tip]
   >
   > Callout content.
   >
   > More content.
   >
   > - - -

2. Next item`)

      expect(result).toContain('Callout content')
      expect(result).toContain('More content')
      expect(result).toContain('hint-container tip')
      expect(result).toContain('Next item')
    })
  })

  // ==================== Invalid Syntax ====================

  describe('invalid syntax', () => {
    it('should not parse unknown type', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!unknown]\n>\n> Content.')
      expect(result).not.toContain('hint-container')
      expect(result).toContain('Content')
    })

    it('should not parse empty type', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[]\n>\n> Content.')
      expect(result).not.toContain('hint-container')
    })

    it('should not parse incomplete syntax without closing bracket', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip\n>\n> Content.')
      expect(result).not.toContain('hint-container')
    })

    it('should not parse without opening bracket', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>!tip]\n>\n> Content.')
      expect(result).not.toContain('hint-container')
    })

    it('should not parse without > marker', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('[!tip]\n>\n> Content.')
      expect(result).not.toContain('hint-container')
    })

    it('should not parse when indented more than 3 spaces (becomes code)', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('    >[!tip]\n>\n> Content.')
      expect(result).not.toContain('hint-container')
      expect(result).toContain('<code')
    })

    it('should return false when sCount - blkIndent >= 4 (line 44)', () => {
      // Line 44: if sCount - blkIndent >= 4, return false
      // This would happen when a line is deeply indented beyond the block indent
      // In practice, blkIndent tracks sCount in list contexts, making this hard to trigger
      // We test with a deeply indented block that exceeds normal block processing
      const md = createMarkdown().use(calloutPlugin)
      // This scenario exercises the code path even if the exact condition is hard to isolate
      const result = md.render('>     [!tip]\n>\n> Content.')
      // With 5 spaces after >, offset-initial=4 triggers line 96 first
      // But the overall block parsing exercises related code paths
      expect(result).not.toContain('hint-container')
    })

    it('should not parse type only without brackets', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>tip]\n>\n> Content.')
      expect(result).not.toContain('hint-container')
    })

    it('should not parse empty callout', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]')
      expect(result).not.toContain('hint-container')
    })

    it('should not parse callout with only empty continuation lines', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
>`)
      expect(result).not.toContain('hint-container')
    })

    it('should return false when offset - initial >= 4 (line 96)', () => {
      // Line 96: offset - initial >= 4 means 4+ spaces after > before the callout type
      // >     [!tip] has 5 spaces after >, so offset - initial = 4 >= 4, returns false
      // This causes it to be treated as a code block within blockquote
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>     [!tip]\n>\n> Content.')
      expect(result).not.toContain('hint-container')
      // It should be treated as blockquote with code-like content
      expect(result).toContain('<code')
      expect(result).toContain('[!tip]')
    })
  })

  // ==================== Special Type: details ====================

  describe('details type rendering', () => {
    it('should render details as details element', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!details]\n>\n> Content.')
      expect(result).toContain('<details')
      expect(result).toContain('</details>')
      expect(result).toContain('<summary')
      expect(result).toContain('</summary>')
    })

    it('should not use div for details type', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!details]\n>\n> Content.')
      expect(result).not.toContain('<div class="hint-container details"')
    })

    it('should render summary tag for details title', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!details] Summary Title\n>\n> Content.')
      expect(result).toContain('<summary')
      expect(result).toContain('Summary Title')
    })

    it('should render details with other aliases', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!abstract]\n>\n> Content.')
      expect(result).toContain('<details')
      expect(result).toContain('<summary')
    })
  })

  // ==================== Default Rendering Structure ====================

  describe('rendering structure', () => {
    it('should render alert_open with correct class', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> Content.')
      expect(result).toContain('hint-container tip')
    })

    it('should render alert_title with correct class', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip] Title\n>\n> Content.')
      expect(result).toContain('hint-container-title')
    })

    it('should render opening and closing tags', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> Content.')
      expect(result).toContain('<div')
      expect(result).toContain('</div>')
    })

    it('should render hint-container class', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> Content.')
      expect(result).toContain('hint-container')
    })
  })

  // ==================== Locale Support ====================

  describe('locale support', () => {
    it('should use default type name when no locale match', () => {
      const md = createMarkdown().use(calloutPlugin, {
        locales: {},
      })
      const result = md.render('>[!tip]\n>\n> Content.')
      expect(result).toContain('Tip')
    })

    it('should use custom locale title when provided', () => {
      const md = createMarkdown().use(calloutPlugin, {
        locales: {
          '/': {
            tip: 'Custom Tip Title',
          },
        },
      })
      const result = md.render('>[!tip]\n>\n> Content.', createMockEnv('/'))
      expect(result).toContain('Custom Tip Title')
    })

    it('should use locale for specific path', () => {
      const md = createMarkdown().use(calloutPlugin, {
        locales: {
          '/zh/': {
            tip: '提示',
          },
        },
      })
      const result = md.render('>[!tip]\n>\n> Content.', createMockEnv('zh/guide.md'))
      expect(result).toContain('提示')
    })

    it('should prefer custom locale over default', () => {
      const md = createMarkdown().use(calloutPlugin, {
        locales: {
          '/': {
            tip: 'Default Tip',
          },
          '/zh/': {
            tip: '中文提示',
          },
        },
      })

      const defaultResult = md.render('>[!tip]\n>\n> Content.', createMockEnv('guide.md'))
      expect(defaultResult).toContain('Default Tip')

      const zhResult = md.render('>[!tip]\n>\n> Content.', createMockEnv('zh/guide.md'))
      expect(zhResult).toContain('中文提示')
    })

    it('should handle locale without matching type', () => {
      const md = createMarkdown().use(calloutPlugin, {
        locales: {
          '/': {
            note: 'Note Title',
          },
        },
      })
      const result = md.render('>[!tip]\n>\n> Content.')
      // Should still use capitalized type as fallback
      expect(result).toContain('Tip')
    })
  })

  // ==================== Edge Cases ====================

  describe('edge cases', () => {
    it('should handle callout at beginning of document', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> First content.

Second paragraph.`)
      expect(result).toContain('First content')
      expect(result).toContain('Second paragraph')
    })

    it('should handle multiple callouts in sequence', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> Tip content.

>[!warning]
>
> Warning content.

>[!note]
>
> Note content.`)

      expect(result).toContain('hint-container tip')
      expect(result).toContain('Tip content')
      expect(result).toContain('hint-container warning')
      expect(result).toContain('Warning content')
      expect(result).toContain('hint-container note')
      expect(result).toContain('Note content')
    })

    it('should handle empty lines within callout', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> Line 1.
>
>
> Line 2.`)

      expect(result).toContain('Line 1')
      expect(result).toContain('Line 2')
    })

    it('should handle adjacent callouts without blank line', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> First.
>[!note]
>
> Second.`)

      expect(result).toContain('First')
      expect(result).toContain('Second')
    })

    it('should not interfere with regular blockquotes', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`> Regular blockquote
>
> Another line.`)

      expect(result).not.toContain('hint-container')
      expect(result).toContain('Regular blockquote')
    })

    it('should handle indented callout in list', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`- List item
  >[!tip]
  >
  > Indented callout.`)

      expect(result).toContain('hint-container tip')
      expect(result).toContain('Indented callout')
    })

    it('should handle unicode in title', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip] 中文标题\n>\n> Content.')
      expect(result).toContain('中文标题')
    })

    it('should handle emoji in title', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip] 🚀 Launch\n>\n> Content.')
      expect(result).toContain('🚀')
      expect(result).toContain('Launch')
    })
  })

  // ==================== Inline Content Rendering ====================

  describe('inline content rendering', () => {
    it('should render inline code in content', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> Use `code` inline.')
      expect(result).toContain('<code>code</code>')
    })

    it('should render links in content', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> Check [this](https://example.com).')
      expect(result).toContain('<a href="https://example.com"')
    })

    it('should render emphasis in content', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> This is *italic* and **bold**.')
      expect(result).toContain('<em>italic</em>')
      expect(result).toContain('<strong>bold</strong>')
    })

    it('should render strikethrough in content', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render('>[!tip]\n>\n> ~~Deleted~~ text.')
      expect(result).toContain('<s>Deleted</s>')
    })
  })

  // ==================== Code Block Type Detection ====================

  describe('code block type detection', () => {
    it('should detect as code block when indented 4+ spaces', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`    >[!tip] Title
>
> Content.`)

      expect(result).toContain('<code')
      expect(result).not.toContain('hint-container')
    })
  })

  describe('sCount - blkIndent >= 4', () => {
    it('should return false when deeply indented and code rule is disabled', () => {
      const md = createMarkdown().use(calloutPlugin)
      md.block.ruler.disable('code')
      const result = md.render('    >[!tip]\n>\n> Content.')

      expect(result).not.toContain('hint-container')
    })

    it('should return false when deeply indented inside list with code rule disabled', () => {
      const md = createMarkdown().use(calloutPlugin)
      md.block.ruler.disable('code')
      const result = md.render(`- Item
      >[!tip]
      >
      > Content`)

      expect(result).not.toContain('hint-container tip')
    })
  })

  describe('isOutdented break inside list', () => {
    it('should break when body line is outdented from list context', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`- Item
  >[!tip]
  >
  > Content
Outdented line`)

      expect(result).toContain('hint-container tip')
      expect(result).toContain('Content')
      expect(result).toContain('Outdented line')
    })

    it('should break when callout body reaches line outside list indent', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`1. Item
   >[!warning]
   >
   > Content
Outside list`)

      expect(result).toContain('hint-container warning')
      expect(result).toContain('Content')
      expect(result).toContain('Outside list')
    })
  })

  describe('terminator rule matches', () => {
    it('should terminate callout when horizontal rule follows without blank line', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> Content
---`)

      expect(result).toContain('hint-container tip')
      expect(result).toContain('Content')
      expect(result).toContain('<hr')
    })

    it('should terminate callout when ATX heading follows without blank line', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> Content
## Heading`)

      expect(result).toContain('hint-container tip')
      expect(result).toContain('Content')
      expect(result).toContain('Heading')
    })

    it('should terminate callout when fence block follows without blank line', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`>[!tip]
>
> Content
\`\`\`js
code
\`\`\``)

      expect(result).toContain('hint-container tip')
      expect(result).toContain('Content')
      expect(result).toContain('<code')
    })
  })

  describe('blkIndent !== 0 when terminated', () => {
    it('should adjust sCount when callout in list is terminated by hr', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`- Item
  >[!tip]
  >
  > Content
  ---`)

      expect(result).toContain('hint-container tip')
      expect(result).toContain('Content')
    })

    it('should adjust sCount when callout in ordered list is terminated by hr', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`1. Item
   >[!caution]
   >
   > Content
   ---`)

      expect(result).toContain('hint-container caution')
      expect(result).toContain('Content')
    })

    it('should handle callout in list terminated by fence', () => {
      const md = createMarkdown().use(calloutPlugin)
      const result = md.render(`- Item
  >[!note]
  >
  > Content
  \`\`\`
  code
  \`\`\``)

      expect(result).toContain('hint-container note')
      expect(result).toContain('Content')
    })
  })
})
