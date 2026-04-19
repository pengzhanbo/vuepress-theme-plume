---
url: /en/guide/markdown/qrcode/index.md
---
@[qrcode](https://github.com/pengzhanbo/vuepress-theme-plume)

## Overview

In Markdown, you can embed QR code images generated from text using simple syntax, allowing them to be scanned when needed.

The text can be:

* A remotely accessible link address
* A path to a `.md` file within the VuePress site *(both absolute and relative paths are supported)*
* Any plain text *(avoid overly long text)*

## Configuration

This feature is disabled by default. You need to enable it in the `theme` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      qrcode: true, // [!code ++]
    }
  })
})
```

## Syntax

### Inline Syntax

Inline syntax is suitable for shorter `text`, such as links.

```md
<!-- Basic Syntax -->
@[qrcode](text)
<!-- With Attributes -->
@[qrcode card svg title="xxx" align="center"](text)
```

### Container Syntax

Container syntax is suitable for longer `text`, such as paragraphs or multi-line text.

```md
::: qrcode card svg title="xxx" align="center"
text
:::
```

::: warning QR codes generated from overly long text may be truncated and potentially unscannable.
:::

## Attributes

:::: field-group
::: field name="card" type="boolean" optional default="false"
Whether to enable the card style.
:::
::: field name="svg" type="boolean" optional default="false"
Whether to render the QR code in SVG format. The default format is PNG.
:::
::: field name="title" type="string" optional
The title of the QR code.
:::
::: field name="align" type="'left' | 'center' | 'right'" optional default="left"
The alignment of the QR code.
:::
::: field name="width" type="number" optional default="300"
The width of the QR code.
:::
::::

The following attribute configurations directly affect the final rendering of the QR code.
Usually, the default values are sufficient and do not require configuration.

:::: field-group
::: field name="light" type="string" optional default="#ffffffff"
The color for the light parts of the QR code, i.e., the background color.
:::
::: field name="dark" type="string" optional default="#000000ff"
The color for the dark parts of the QR code, i.e., the QR code color.
:::
::: field name="margin" type="number" optional default="2"
The margin of the QR code.
:::
::: field name="level" type="'L' | 'M' | 'Q' | 'H'" optional default="M"
**Error Correction Level**

Error correction allows the QR code to be successfully scanned even if it is dirty or damaged.
Four levels are available depending on the operating environment.

Higher levels provide better error resistance but reduce the data capacity of the symbol.

If the QR code symbol is unlikely to be damaged, lower error correction levels like Low or Medium can be safely used.
:::
::: field name="version" type="number" optional
**QR Code Version**

If not specified, a more suitable value will be automatically calculated. Valid range: `1-40`.
:::
::: field name="scale" type="number" optional default="4"
Scaling factor. A value of 1 means 1 pixel per module (black dot).
:::
::: field name="mask" type="1 | 2 | 3 | 4 | 5 | 6 | 7" optional
The mask pattern used to mask the symbol.

If not specified, a more suitable value will be automatically calculated.
::::

## Examples

### Accessible Remote Link

**Input:**

```md
@[qrcode](https://github.com/pengzhanbo/vuepress-theme-plume)
```

**Output:**

@[qrcode](https://github.com/pengzhanbo/vuepress-theme-plume)

### Internal Page Path

**Input:**

```md
@[qrcode](.) <!-- `.` represents the current page address -->
@[qrcode](./steps.md) <!-- Relative path -->
@[qrcode](/guide/markdown/qrcode.md) <!-- Absolute path -->
```

**Output:**

::: flex
@[qrcode](.)
@[qrcode](./steps.md)
@[qrcode](/guide/markdown/qrcode.md)
:::

### Arbitrary Text

**Input:**

```md
@[qrcode](vuepress-theme-plume is an open-source VuePress theme)
```

**Output:**

@\[qrcode]\(vuepress-theme-plume is an open-source VuePress theme)

**Input:**

```md
::: qrcode title="The Road Not Taken · by Robert Frost"
Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;

Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear;
Though as for that the passing there
Had worn them really about the same,

And both that morning equally lay
In leaves no step had trodden black.
Oh, I kept the first for another day!
Yet knowing how way leads on to way,
I doubted if I should ever come back.

I shall be telling this with a sigh
Somewhere ages and ages hence:
Two roads diverged in a wood, and I—
I took the one less traveled by,
And that has made all the difference.
:::
```

**Output:**

::: qrcode title="The Road Not Taken · by Robert Frost"
Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood
And looked down one as far as I could
To where it bent in the undergrowth;

Then took the other, as just as fair,
And having perhaps the better claim,
Because it was grassy and wanted wear;
Though as for that the passing there
Had worn them really about the same,

And both that morning equally lay
In leaves no step had trodden black.
Oh, I kept the first for another day!
Yet knowing how way leads on to way,
I doubted if I should ever come back.

I shall be telling this with a sigh
Somewhere ages and ages hence:
Two roads diverged in a wood, and I—
I took the one less traveled by,
And that has made all the difference.
:::

### QR Code Card with Information

**Input:**

```md
@[qrcode card title="vuepress-theme-plume"](https://github.com/pengzhanbo/vuepress-theme-plume)
```

Equivalent to:

```md
::: qrcode card title="vuepress-theme-plume"
https://github.com/pengzhanbo/vuepress-theme-plume
:::
```

**Output:**

@[qrcode card title="vuepress-theme-plume"](https://github.com/pengzhanbo/vuepress-theme-plume)
