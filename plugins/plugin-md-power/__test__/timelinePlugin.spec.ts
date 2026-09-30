import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { extractTimelineAttributes, timelinePlugin } from '../src/node/container/timeline.js'

describe('timeline > extractTimelineAttributes()', () => {
  it('should work', () => {
    const meta = extractTimelineAttributes('这time=Q1')
    expect(meta).toEqual({ time: 'Q1' })
  })

  it('should work with multi attrs', () => {
    const meta = extractTimelineAttributes('time=Q1 icon=ri:clockwise-line card=true placement=left line=dashed')
    expect(meta).toEqual({ time: 'Q1', icon: 'ri:clockwise-line', card: 'true', placement: 'left', line: 'dashed' })
  })

  it('should work with title include space', () => {
    const meta = extractTimelineAttributes('time=Q1 icon=ri:clockwise-line card=true placement=left line=dashed')

    expect(meta).toEqual({ time: 'Q1', icon: 'ri:clockwise-line', card: 'true', placement: 'left', line: 'dashed' })
  })

  it('should work with unknown attr', () => {
    const meta = extractTimelineAttributes('time=Q1 unknown=true card=true')
    expect(meta).toEqual({ time: 'Q1' })
  })
})

describe('timeline > timelinePlugin()', () => {
  const md = new MarkdownIt()
  timelinePlugin(md)

  it('should work', () => {
    const source = `\
::: timeline
- 这是标题

  这是内容

- 这是标题
  这也是标题

  这是内容
:::

::: timeline horizontal line="dashed" card
- 这是标题
  time=q1

  这是内容
  - 1
  - 2
  - 3
    - 1.1
    - 1.2

- 这是标题
  time=q2 color=red card=false

  这是内容
:::

::: timeline placement="right"
- 这是标题
  icon=xxx card=true type=warning

  这是内容

- 这是标题
  type=danger line=dotted

  这是内容
:::

::: timeline placement="between"
- 这是标题
  card=true placement=right

  这是内容

- 这是标题
  card=true placement=left

  这是内容

- 这是标题

  这是内容
:::
`
    expect(md.render(source)).toMatchSnapshot()
  })

  it('should not break when a list item starts with a nested list', () => {
    const source = `\
::: timeline
-
  - 嵌套列表

- 正常标题

  这是内容
:::
`
    const html = md.render(source)

    // 首块为嵌套列表的项没有标题段落，应安全降级而非抛错；
    // 只有带标题段落的项会生成标题插槽。
    // An item whose first block is a nested list has no title paragraph and must
    // degrade safely; only the item with a title paragraph renders a title slot.
    expect(html.match(/<template #title>/g)).toHaveLength(1)
    expect(html).toContain('嵌套列表')
  })
})
