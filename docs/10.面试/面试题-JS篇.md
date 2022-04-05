---
title: 面试题以及个人答案 JS篇
tags: 
  - 面试
createTime: 2018/08/23 11:15:27
permalink: /article/4ml7z17g
author: pengzhanbo
top: false
type: null
---

### JS：变量声明方式有哪些，有什么区别？

声明变量的方式有三种，分别是`var`、`let`、`const`。其中`let`、`const`是`es6`新增的变量声明方式。 

`var`声明的变量的作用域是它当前执行的上下文中，并且存在变量提升
``` js
function fn() {
    console.log(a);
    var a = 1;
    console.log(a);
}
fn();
```
相当于
``` js
function fn() {
    var a;
    console.log(a); // undefined
    a = 1;
    console.log(a); // 1
}
fn();
```
并且在可以重复声明同一变量，在该声明的上下文中不会丢失其值。通过var声明的全局变量会作为窗口对象的属性。

`let` 声明的变量是块级作用域，不存在变量提升，并存在暂时死区，不允许在同一块级作用域重复声明。
``` js
function fn() {
    console.log(a); // ReferenceError: a is not defined
    let a = 1;
    let a = 2; // TypeError thrown
    console.loga(a);
}
fn();
```
`const` 声明一个常量，其作用域可以是全局或者是本地声明的块级作用域，与`var`变量不同，全局常量不会变为窗口对象的属性。常量必须在声明的同时初始化。同时声明创建的值是一个只读引用，但不意味着它所持有的值是不可变的，只是变量标识符不能重新分配。如果引用内容是对象的情况下，则可以改变对象内容，除非使用`Object.freeze()`方法冻结对象。`const`声明常量同样存在暂时死区。

____

### JS数据类型隐式转换


————

### JS模块化，各自的优劣与不同点？

____

### EVENT LOOP
