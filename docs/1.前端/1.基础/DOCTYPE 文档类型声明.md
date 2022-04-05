---
title: <!DOCTYPE> 文档类型声明
createTime: 2018/03/14 01:06:52
permalink: /article/s8udp6vp
author: pengzhanbo
tags: 
  - html
top: false
type: null
---
Web世界中，随着历史的发展，技术的迭代，发展出了许多不同的文档，只有了解文档的类型，浏览器才能正确的解析渲染文档。

<!-- more -->

HTML也有多个不同的版本，只有完全明白页面使用的是哪个确切的HTML版本，浏览器才能完全正确的显示出HTML页面。

## 定义

`<!DOCTYPE>` 标签是一种标准通用标记语言的文档类型声明，目的是告诉标准通用标记语言解析器，它应该使用什么样的文档类型定义（DTD）来解析文档。

## 作用

声明文档的解析类型 （document.compatMode），避免浏览器的怪异模式。

__document.compatMode:__

- `BackCompat`:  怪异模式，浏览器使用自己的怪异模式解析渲染页面。
- `CSS1Compat`:  标准模式，浏览器使用W3C的标准解析渲染页面。

## 使用

在文档的首行进行声明。必须位于 html标签之前。

`<!DOCTYPE>` 声明不是HTML标签，它是指示浏览器关于页面使用哪个HTML版本的指令。

> 如果页面没有 DOCTYPE 声明，那么默认是 怪异模式，为了确保浏览器按预期渲染页面，必须进行DOCTYPE声明。

### 常用的DOCTYPE声明

一般情况下，默认使用以下声明即可。
``` html
<!DOCTYPE html>
<html>
</html>
```

## 一般DOCTYPE声明列表

### html5
``` html
<!DOCTYPE html>
```

### HTML 4.01 Strict

该 DTD 包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。
``` html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

### HTML 4.01 Transitional

该 DTD 包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。
``` html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
"http://www.w3.org/TR/html4/loose.dtd">
```

### HTML 4.01 Frameset

该 DTD 等同于 HTML 4.01 Transitional，但允许框架集内容。
``` html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" 
"http://www.w3.org/TR/html4/frameset.dtd">
```

### XHTML 1.0 Strict

该 DTD 包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。必须以格式正确的 XML 来编写标记。
``` html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```
### XHTML 1.0 Transitional

该 DTD 包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。必须以格式正确的 XML 来编写标记。

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "
http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

### XHTML 1.0 Frameset

该 DTD 等同于 XHTML 1.0 Transitional，但允许框架集内容。

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

### XHTML 1.1

该 DTD 等同于 XHTML 1.0 Strict，但允许添加模型（例如提供对东亚语系的 ruby 支持）。

``` html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
```