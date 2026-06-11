---
url: /article/i4cuuonn/index.md
---
## 概述

不过最需要强调的便是它的可读性。一份使用 Markdown 格式撰写的文件应该可以直接以纯文字发佈，并且看起来不会像是由许多标签或是格式指令所构成。Markdown 语法受到一些既有 text-to-HTML 格式的影响，
包括 [Setext][1]、[atx][2]、[Textile][3]、[reStructuredText][4]、[Grutatext][5] 和 [EtText][6]，然而最大灵感来源其实是纯文字的电子邮件格式。

因此 Markdown 的语法全由标点符号所组成，并经过严谨慎选，是为了让它们看起来就像所要表达的意思。像是在文字两旁加上星号，看起来就像\*强调\*。Markdown 的列表看起来，嗯，就是列表。假如你有使用过电子邮件，引言写法看起来就真的像是引用一段文字。

Markdown 具有一系列衍生版本，用于扩展 Markdown 的功能 (如表格、脚注、内嵌 HTML 等等) ，
这些功能原初的 Markdown 尚不具备，它们能让 Markdown 转换成更多的格式，例如 LaTeX，Docbook。
Markdown 增强版中比较有名的有 Markdown Extra、MultiMarkdown、 Maruku 等。这些衍生版本要么基于工具，如 Pandoc；要么基于网站，如 GitHub 和 Wikipedia，在语法上基本兼容，但在一些语法和渲染效果上有改动。

## 用途

Markdown 的语法有个主要的目的: 用来作为一种网络内容的*写作*用语言。Markdown 的重点在于，它能让文件更容易阅读、编写。因此，Markdown 的格式语法只涵盖纯文字可以涵盖的范围。

Markdown 的语法简洁明了、学习容易，而且功能比纯文本更强，因此有很多人用它写博客。世界上最流行的博客平台 WordPress 能很好的支持 Markdown。

用于编写说明文档，并且以 `README.md` 的文件名保存在软件的目录下面。

除此之外，我们还可以快速将 Markdown 转化为演讲 PPT、Word 产品文档、LaTex 论文甚至是用非常少量的代码完成最小可用原型。在数据科学领域，Markdown 已经广泛使用，极大地推进了动态可重复性研究的历史进程。

### 行内 HTML

不在 Markdown 涵盖范围之外的标签，都可以直接在文件里面用 HTML 撰写。不需要额外标注这是 HTML 或是 Markdown；只要直接加标签就可以了。

只有块元素 ── 比如 `<div>`、`<table>`、`<pre>`、`<p>` 等标签，必须在前后加上空行，以利与内容区隔。
而且这些 (元素) 的开始与结尾标签，不可以用 tab 或是空白来缩进。Markdown 的解析器有智慧型判断，可以避免在块标签前后加上没有必要的 `<p>` 标签。

举例来说，在 Markdown 文件里加上一段 HTML 表格:

```md
This is a regular paragraph.

<table>
    <tr>
        <td>Foo</td>
    </tr>
</table>

This is another regular paragraph.
```

请注意，Markdown 语法在 HTML 块标签中将不会被进行处理。例如，你无法在 HTML 块内使用 Markdown 形式的 `*强调*`。

### 特殊字元自动转换

在 HTML 文件中，有两个字元需要特殊处理: `<` 和 `&` 。 `<` 符号用于起始标签，`&` 符号则用于标记 HTML 实体，如果你只是想要使用这些符号，你必须要使用实体的形式，像是 `&lt;` 和 `&amp;`。

`&` 符号其实很容易让写作网络文件的人感到困扰，如果你要打「AT\&T」 ，你必须要写成「`AT&amp;T`」 ，还得转换网址内的 `&` 符号，如果你要链接到 `http://images.google.com/images?num=30&q=larry+bird`

你必须要把网址转成:

```html
http://images.google.com/images?num=30&amp;q=larry+bird
```

才能放到链接标签的 `href` 属性里。不用说也知道这很容易忘记，这也可能是 HTML 标准检查所检查到的错误中，数量最多的。

Markdown 允许你直接使用这些符号，但是你要小心跳脱字元的使用，如果你是在 HTML 实体中使用 `&` 符号的话，它不会被转换，而在其它情形下，它则会被转换成 `&amp;`。所以你如果要在文件中插入一个著作权的符号，你可以这样写:

```md
&copy;
```

Markdown 将不会对这段文字做修改，但是如果你这样写:

```md
AT&T
```

Markdown 就会将它转为:

```html
AT&amp;T
```

类似的状况也会发生在 `<` 符号上，因为 Markdown 支持 [行内 HTML](#行内-html) ，如果你是使用 `<` 符号作为 HTML 标签使用，那 Markdown 也不会对它做任何转换，但是如果你是写:

```md
4 < 5
```

Markdown 将会把它转换为:

```html
4 &lt; 5
```

不过需要注意的是，code 范围内，不论是行内还是块， `<` 和 `&` 两个符号都*一定*会被转换成 HTML 实体，
这项特性让你可以很容易地用 Markdown 写 HTML code (和 HTML 相对而言， HTML 语法中，
你要把所有的 `<` 和 `&` 都转换为 HTML 实体，才能在 HTML 文件里面写出 HTML code。)

[1]: http://docutils.sourceforge.net/mirror/setext.html

[2]: http://www.aaronsw.com/2002/atx/

[3]: http://textism.com/tools/textile/

[4]: http://docutils.sourceforge.net/rst.html

[5]: http://www.triptico.com/software/grutatxt.html

[6]: http://ettext.taint.org/doc/
