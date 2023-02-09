---
title: 内容安全策略(CSP)
createTime: 2020/08/28 03:25:32
author: pengzhanbo
tags: 
  - http
  - 安全
permalink: /article/snkdmwsz/
---


内容安全策略（`Content-Security-Policy`），简称 `CSP`。是一种 计算机安全标准。

主要目标是 减少和报告XSS攻击、数据注入攻击等。这些攻击手段的主要目的是盗取网站数据、网站内容污染、散发恶意软件等。

几乎所有现在浏览器都支持 `CSP`， 对于不支持的浏览器，则会忽略 `CSP`。

<!-- more -->

## XSS攻击

XSS攻击是一种常见的、危害极大的网络攻击手段。它利用浏览器对从服务器获取的内容的信任，
通过站点的 `script` 脚本、内联脚本、外部导入资源等方式进行注入攻击。
恶意脚本在受害者浏览器中执行，以达成其目的。

## CSP

`CSP` 通过 **有效域名**，即 **浏览器认可的可执行脚本的有效来源** ，使 服务器管理者有能力消除或减少 XSS 攻击所以来的载体。
支持 `CSP` 的浏览器，仅会执行从白名单域名加载的脚本文件，忽略其他所有脚本，包括内联脚本和 HTML 事件处理属性。


## 制定策略

`CSP` 通过 声明 HTTP 头部字段 `Content-Security-Policy` 来启用和配置策略：
```
Content-Security-Policy: policy;
Content-Security-Policy: policy; policy;
```

参数 `[policy]` 是一个包含了描述 各种CSP策略指令的字符串。

## 策略指令

### default-src

为其他CSP指令提供备选项，如果其他指令不存在，用户代理会查找并应用该值，如果其他指令有配置值，那么则不会应用 default-src的值。

default-src 策略允许指定一个或多个值：
```
Content-Security-Policy: default-src <source>;
Content-Security-Policy: default-src <source> <source>;
```

### script-src

脚本内容安全策略指令，包括限制 外部资源、内联脚本、eval函数。

```
Content-Security-Policy: script-src <source>
```

### style-src

CSS文件内容安全策略指令，包括限制 内联样式表、通过`<link>` 引入的css文件、样式中通过 `@import` 导入的css文件、
元素的 `style` 属性、 `style.cssText` 属性、以及 `el.setAttribute('style', '')`

```
Content-Security-Policy: style-src <source>
```

### img-src

图片资源内容安全策略指令， 限制通过 `<img>` 加载的图片资源

```
Content-Security-Policy: img-src <source>
```

### media-src

媒体资源内容安全策略指令，限制通过 `<audio>`、`<video>`、`<track>` 加载的媒体资源

```
Content-Security-Policy: media-src <source>
```

### frame-src

iframe内容安全策略指令，限制`<iframe>` 加载的页面资源

### 其他指令

- `manifest-src` 限制 manifest 资源（通过`<link>`引入的 manifest文件）
- `worker-src` 限制 `worker`资源，包括 `Worker`、`SharedWorker` 、`ServiceWorker`
- `child-src` 限制 `web worker`、`<frame>` 、`<iframe>` 
- `connect-src` 限制允许通过脚本接口加载的链接地址，包括：`<a>`、`Fetch`、`XMLHttpRequest`、`WebSocket`、`EventSource`
- `font-src` 限制 `@font-face` 加载字体的有效源规则。
- `object-src` 限制 `<object>`、`<embed>`、`<applet>`


### 指令`<source>`有效值

- `<host-source>`
  
  以域名或者 IP 地址表示的主机名，外加可选的 URL 协议名（URL scheme）以及端口号。
  支持前置通配符（星号 '*'），可以将通配符应用于站点地址、端口中，如应用于端口，则表示允许使用该域名下的所有端口。

  - **example.com:443** 匹配 example.com 上 443 端口访问
  - **https://example.com** 匹配使用了 http: 的 example.com 的访问
  - ***.example.com** 匹配 example.com 下的所有子域名的访问

- `<scheme-source>`
  
  协议名如'http:' 或者 'https:'。必须带有冒号，不要有单引号。

- `'self'`
  
  指向与要保护的文件所在的源，包括相同的 URL scheme 与端口号。必须有单引号。

- `'unsafe-inline'`
  
  允许使用内联资源，例如内联 `<script>` 元素（javascript: URL）、内联事件处理器以及内联 `<style>` 元素。必须有单引号。

- `'unsafe-eval'`

  允许使用 eval() 以及相似的函数来从字符串创建代码。必须有单引号。

- `'none'`

  不允许任何内容。 必须有单引号。
  
- `'nonce-<base64 值>'`
  
  特定使用一次性加密内联脚本的白名单。服务器必须在每一次传输政策时生成唯一的一次性值。否则将存在绕过资源政策的可能。

- `<hash-source>`

  使用 sha256、sha384 或 sha512 编码过的内联脚本或样式。其由用短划线分隔的两部分组成：用于创建哈希的加密算法，以及脚本或样式 base64 编码的哈希值。当生成哈希值的时候，不要包含 `<script>` 或 `<style>` 标签，同时注意字母大小写与空格——包括首尾空格——都是会影响生成的结果的。

  ```
  Content-Security-Policy: default-src sha256-abcdef;
  ```
- `'strict-dynamic'`
  
  strict-dynamic 指定对于含有标记脚本 (通过附加一个随机数或散列) 的信任，应该传播到由该脚本加载的所有脚本。与此同时，任何白名单以及源表达式例如 'self' 或者 'unsafe-inline' 都会被忽略。

## 启用CSP

启用CSP，可以在 HTTP服务器中，新增 Header 字段：
如，在nginx中：
``` nginx
http {
  # ...more
  server {
    # ...more
    location / {
      index index.html;
      Content-Security-Policy default-src 'self';
      # ...more
    }
  }
}
```

也可以在 html 文件中 添加 `<meta>` 标签
``` html
<meta http-equiv="Content-Security-Policy" content="default-src 'self';" />
```

## 示例

### 示例1

默认只允许加载本站资源

```
Content-Security-Policy: default-src 'self';
```

### 示例2

默认只允许加载本站资源，但允许任意来源图片资源

```
Content-Security-Policy: default-src 'self'; img-src *;
```

### 示例3

默认只允许加载本站资源，允许 script资源、css资源、图片资源从指定cdn域名加载
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src  'self' https://cdn.example.com; img-src 'self' https://cdn.example.com;
```

### 示例4

阻止所有 iframe 窗口，允许本站加载其他资源

```
Content-Security-Policy: default-src 'self'; frame-src 'none';
```

### 示例5

执行特定 nonce 的内联脚本：

```
Content-Security-Policy: script-src 'nonce-abcdef' 'self';
```

只有在`<script>`标签内带有特定 `nonce` 值的脚本才允许执行：

``` html
<script nonce="abcdef" src="example.js"></script>
```

### 示例6

Hash 值相符的脚本才能执行：

```
Content-Security-Policy: script-src 'sha256-qznLcsROx4GACP2dm0UCKCzCG+HiZ1guq6ZZDob/Tng='
```
该hash值必须是 script 标签内容的 sha256 值，代码才能执行：
``` html
<script>
  alert("Hello, world.");
</script>
```

## 违例报告

启用 CSP 后，默认情况下，违例报告不会发送。我们可以通过配置 `report-uri` 策略指令，并提供至少一个URI地址去递交报告。

```
Content-Security-Policy: default-src 'self'; report-uri http://report.example.com/csp;
```

### 违例报告示例

违例报告将以 JSON 对象的数据结构进行递交：

``` json
{
  "csp-report": {
    "document-uri": "http://example.com/index.html", // 发生违规的文档的 URI
    "referrer": "", // 违规发生处的文档引用（地址）
    "blocked-uri": "http://example.com/css/style.css", // 被 CSP 阻止的资源 URI。
    "violated-directive": "style-src cdn.example.com", // 违反的策略名称。
    // 在 Content-Security-Policy HTTP 头部中指明的原始策略。
    "original-policy": "default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports"
  }
}
```

当服务器接收到 违例报告，可以通过分析报告内容，来进行自定义的处理。
