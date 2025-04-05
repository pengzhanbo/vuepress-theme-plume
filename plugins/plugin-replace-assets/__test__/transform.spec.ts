import { describe, expect, it, vi } from 'vitest'
import { normalizeRules } from '../src/normalizeRules.js'
import { isMatchUrl, replacementAssetWithRules, transformAssets } from '../src/unplugin/transform.js'
import { createAssetPattern } from '../src/unplugin/utils.js'

describe('plugin-replace-assets > isMatchUrl', () => {
  it.each([
    {
      name: 'string like regexp with ^ and $',
      find: '^/images/.*\.(jpe?g|png|gif|svg)(\\?.*)?$',
      expects: [
        ['/images/foo.jpg', true],
        ['/images/foo.png', true],
        ['/images/foo.gif', true],
        ['/images/foo.svg', true],
        ['/images/foo.jpg?a=1', true],
        ['/images/foo.txt', false],
        ['/medias/foo.mp4', false],
      ] as const,
    },
    {
      name: 'string like regexp start with ^',
      find: '^/medias/',
      expects: [
        ['/medias/foo.mp4', true],
        ['/medias/foo.ogg', true],
        ['/medias/foo.ogv', true],
        ['/medias/foo.webm', true],
        ['/images/foo.jpg', false],
      ] as const,
    },
    {
      name: 'string like regexp end with $',
      find: '\.(jpe?g|png|gif|svg)$',
      expects: [
        ['/images/foo.jpg', true],
        ['/images/foo.png', true],
        ['/images/foo.gif', true],
        ['/images/foo.svg', true],
        ['/images/foo.txt', false],
        ['/medias/foo.mp4', false],
      ] as const,
    },
    {
      name: 'string start width pathname',
      find: '/images/',
      expects: [
        ['/images/foo.jpg', true],
        ['/images/foo.png', true],
        ['/images/foo.gif', true],
        ['/images/foo', true],
        ['/medias/foo.mp4', false],
      ] as const,
    },
    {
      name: 'string end width extension',
      find: '.jpg',
      expects: [
        ['/images/foo.jpg', true],
        ['/images/foo.png', false],
        ['/images/foo.gif', false],
        ['/images/foo', false],
        ['/medias/foo.mp4', false],
      ] as const,
    },
    {
      name: 'regexp',
      find: /^\/images\/.*\.(jpe?g|png|gif|svg)$/,
      expects: [
        ['/images/foo.jpg', true],
        ['/images/foo.png', true],
        ['/images/foo.gif', true],
        ['/images/foo.svg', true],
        ['/images/foo.txt', false],
        ['/medias/foo.mp4', false],
      ] as const,
    },
  ])('$name', ({ find, expects }) => {
    for (const [url, expected] of expects) {
      expect(isMatchUrl(find, url)).toBe(expected)
    }
  })
})

describe('plugin-replace-assets > replacementAssetWithRules', () => {
  const IMAGE_SUPPORTED = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif']
  const MEDIA_SUPPORTED = ['mp4', 'webm', 'ogg', 'mp3', 'wav', 'flac', 'aac', 'm3u8', 'm3u', 'flv', 'pdf']
  const replacementFn = vi.fn(url => `https://example.com/assets${url}`)

  it.each([
    {
      name: 'string replacement',
      rules: normalizeRules('https://example.com/assets/'),
      expects: [
        // images
        ...IMAGE_SUPPORTED.map(ext => [
          `/images/foo.${ext}`,
          `https://example.com/assets/images/foo.${ext}`,
        ]),
        // media
        ...MEDIA_SUPPORTED.map(ext => [
          `/medias/foo.${ext}`,
          `https://example.com/assets/medias/foo.${ext}`,
        ]),
        // have query string
        ['/images/foo.jpg?a=1', 'https://example.com/assets/images/foo.jpg?a=1'],
        // cached images
        ['/images/foo.jpg', 'https://example.com/assets/images/foo.jpg'],
        // no supported
        ['/images/foo.txt', undefined],
        ['/medias/foo', undefined],
      ] as const,
    },
    {
      name: 'function replacement',
      rules: normalizeRules(replacementFn),
      expects: [
        // images
        ...IMAGE_SUPPORTED.map(ext => [
          `/images-1/foo.${ext}`,
          `https://example.com/assets/images-1/foo.${ext}`,
        ]),
        // media
        ...MEDIA_SUPPORTED.map(ext => [
          `/medias-1/foo.${ext}`,
          `https://example.com/assets/medias-1/foo.${ext}`,
        ]),
        // have query string
        ['/images-1/foo.jpg?a=1', 'https://example.com/assets/images-1/foo.jpg?a=1'],
        // cached images
        ['/images-1/foo.jpg', 'https://example.com/assets/images-1/foo.jpg'],
        // no supported
        ['/images-1/foo.txt', undefined],
        ['/medias-1/foo', undefined],
      ] as const,
    },
  ])('$name', ({ name, rules, expects }) => {
    for (const [url, expected] of expects) {
      expect(replacementAssetWithRules(rules, url)).toBe(expected)
    }
    if (name === 'function replacement') {
      // should not called with cached, and not called with no supported
      expect(replacementFn).toBeCalledTimes(expects.length - 3)
    }
  })
})

describe('plugin-replace-assets > transformAssets', () => {
  const rules = normalizeRules('https://example.com/assets/')
  const pattern = createAssetPattern('/[^/]')

  it('should work with like html', () => {
    const source = `\
<img src="/images/foo.jpg" />
<img src="/images/foo.png" />
<img src="/images/foo.gif" />
<img src="/images/foo.svg" />
<img src="/images/foo.txt" />
<img src="/medias/foo.mp4" />

<img src="/images/foo.jpg?a=1" />

<img src="https://not-replace.com/images/foo.jpg" />

<video src="/medias/foo.mp4" />
<audio src="/medias/foo.mp3" />

<embed src="/medias/foo.pdf" />
`
    expect(transformAssets(source, pattern, rules)).toMatchSnapshot()
  })

  it('should work with like css', () => {
    const source = `\
.foo {
  background-image: url("/images/foo.jpg");
  background-image: url("/images/foo.png");
  background-image: url("/images/foo.gif");
  background-image: url("/images/foo.svg");
  background-image: url("/medias/foo.mp4");

  background-image: url('/images/foo.jpg');
  background-image: url(/images/foo.png);

  background-image: url("/images/foo.jpg?a=1");

  background-image: url("https://not-replace.com/images/foo.jpg");

  background: url('/images/foo.png');

}
`
    expect(transformAssets(source, pattern, rules)).toMatchSnapshot()
  })

  it('should work with like js', () => {
    const source = `\
  const a = "/images/foo.jpg"
  const b = '/images/foo.jpg'
  const c = '/images/foo.jpg?a=1'
  const d = "https://not-replace.com/images/foo.jpg"

  const json_string = JSON.parse("{\\"a\\":\\"/images/foo.jpg\\"}")
`

    expect(transformAssets(source, pattern, rules)).toMatchSnapshot()
  })

  it('should work with no match', () => {
    const source = `\
<video src="./medias/foo.mp4" />
<img src="https://not-replace.com/images/foo.jpg" />

const a = "images/foo.jpg"
`
    expect(transformAssets(source, pattern, rules)).toBe(source)
  })
})
