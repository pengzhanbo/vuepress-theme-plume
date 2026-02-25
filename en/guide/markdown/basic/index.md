---
url: /en/guide/markdown/basic/index.md
---
::: note This document is forked from [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/cookbook/markdown/), following the [MIT](https://github.com/vuepress-theme-hope/vuepress-theme-hope/blob/main/LICENSE) license.
:::

Markdown is a markup language that can be written using a plain text editor. Through simple syntax, it allows regular text content to have formatting capabilities.

The goal of Markdown is to achieve「readability and writability」.

## Overview

The most emphasized aspect is its readability. A document written in Markdown should be directly publishable as plain text,
and should not appear to be composed of tags or formatting instructions. Markdown syntax is influenced by several existing text-to-HTML formats,
including [Setext][1], [atx][2], [Textile][3], [reStructuredText][4], [Grutatxt][5], and [EtText][6],
with the primary inspiration coming from plain text email formatting.

Thus, Markdown syntax consists entirely of punctuation marks, carefully selected to visually represent their meaning.
For example, adding asterisks around text looks like \*emphasis\*. Markdown lists look like lists.
If you've used email, blockquotes resemble quoted text.

Markdown has various derivatives to extend its functionality (e.g., tables, footnotes, embedded HTML),
features not originally available in basic Markdown. These enable conversion to formats like LaTeX, Docbook.
Notable enhanced versions include Markdown Extra, MultiMarkdown, and Maruku. These derivatives are either tool-based (e.g., Pandoc)
or website-based (e.g., GitHub, Wikipedia), maintaining basic syntax compatibility but modifying rendering effects.

## Usage

Markdown's syntax has a primary purpose: to serve as a writing language for web content. Markdown focuses on making documents easier to read and write,
thus its syntax only covers what plain text can represent.

Markdown's syntax is simple, easy to learn, and more powerful than plain text, making it popular for blogging. WordPress, the world's most popular blogging platform, supports Markdown well.

It's used for documentation, typically saved as `README.md` in software directories.

Additionally, Markdown can quickly convert to presentation slides, Word documents, LaTeX papers, or even minimal viable prototypes with minimal code. In data science, Markdown has become essential for dynamic reproducible research.

### Inline HTML

Any HTML tags not covered by Markdown can be directly written in the document. No special annotation is needed; simply include the tags.

Block-level elements like `<div>`, `<table>`, `<pre>`, and `<p>` must be separated by blank lines.
These tags cannot be indented with tabs or spaces. Markdown's parser intelligently avoids adding unnecessary `<p>` tags around block elements.

For example, adding an HTML table in a Markdown file:

```md
This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.
```

Note that Markdown syntax is not processed within HTML blocks. For instance, you cannot use `*emphasis*` inside HTML blocks.

### Special Character Auto-Conversion

In HTML files, two characters require special handling: `<` and `&`. The `<` character starts a tag, and `&` marks an HTML entity. If you want to use these characters literally, you must use their entity forms, like `&lt;` and `&amp;`.

The `&` character can be problematic for those writing web documents. If you want to write "AT\&T," you must write "AT\&T." You also need to escape the `&` in URLs. For example, if you want to link to `http://images.google.com/images?num=30&q=larry+bird`

you must convert the URL to:

```html
http://images.google.com/images?num=30&amp;q=larry+bird
```

to place it in the `href` attribute of a link tag. It's easy to forget this, and it might be the most common error detected by HTML validators.

Markdown allows you to use these characters directly, but you need to be careful with escape characters. If you use `&` in an HTML entity, it won't be converted. In other cases, it will be converted to `&amp;`. So, if you want to insert a copyright symbol in your text, you can write:

```md
&copy;
```

Markdown will not modify this text. However, if you write:

```md
AT&T
```

Markdown will convert it to:

```html
AT&amp;T
```

Similar behavior occurs with the `<` character. Since Markdown supports [inline HTML](#inline-html), if you use `<` as an HTML tag, Markdown won't convert it. But if you write:

```md
4 < 5
```

Markdown will convert it to:

```html
4 &lt; 5
```

Note that within code spans, whether inline or block, both `<` and `&` are always converted to HTML entities. This feature allows you to easily write HTML code in Markdown, as you don't have to convert all `<` and `&` in HTML syntax to HTML entities to write HTML code.

***

## Block Elements

### Paragraphs and Line Breaks

A paragraph is composed of one or more connected lines, and one or more blank lines separate different paragraphs. (A blank line is defined as a line that appears empty; for example, a line with only spaces and tabs is also considered a blank line.) Generally, paragraphs do not require indentation with spaces or tabs.

The phrase "composed of one or more connected lines" implies that Markdown allows forced line breaks within paragraphs. This differs from other text-to-HTML formats (including MovableType's "Convert Line Breaks" option), which convert every line break into a `<br />` tag.

If you really want to insert a `<br />` tag, add two or more spaces (` `) or a slash (`/`) at the end of the line, then press Enter.

Yes, this requires more effort to insert a `<br />`, but the method of converting every line break to `<br />` is not suitable for Markdown.
In Markdown, email-style [block quotes][bq] and multi-paragraph [lists][l] are more usable and readable when using line breaks for formatting.

### Headings

Headings indicate the structure of an article.

Markdown supports two heading syntax styles: [Setext][1] and [atx][2].

The Setext style uses underlines with `=` (for first-level headings) and `-` (for second-level headings), like:

```md
# This is an H1

## This is an H2
```

Any number of `=` or `-` characters can be used.

The Atx style (recommended) involves placing 1 to 6 `#` characters at the beginning of a line, corresponding to heading levels 1 to 6, like:

* H1: `# Header 1`
* H2: `## Header 2`
* H3: `### Header 3`
* H4: `#### Header 4`
* H5: `##### Header 5`
* H6: `###### Header 6`

### Blockquotes

Markdown uses email-style block quotes. If you're familiar with quoting in emails, you'll know how to create a block quote in a Markdown file. It looks like a forced line break with `>` at the beginning of each line:

```md
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
>
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.
```

Markdown also allows you to place `>` only at the beginning of the first line of a paragraph:

```md
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.
```

Block quotes can have levels (e.g., quotes within quotes) by adding more `>` characters according to the level:

```md
> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.
```

Other Markdown syntax, including headings, lists, and code blocks, can be used within block quotes:

```md
> ## This is a header.
>
> 1. This is the first list item.
> 1. This is the second list item.
>
> Here's some example code:
>
>     return shell_exec("echo $input | $markdown_script");
```

Any standard text editor can easily create email-style quotes. For example, in BBEdit, you can select text and choose "Increase Quote Level" from the menu.

### Lists

Markdown supports ordered and unordered lists.

Unordered lists use hyphens as list markers (you can also use asterisks or plus signs):

```md
- Red
- Green
- Blue
```

You can also (though not recommended):

```md
- Red
- Green
- Blue

* Red
* Green
* Blue
```

Ordered lists use numbers followed by a period:

```md
1. Bird
2. McHale
3. Parish
```

Importantly, the numbers you use for list markers do not affect the HTML output. The HTML for the above list would be:

```html
<ol>
  <li>Bird</li>
  <li>McHale</li>
  <li>Parish</li>
</ol>
```

If you write the list markers as:

```md
1. Bird
1. McHale
1. Parish
```

You'll still get the same HTML output. The key point is that you can make the list numbers in the Markdown file match the output, or just use `1` and not worry about the numbering.

List markers are typically placed at the left margin but can be indented by up to three spaces, with at least one space or tab after the marker.

To make lists look neater, you can align the content with consistent indentation:

```md
- Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
  Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
  viverra nec, fringilla in, laoreet vitae, risus.
- Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
  Suspendisse id sem consectetuer libero luctus adipiscing.
```

However, if you're lazy, you don't have to:

```md
- Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
  Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
  viverra nec, fringilla in, laoreet vitae, risus.
- Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
  Suspendisse id sem consectetuer libero luctus adipiscing.
```

If list items are separated by blank lines, Markdown will wrap the item content in `<p>` tags. For example:

```md
- Bird
- Magic
```

Would be converted to:

```html
<ul>
  <li>Bird</li>
  <li>Magic</li>
</ul>
```

But this:

```md
- Bird

- Magic
```

Would be converted to:

```html
<ul>
  <li><p>Bird</p></li>
  <li><p>Magic</p></li>
</ul>
```

List items can contain multiple paragraphs, with each paragraph indented by 4 spaces or one tab:

```md
1. This is a list item with two paragraphs. Lorem ipsum dolor
    sit amet, consectetuer adipiscing elit. Aliquam hendrerit
    mi posuere lectus.

    Vestibulum enim wisi, viverra nec, fringilla in, laoreet
    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum
    sit amet velit.

2. Suspendisse id sem consectetuer libero luctus adipiscing.
```

If every line is indented, it looks better, but again, if you're lazy, Markdown allows:

```md
- This is a list item with two paragraphs.

  This is the second paragraph in the list item. You're
  only required to indent the first line. Lorem ipsum dolor
  sit amet, consectetuer adipiscing elit.

- Another item in the same list.
```

To include a quote within a list item, the `>` needs to be indented:

```md
- A list item with a blockquote:

  > This is a blockquote
  > inside a list item.
```

Accidental lists can occur with syntax like:

```md
1986. What a great season.
```

To avoid this, place a backslash before the period:

```md
1986\. What a great season.
```

### Code Blocks

For code writing or raw code of markup languages, you often need preformatted code blocks that shouldn't be formatted like regular paragraphs but displayed as-is. Markdown wraps these code blocks with `<pre>` and `<code>` tags.

Creating a code block in Markdown is simple: indent every line with 4 spaces or one tab. For example:

```md
This is a normal paragraph:

This is a code block.
```

Markdown converts this to:

```html
<p>This is a normal paragraph:</p>

<pre>
  <code>This is a code block.</code>
</pre>
```

The indentation (4 spaces or one tab) is removed, so:

```md
Here is an example of AppleScript:

tell application "Foo"
beep
end tell
```

Becomes:

```html
<p>Here is an example of AppleScript:</p>

<pre><code>tell application "Foo"
  beep
end tell
</code></pre>
```

A code block continues until a line with no indentation (or the end of the file).

Within code blocks, `<`, `&`, and `>` are automatically converted to HTML entities, making it easy to insert HTML code examples. Just copy, paste, and indent, and Markdown handles the rest. For example:

````md
```html
<div class="footer">
  &copy; 2004 Foo Corporation
</div>
```
````

Is converted to:

```html
<pre>
  <code>&lt;div class="footer"&gt;
  &amp;copy; 2004 Foo Corporation
&lt;/div&gt;</code>
</pre>
```

In code blocks, regular Markdown syntax isn't processed, so asterisks remain asterisks. This allows you to easily write about Markdown syntax.

If you want to include Markdown-formatted code libraries within a code block, you can nest them.

`````md
````md
```js
const a = 1
```
````
`````

Renders as

````md
```js
const a = 1
```
````

### Horizontal Rules

You can create a horizontal rule by placing three or more asterisks, hyphens, or underscores on a line. No other content should be on the line. You can also add spaces between the characters. Any of the following will create a horizontal rule:

```html
---(recommended) * * * *** ***** - - - ---------------------------------------
```

## Inline Elements

### Links

Markdown supports two types of link syntax: *inline* and *reference*.

In both cases, link text is marked with `[square brackets]`.

For an inline link, immediately after the square brackets, add parentheses with the URL. You can also include a title in quotes, like:

```html
This is [an example](http://example.com/  "Title") inline link. [This
link](http://example.net/  ) has no title attribute.
```

This produces:

```html
<p>
  This is <a href="http://example.com/  " title="Title"> an example</a> inline
  link.
</p>

<p><a href="http://example.net/  ">This link</a> has no title attribute.</p>
```

For linking to resources on the same host, you can use relative paths:

```md
See my [About](/about/) page for details.
```

Reference-style links use another set of square brackets after the link text, with an identifier for the link:

```md
This is [an example][id] reference-style link.
```

Then, define the link identifier anywhere in the document:

```md
[id]: http://example.com/  "Optional Title Here"
```

The link definition consists of:

* Square brackets with the link ID
* A colon
* One or more spaces or a tab
* The URL
* An optional title in single quotes, double quotes, or parentheses

These three link definitions are equivalent:

```md
[foo]: http://example.com/  "Optional Title Here"
[foo]: http://example.com/  "Optional Title Here"
[foo]: http://example.com/  "Optional Title Here"
```

**Note:** A known issue is that Markdown.pl 1.0.1 ignores single-quoted link titles.

URLs in link definitions can be enclosed in square brackets:

```md
[id]: http://example.com/  "Optional Title Here"
```

You can also place the title on a new line with indentation for better readability with long URLs:

```md
[id]: http://example.com/longish/path/to/resource/here  "Optional Title Here"
```

Link identifiers are case-insensitive and can include letters, numbers, spaces, and punctuation. These two links are the same:

```md
[link text][a]
[link text][a]
```

The *default link ID* feature allows you to omit the link ID, making it the same as the link text. To use this, add empty square brackets after the link text. For example:

```md
[Google][]
```

Then define the link:

```md
[google]: http://google.com/
```

Since link text can contain spaces, the simplified ID can also include multiple words:

```md
Visit [Daring Fireball][] for more information.
```

Then define the link:

```md
[daring fireball]: http://daringfireball.net/
```

Link definitions can be placed anywhere in the document, either after the paragraph where the link appears or at the end like annotations.

Here's an example of reference-style links:

```md
I get 10 times more traffic from [Google][1] than from
[Yahoo][2] or [MSN][3].

[1]: http://google.com/  "Google"
[2]: http://search.yahoo.com/  "Yahoo Search"
[3]: http://search.msn.com/  "MSN Search"
```

Using link names instead:

```md
I get 10 times more traffic from [Google][] than from
[Yahoo][] or [MSN][].

[google]: http://google.com/  "Google"
[yahoo]: http://search.yahoo.com/  "Yahoo Search"
[msn]: http://search.msn.com/  "MSN Search"
```

Both methods produce the same HTML:

```html
<p>
  I get 10 times more traffic from
  <a href="http://google.com/  " title="Google">Google</a> than from
  <a href="http://search.yahoo.com/  " title="Yahoo Search">Yahoo</a>
  or <a href="http://search.msn.com/  " title="MSN Search">MSN</a>.
</p>
```

For comparison, here's the inline-style version of the same content:

```md
I get 10 times more traffic from [Google](http://google.com/  "Google")
than from [Yahoo](http://search.yahoo.com/  "Yahoo Search") or
[MSN](http://search.msn.com/  "MSN Search").
```

Reference-style links are more readable. The reference-style version has 81 characters, while the inline-style version has 176, and pure HTML would have 234. In HTML, tags outnumber text.

Using Markdown's reference-style links makes the document resemble the final browser output, allowing you to keep markup details separate from the main text for uninterrupted reading.

### Emphasis

Markdown uses asterisks (`*`) and underscores (`_`) to mark emphasis. Text surrounded by `*` or `_` is wrapped in `<em>`, while text surrounded by double `*` or `_` is wrapped in `<strong>`, like:

```md
**double asterisks** (recommended)

**double underscores** (recommended)

_single asterisks_

_single underscores_
```

This converts to:

```html
<em>single asterisks</em>

<em>single underscores</em>

<strong>double asterisks</strong>

<strong>double underscores</strong>
```

You can choose your preferred style, as long as you use the same character to open and close.

Emphasis can be added in the middle of words:

```md
un*frigging*believable
```

However, if `*` or `_` has spaces on both sides, it will be treated as regular text.

To insert literal asterisks or underscores, use a backslash:

```md
\*this text is surrounded by literal asterisks\*
```

### Code

To mark inline code, wrap it in backticks (`` ` ``), like:

```md
Use the `printf()` function.
```

This produces:

```md
<p>Use the <code>printf()</code> function.</p>
```

To include a backtick within the code, use multiple backticks to open and close the inline code:

```md
``There is a literal backtick (`) here.``
```

This renders as:

```html
<p><code>There is a literal backtick (`) here.</code></p>
```

You can add a space at the start or end of the code span to include a backtick at the beginning:

```md
A single backtick in a code span: `` ` ``

A backtick-delimited string in a code span: `` `foo` ``
```

This results in:

```html
<p>A single backtick in a code span: <code>`</code></p>

<p>A backtick-delimited string in a code span: <code>`foo`</code></p>
```

Within code spans, `&` and brackets are converted to HTML entities, making it easier to insert HTML code. Markdown converts:

```md
Please don't use any `<blink>` tags.
```

To:

```html
<p>Please don't use any <code>&lt;blink&gt;</code> tags.</p>
```

You can also write:

```md
`&#8212;` is the decimal-encoded equivalent of `&mdash;`.
```

Which produces:

```html
<p>
  <code>&amp;#8212;</code> is the decimal-encoded equivalent of
  <code>&amp;mdash;</code>.
</p>
```

### Images

Creating a natural syntax for inserting images in plain text is challenging.

Markdown uses a syntax similar to links for images, supporting both *inline* and *reference* styles.

The inline image syntax looks like:

```md
![Alt text](/path/to/img.jpg)

![Alt text](/path/to/img.jpg "Optional title")
```

This consists of:

* An exclamation mark `!`
* Square brackets containing the image's alt text
* Parentheses containing the image URL, optionally followed by a quoted title.

Reference-style image syntax looks like:

```md
![Alt text][id]
```

Where `id` is the image reference name, defined like:

```md
[id]: url/to/image "Optional title attribute"
```

Currently, Markdown doesn't support specifying image width and height. For that, use the regular `<img>` tag.

### Other Text Styles

* Delete: `~~delete~~`
* Paragraphs: Leave a blank line between paragraphs
* Line breaks: Add two spaces at the end of a line

***

## Other

### Automatic Links

Markdown supports concise automatic link syntax for URLs and email addresses. Enclosing text in brackets automatically converts it to a link. For example:

```md
<http://example.com/>
```

Markdown converts this to:

```html
<a href="http://example.com/">http://example.com/</a>
```

Automatic email links are similar, but Markdown encodes characters as hexadecimal HTML entities to confuse address-harvesting bots. For example:

```md
<address@example.com>
```

Markdown converts this to:

```html
<a
  href="&#x6D;&#x61;i&#x6C;&#x74;&#x6F;:&#x61;&#x64;&#x64;&#x72;&#x65;&#115;&#115;&#64;&#101;&#120;&#x61;&#109;&#x70;&#x6C;e&#x2E;&#99;&#111;&#109;"
  >&#x61;&#x64;&#x64;&#x72;&#x65;&#115;&#115;&#64;&#101;&#120;&#x61;&#109;&#x70;&#x6C;e&#x2E;&#99;&#111;&#109;</a
>
```

This creates a clickable <address@example.com> link in the browser.

### Escape Characters

Markdown uses backslashes to insert characters that have special meaning in its syntax. For example, to use asterisks for emphasis without `<em>` tags, precede them with a backslash:

```md
\*literal asterisks\*
```

Markdown supports escaping the following characters:

* `\` backslash
* `` ` `` backtick
* `*` asterisk
* `_` underscore
* `{}` curly braces
* `[]` square brackets
* `()` parentheses
* `#` hash
* `+` plus
* `-` minus
* `.` period
* `!` exclamation mark

## Keyboard Shortcuts

| Rendered Effect | Markdown Syntax | Shortcut Key |
| --------------- | --------------- | ------------ |
| **Bold**        | `**text**`      | Ctrl/⌘ + B   |
| *Emphasize*     | `*text*`        | Ctrl/⌘ + I   |
| `Inline Code`   | \`code\`        | Select then `` ` `` |

## Tables

|     Center      |         Right Aligned | Left Aligned         |
| :-------------: | ---------------------: | :------------------- |
| Use `:-:`       | Use `-:`              | Use `:-`             |
|       b         |      aaaaaaaaa        | aaaa                 |
|       c         |           aaaa        | a                    |

[1]: http://docutils.sourceforge.net/mirror/setext.html

[2]: http://www.aaronsw.com/2002/atx/

[3]: http://textism.com/tools/textile/

[4]: http://docutils.sourceforge.net/rst.html

[5]: http://www.triptico.com/software/grutatxt.html

[6]: http://ettext.taint.org/doc/

[bq]: #blockquotes

[l]: #lists
