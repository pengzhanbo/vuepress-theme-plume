---
title: HTML5新特性
createTime: 2018/02/17 12:49:58
permalink: /article/8rv45yuy
author: pengzhanbo
tags: 
  - html
top: false
type: null
---

## 语义标签

如 `<header>` `<footer>` `<nav>` `<section>`  `<article>` `<aside>`  `<details>`  `<summary>`  `<dialog>` ` <figure>`  `<main>`  `<mark>`  `<time>`  `<hgroup>` 等

## 增强型表单

### 新增表单元素

`<detailist>` ：数据列表，为input提供输入建议列表

`<progress>`：进度条，展示连接/下载进度

`<meter>`：刻度尺/度量衡，描述数据所处的阶段，红色(危险)=>黄色(警告)=>绿色(优秀)

`<output>`：输出内容，语义上表示此处的数据是经过计算而输出得到的

其他

### 新增表单属性

placehoder： 输入框默认提示文字

required： 要求输入的内容是否可为空

pattern： 描述一个正则表达式验证输入的值

min/max： 设置元素最小/最大值

step： 为输入域规定合法的数字间隔

height/wdith： 用于image类型`<input>`标签图像高度/宽度

autofocus： 规定在页面加载时，域自动获得焦点

multiple： 规定`<input>`元素中可选择多个值

### 新增 input type 类型

color： 颜色选取

date： 日期选择

datetime： 日期选择（UTC时间）

datetime-local： 日期选择（无时区）

month： 月份选择

week： 周和年 选择

time： 选择时间

email： 包含 email的地址输入域

number:  数值选择

url： url输入域

tel： 电话号码和字段

search： 搜索域

range： 数字范围输入域

## 视频和音频

`<audio>`  音频元素

```html
<audio controls>    
  <source src="horse.ogg" type="audio/ogg">
  <source src="horse.mp3" type="audio/mpeg">
	您的浏览器不支持 audio 元素
</audio>
```

`<video>`  视频元素

```html
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  <source src="movie.ogg" type="video/ogg">
您的浏览器不支持Video标签。
</video>
```

## Canvas绘图

`<canvas>` 是 HTML5 新增的，一个可以使用脚本(通常为 JavaScript) 在其中绘制图像的 HTML 元素。它可以用来制作照片集或者制作简单(也不是那么简单)的动画，甚至可以进行实时视频处理和渲染。

[](https://www.runoob.com/w3cnote/html5-canvas-intro.html)

## 地理位置

使用getCurrentPosition()方法来获取用户的位置。以实现“LBS服务”

```jsx
window.navigator.geolocation : {
  watchPosition(){},
  clearWatch(){},
  getCurrentPosition(function(pos){
    // '定位成功'
    // 定位时间：pos.timestamp
    // 维度：pos.coords.latitude
    // 经度：pos.coords.longitude
    // 海拔：pos.coords.altitude
    // 速度：pos.coods.speed
  }, function(err){
    // '定位失败'
  }){},
}
```

## 拖放API

### 拖动的源对象(source)可能触发的事件：

**dragstart**：拖动开始

**drag**：拖动中

**dragend**：拖动结束

### 拖动的目标对象(target)可能触发的事件：

**dragenter**：拖动进入

**dragover**：拖动悬停

**drop**：松手释放

**dragleave**：拖动离开

拖放API事件句柄中所有的事件对象都有一个dataTransfer属性（数据运输对象），用于在源对象和目标对象间传递数据。

**源对象**：event.dataTransfer.setData(key, value)

**目标对象**：var value = event.dataTransfer.getData(key)

## WebWorker

[使用 Web Workers - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)

### 背景

Chrome浏览器中发起资源请求的有6个线程；但是只有1个线程负责渲染页面——称为UI主线程——浏览器中所有的代码只能由一个线程来执行。

### 问题

若浏览器加载了一个很耗时的JS文件(可能影响DOM树结构)，浏览器必须等待该文件执行完成才会继续执行后续的代码(HTML/CSS/JS等)——如果一个JS文件要执行10s(可能有很深的循环/递归等科学计算/解密)，会发生什么？——执行耗时JS任务过程中，会暂停页面中一切内容的渲染以及事件的处理。

### 作用

一个执行指定任务的独立线程；且该线程可以与UI主线程进行消息数据传递。

使用方式：

```jsx
// 主线程
var worker = new Worker('xx.js')
worker.postMessage('message') // 发送消息到worker线程
worker.onmessage = function (e) {
	console.log(e.data) // 来自worker线程的信息
}

// worker线程
onmessage = function (e) {
	console.log(e.data) // 接收主线程的消息

	postMessage('message') // 发送消息到主线程
}
```

### 共享 worker

一个共享worker可以被多个脚本使用——即使这些脚本正在被不同的window、iframe或者worker访问。

> 如果共享worker可以被多个浏览上下文调用，所有这些浏览上下文必须属于同源（相同的协议，主机和端口号）。
> 

```jsx
var myWorker = new SharedWorker('worker.js');

// 主线程中调用
myWorker.port.start()

myWorker.port.postMessage('message');

myWorker.port.onmessage = function(e) {
  console.log('Message received from worker');
}

// worker 线程调用
port.start();
// worker 需要在 onconnect事件处理函数来执行代码
onconnect = function(e) {
  var port = e.ports[0];

  port.onmessage = function(e) {
    var workerResult = 'Result: ' + (e.data);
    port.postMessage(workerResult);
  }
}
```

## WebStorage

### localStorage

本地跨会话级，持久化存储

### sessionStorage

会话级存储

## WebSocket

在用户的浏览器和服务器之间打开交互式通信会话。

```jsx
const ws = new WebSocket('wx://xx')
ws.onopen = function () {}
ws.onmessage = function (e) {
	console.log(e.data)
}
```

## History API

对history栈中内容进行操作。

### pushState(stateObj, title, url)

```jsx
history.pushState({}, 'foo', 'foo.html')
```

添加历史记录条目

### replaceState(stateObj, title, url)

```jsx
history.replaceState({}, 'bar', 'bar.html')
```

修改历史记录条目，浏览器不会检查替换的路径是否存在。

### popState 事件

每当活动的历史记录项发生变化时， popstate 事件都会被传递给window对象。如果当前活动的历史记录项是被 pushState 创建的，或者是由 replaceState 改变的，那么 popstate 事件的状态属性 state 会包含一个当前历史记录状态对象的拷贝。

### 获取当前状态

页面加载时，或许会有个非null的状态对象。这是有可能发生的，举个例子，假如页面（通过pushState() 或 replaceState() 方法）设置了状态对象而后用户重启了浏览器。那么当页面重新加载时，页面会接收一个onload事件，但没有 popstate 事件。然而，假如你读取了history.state属性，你将会得到如同popstate 被触发时能得到的状态对象。

```jsx
// 尝试通过 pushState 创建历史条目,然后再刷新页面查看state状态对象变化;
  window.addEventListener('load',() => {
    let currentState = history.state;
    console.log('currentState',currentState);
  })
```

[History API - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)