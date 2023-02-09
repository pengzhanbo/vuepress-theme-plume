---
title: 为你的站点开启HSTS
createTime: 2020/11/12 07:08:12
author: pengzhanbo
tags: 
  - http
  - 安全
permalink: /article/1w4onzn1/
---

`HTTP-Strict-Transport-Security` 简称为 `HSTS`，是一个 HTTP 响应头。
用于通知浏览器应该只通过 HTTPS 访问该站点，并且以后使用 HTTP 访问该站点的所有尝试都应自动转换为 HTTPS。

<!-- more -->

## 中间人劫持

当用户在未知风险的网络环境中访问 某个网站的时候，如访问 `http://example.com`，在这个未知风险的网络环境中，
可能会被其他人拦截到用户发出的网络请求，然后跳转到一个一模一样的钓鱼网站，或者在请求内容中，注入有危害的代码、广告等，
这种攻击行为，被称为 **中间人劫持**。

当 `example.com` 也支持 `https` 协议进行访问后，如果用户直接通过 `https` 协议访问，那么在一定程度上可以有效防止
`中间人劫持`。

如果用户依然通过 `http` 协议访问，虽然服务器可以重定向到 `https` 请求，然而在这个过程中，中间人依然可以
通过拦截 `http` 请求，然后向服务器发起 `https` 请求获取内容，再注入新的内容 返回给用户。

用户在浏览器地址栏中 输入 `example.com`, 浏览器默认发起的是 `http` 请求，这导致了我们很难要求用户在通过域名访问
网站时，一定要输入 `https://example.com`。

为了限制 `中间人劫持` 这种潜在的攻击手段，一种处理方式就是 强制浏览器使用 `https` 协议访问网站。
为此，我们需要给网站开启 `HSTS`。

## HSTS

`HSTS` 通过声明 `HTTP` 头部字段 `HTTP-Strict-Transport-Security` 来启用和配置策略：

```
Strict-Transport-Security: max-age=<expire-time>
Strict-Transport-Security: max-age=<expire-time>; includeSubDomains
Strict-Transport-Security: max-age=<expire-time>; preload
```

### 指令

#### `max-age=<expire-time>`

设置在浏览器收到这个请求后的`<expire-time>`秒的时间内凡是访问这个域名下的请求都使用 HTTPS 请求。

#### `includeSubDomains` <Badge>可选</Badge>

如果这个可选的参数被指定，那么说明此规则也适用于该网站的所有子域名。

#### `preload` <Badge>可选</Badge>

查看 [预加载 HSTS](https://www.chromium.org/hsts/) 获得详情。不是标准的一部分。

### 浏览器处理

> 当网站已开启 `HSTS`

用户在第一次通过 `https` 协议访问网站时，服务器响应`Strict-Transport-Security` 头，浏览器记录下信息，
在以后重新访问访问网站时，会把访问这个网站的 `http` 请求自动替换为 `https`。

当 `HSTS` 头设置的过期时间到了，后面通过 `HTTP` 的访问恢复到正常模式，不会再自动跳转到 `HTTPS。`

每次浏览器接收到 `Strict-Transport-Security` 头，它都会更新这个网站的过期时间，所以网站可以刷新这些信息，防止过期发生。

Chrome、Firefox 等浏览器里，当尝试访问该域名下的内容时，会产生一个 307 Internal Redirect（内部跳转），自动跳转到 HTTPS 请求。


## 预加载

如果用户首次访问网站时，依然使用的是 `http` 协议，浏览器会忽略`Strict-Transport-Security`，而且中间人依然可以劫持请求内容，删除 `Strict-Transport-Security`。

为了进一步处理这个问题， `Google`、`Firefox` 等浏览器厂商，维护了一个 `HSTS` 预加载服务。

你可以将你已开启了 `HSTS` 的 站点域名，提交到 预加载服务中，浏览器将会永不使用非安全的方式连接到你的域名。

但是，这不是 HSTS 标准的一部分，也不该被当作正式的内容。

[`HSTS`预加载服务](https://hstspreload.org/)


## 示例

当前域名，以及所有子域名，开启 `HSTS`, 过期时间为 一年。
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
