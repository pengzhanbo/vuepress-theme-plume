---
title: 跨域资源共享(CORS)
createTime: 2020/08/29 07:40:31
author: pengzhanbo
tags: 
  - http
permalink: /article/2f45bq9x/
---

**跨域资源共享（CORS）** 是一种基于 **HTTP Header** 的机制。
该机制通过允许服务器标示除了它自己的 origin（域，协议和端口），使这些 origin 有权限访问加载服务器上的资源。

<!-- more -->

跨域资源共享 通过 **预检请求** 的机制，检查服务器是否允许要发送的真实请求。
浏览器向服务器发送一个到服务器托管的跨域资源 **预检请求**，
在预检请求中，浏览器发送的头部中标示有HTTP方法和真实请求会用到的头。

## 前言

浏览器出于安全性的原因，会限制脚本内发起的跨域资源请求，
比如 **XMLHttpRequest** 和 **Fetch API** 遵循 **同源策略**，默认情况下不允许发起非同源的资源请求。
使用这些API的Web应用，只能加载从应用程序的同一个域的请求HTTP资源，
**除非响应报文中包含了正确的CORS响应头**

## 概述

跨域资源共享 新增了一组 HTTP首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。
同时，对于可能对服务器数据产生副作用的 HTTP 请求方法，浏览器必须首先使用 `OPTIONS` 方法发起一个预检请求，
从而获取服务器是否允许跨域请求，服务器确认允许之后，才发起实际的HTTP请求。

CORS 请求失败会产生错误，但是为了安全，在 JavaScript 代码中，是无法获取具体是哪里出了问题。
我们只能通过查看浏览器的控制台来获取具体出现的错误。

若要开启 CORS ，我们需要配置 CORS 相关的 HTTP首部字段。

## HTTP 响应首部字段

在 CORS 中，HTTP 响应首部字段主要有以下几个：

- **Access-Control-Allow-Origin**
- **Access-Control-Allow-Methods**
- **Access-Control-Allow-Headers**
- **Access-Control-Max-Age**
- **Access-Control-Expose-Headers**
- **Access-Control-Allow-Credentials**

### Access-Control-Allow-Origin

**Access-Control-Allow-Origin** 响应首部字段，用于 **指定允许访问该资源的外域URI**。

对于不需要携带身份凭证的请求，服务器可以指定改字段的值为通配符(`*`)，表示允许来自所有域的请求。

语法：
```
Access-Control-Allow-Origin: <origin>
Access-Control-Allow-Origin: *
```

如果服务器 指定了具体的域名而非 `*`，那么响应首部中的 **Vary** 字段的值必须包含 `Origin`。
用于告诉客户端：服务器对不同的源站返回不同的内容。

::: info 注意
当响应的是附带身份凭证的请求时，服务端 必须 明确 **Access-Control-Allow-Origin** 的值，而不能使用通配符`“*”`。
:::

**示例1：**

允许所有域访问
```
Access-Control-Allow-Origin: *
```

**示例2：**

允许来自 https://pengzhanbo.cn 的请求
```
Access-Control-Allow-Origin: https://pengzhanbo.cn
Vary: Origin
```

### Access-Control-Allow-Methods

**Access-Control-Allow-Methods** 响应首部字段用于 预检请求的响应。 
**指明了实际请求所允许使用的HTTP方法或方法列表**。

语法：
```
Access-Control-Allow-Methods: <method>[, <method>]*
```

示例：

```
Access-Control-Allow-Methods: POST, GET, OPTIONS
```

### Access-Control-Allow-Headers

**Access-Control-Allow-Headers** 响应首部字段用于 预检请求的响应。
**指明了实际请求中允许携带的首部字段**。

语法：
```
Access-Control-Allow-Headers: <header-name>[, header-name]*
Access-Control-Allow-Headers: *
```

以下特定的首部是一直允许的，无需特意声明他们：
- Accept
- Accept-Language
- Content-Language
- Content-Type，但只在其值属于MIME类型 `application/x-www-form-urlencoded`,`multipart/form-data`,`text/pain` 中的一种。

**示例1：**

自定义请求头。 除了 CORS 安全清单列出的请求头外，支持 自定义请求头 X-Custom-Header

```
Access-Control-Allow-Headers: X-Custom-Header
```

**示例2：**

多个自定义请求头。

```
Access-Control-Allow-Headers: X-Custom-Header, X-My-Header
```

### Access-Control-Max-Age

**Access-Control-Max-Age** 响应首部字段表示 **预检请求的返回结果可以被缓存多久**。

返回结果是指： **Access-Control-Allow-Methods** 和 **Access-Control-Allow-Headers** 提供的信息。

语法：
```
Access-Control-Max-Age: <delta-seconds>
```

**delta-seconds** 表示返回结果可以被缓存的最长时间（秒）。
在 Firefox 中， 上限是 **24小时（86400秒）**。
在 Chromium 中，上限是 **2小时（7200秒）**，同时 Chromium 还规定了默认值是 **5秒**。
如果值为 **-1** ， 表示禁用缓存，则每次请求前都需要使用 OPTIONS 预检请求。

**示例**

将预检请求缓存 10分钟：
```
Access-Control-Max-Age: 600
```

### Access-Control-Expose-Headers

**Access-Control-Expose-Headers** 响应首部字段，列出了 哪些首部可以作为响应的一部分暴露给外部。

在 跨源访问时，XMLHttpRequest 对象的 `getResponseHeader()` 方法默认只能拿到一些最基本的响应头。

默认情况下，只有七种 简单响应首部 可以暴露给外部:

- Cache-Control
- Content-Language
- Content-Length
- Content-Type
- Expires
- Last-Modified
- Pragma

如果期望让客户端可以访问到其他的首部信息，可以将它们 该字段受列出来。

语法：
```
Access-Control-Expose-Headers: <header-name>[, <header-name>]*
```

**示例**

暴露一个非简单响应首部：
```
Access-Control-Expose-Headers: X-My-Header
```

暴露多个非简单响应首部：
```
Access-Control-Expose-Headers: X-My-Header, X-Custom-Header
```

### Access-Control-Allow-Credentials

**Access-Control-Allow-Credentials** 响应首部字段 用于在 请求包含 Credentials 时，
告知浏览器是否可以将对请求的响应暴露给前端 JavaScript 代码。

当请求的 Credentials 模式 （Request.credentials）为 `include` 时，浏览器尽在相应头 **Access-Control-Allow-Credentials** 的值为 `true` 时将响应暴露给前端的 JavaScript 代码。

Credentials 可以是 `cookies`、 `authorization headers` 或 `TLS client certificates`。

语法：
```
Access-Control-Allow-Credentials: true
```

**Access-Control-Allow-Credentials** 需要与 `XMLHttpRequest.withCredentials` 
或 **Fetch API** 的 `Request()` 构造函数中的 `credentials` 选项结合使用。
Credentials 必须在前后端都被配置，才能使带 credentials 的 CORS 请求成功。

**示例：**

允许 credentials

```
Access-Control-Allow-Credentials: true
```

使用带 credentials 的 XHR:

``` js
const xhr = new XMLHttpRequest()
xhr.open('GET', 'https://pengzhanbo.cn', true)
xhr.withCredentials = true
xhr.send(null)
```

使用带  credentials 的 Fetch:

``` js
fetch('https://pengzhanbo.cn', {
  credentials: 'include'
})
```

## HTTP 请求首部字段

在 CORS 中，可用于发起跨域请求的首部字段，如下：

- Origin
- Access-Control-Request-Method
- Access-Control-Request-Headers

这些首部字段无需手动设置。

当开发者使用  XMLHttpRequest 发起跨域请求时，它们已经被设置就绪。

### Origin

**Origin** 请求首部字段表明预检请求或实际请求的源站。

语法：

```
Origin: <origin>
```

origin 参数的值为源站的URI。不包含任何路径信息，仅表示服务器名称。

### Access-Control-Request-Method

**Access-Control-Request-Method** 请求首部字段用于预检请求。作用是 将实际情况所使用的HTTP方法告诉服务器。

语法：

```
Access-Control-Request-Method: <method>
```

### Access-Control-Request-Headers

**Access-Control-Request-Headers** 请求首部字段用于预检请求。作用是 将实际请求所携带的首部字段告诉服务器。

语法：

```
Access-Control-Request-Headers: <header-name>[, <header-name>]*
```

## 预检请求

一个 CORS 预检请求时用于 检查服务器使用支持 CORS， 即 跨域资源共享。

预检请求 通过 发送一个 OPTIONS 请求，请求头部包含了以下字段：

- Access-Control-Request-Method
- Access-Control-Request-Headers
- Origin

浏览器会在有必要的时候，自动发出一个预检请求。

所以在正常情况下，前端开发者不需要自己去发送这样的请求。

### 预检请求与凭据

CORS 预检请求不能包含凭据。预检请求的响应必须指定 Access-Control-Allow-Credentials: true 来表明可以携带凭据进行实际的请求。

## 简单请求

某些情况下，不会触发 CORS预检请求，这样的请求，可表述为 _简单请求_。

若请求满足以下所有条件，则可视为 简单请求：

- 使用 GET, HEAD POST 请求方法
- 除了被用户代理自动设置的首部字段（Connection，User-Agent等），
  以及在 Fetch 规范中定义为 [禁用首部名称](https://fetch.spec.whatwg.org/#forbidden-header-name) 的其他首部，
  允许人为设置的字段为 Fetch 规范定义的 对 [CORS 安全的首部字段集合](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)
- 请求中任意的 XMLHttpRequest 对象均没有注册任何监听事件， 
  XMLHttpRequest 对象可以使用 XMLHttpRequest.upload 属性访问。
- 请求中没有使用 ReadableStream 对象。

## 附带身份的请求与通配符

在响应附带身份凭证的请求时：

- 服务器不能将 **Access-Control-Allow-Origin** 的值设为通配符 `*`，而应将其设置为特定的域，如：Access-Control-Allow-Origin: https://pengzhanbo.cn。

- 服务器不能将 **Access-Control-Allow-Headers** 的值设为通配符 `*`，而应将其设置为首部名称的列表，如：Access-Control-Allow-Headers: X-Custom-Header, Content-Type

- 服务器不能将 **Access-Control-Allow-Methods** 的值设为通配符 `*`，而应将其设置为特定请求方法名称的列表，如：Access-Control-Allow-Methods: POST, GET


## 需要CORS的场景

1. 使用 **XMLHttpRequest** 发起的 HTTP请求
2. 使用 **Fetch API** 发起的 HTTP 请求
3. Web字体，CSS通过 `@font-face` 使用的跨域字体资源
4. WebGL 贴图
5. 使用 drawImage 将 Images/video 画面绘制到 canvas
6. 来自图像的 CSS 图形


## 安全

在实际的使用场景中，尽可能的少使用 通配符 `*`，来允许所有域访问，或允许所有自定义首部字段，
这可能在 web 安全上来带风险。
