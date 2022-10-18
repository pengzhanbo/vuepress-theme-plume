---
title: 详解 Promise
createTime: 2022-03-26T11:46:50.026Z
permalink: /article/q40nq4hv
author: pengzhanbo
sticky: true
type: null
---

## 概述

`Promise` 是一个构造函数，用于创建一个新的 Promise 对象。该构造函数主要用于包装还没有添加 promise 支持的函数。
``` ts
Promise(resolver : (resolve, reject) => void)
```

`Promise` 接受一个函数`resolver`作为参数，包装需要执行的处理程序，当处理结果为成功时，将成功的返回值作为参数调用`resolve` 方法，
如果失败，则将失败原因作为参数调用`reject`方法。

### 示例
``` js
const promise = new Promise(function (resolve, reject) {
  setTimeout(() => {
    // do something
    if (Math.random() * 10 > 5) {
      resolve({ status: 'success', data: '' })
    } else {
      reject(new Error('error'))
    }
  }, 500)
})
```

### Promise状态

Promise 创建后，必然处于以下几种状态

- `pending` : 待定状态，既没有被兑现，也没有被拒绝
- `fulfilled` : 操作成功。
- `rejected` : 操作失败。

当状态从 `pending` 更新为`fulfilled`或`rejected` 后，就再也不能变更为其他状态。

### Promise 实例方法

#### `.then(onFulfilled, onRejected)`
  *then()* 接收两个函数参数（也可以仅接收一个函数参数 onFulfilled）。
  - onFulfilled 函数参数，表示当 promise的状态从 `pending` 更新为`fulfilled` 时触发，并将成功的结果 value 作为`onFulfilled`函数的参数。
  - onRejected 函数参数，表示当promise的状态从 `pending` 更新为`rejected` 时触发，并将失败的原因 reason 作为 `onRejected`函数的参数。

#### `.catch(onRejected)`
  *catch()* 可以相当于 *.then(null, onRejected)*，即仅处理当promise的状态从 `pending` 更新为`rejected` 时触发。

#### `.finally(onFinally)`
  表示promise的状态无论是从`pengding`更新为`fulfilled`或`rejected`，当所有的 then() 和 catch() 执行完成后，最后会执行 finally() 的回调。

  由于无法知道promise的最终状态，`onFinally` 回调函数不接收任何参数，它仅用于无论最终结果如何都要执行的情况。


``` js
promise
  .then(function (res) {
    console.log(res) // { status: 'success', data: '' }
  })
  .catch(function (reason) {
    console.log(reason) // error: error
  })
  .finally(() => {
    // do something
  })
```

### 链式调用

使用Promise的一个优势是，可以链式调用的方式，执行多个`then()`/`catch()`方法。
且回调函数允许我们返回任何值，返回的值将会被包装为一个 promise实例，将值传给下一个`then()`/`catch()`方法。

``` js
promise
  .then(res => {
    res.data = { a: 2 }
    return res
  })
  .then(res => {
    console.log(res) // { status: 'success', data: { a: 2 } }
    throw new Error('cath error')
  })
  .catch(reason => {
    console.log(reason) // error: cath error
  })
```


## `Promise` 静态方法

### Promise.resolve(value)
返回一个状态由给定value决定的Promise对象。如果该值是thenable(即，带有then方法的对象)，返回的Promise对象的最终状态由then方法执行决定；否则的话(该value为空，基本类型或者不带then方法的对象),返回的Promise对象状态为fulfilled，并且将该value传递给对应的then方法。通常而言，如果您不知道一个值是否是Promise对象，使用Promise.resolve(value) 来返回一个Promise对象,这样就能将该value以Promise对象形式使用。

### Promise.reject(reason)
返回一个状态为失败的Promise对象，并将给定的失败信息传递给对应的处理方法

###  Promise.all(promises)
`all()` 允许传入一组promise实例，并返回一个新的promise实例。

promises并发执行，并且当这组promises的最终状态均更新为`fulfilled`时，才触发返回的promise实例的`onFulfilled`，
并将这组promises的执行结果，已promises的定义顺序，以数组的形式传给`onFulfilled`。
如果其中某个promise的最终状态更新为`rejected`，则立即触发返回的promise实例的`onRejected`。
#### 示例：
``` js
const promises = [
  Promise.resolve({ a: 1}),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ b: 1 })
    }, 0)
  })
]
Promise.all(promises).then(res => {
  console.log(res) // [ { a: 1}, { b: 1 } ]
})
```

#### 手写Promise.all 实现代码
``` js
function promiseAll(promises) {
  promises = promises || []
  let length = promises.length
  if (length === 0) return Promise.resolve([])
  let count = 0
  const list = []
  return new Promise((resolve, reject) => {
    const resolveFn = (res, index) => {
      list[index] = res
      count ++
      if (count >= length) {
        resolve(list)
      }
    }
    promises.forEach((item, i) => {
      if (item instanceof Promise) {
        item.then(res => resolveFn(res, i), reject)
      } else {
        resolveFn(item, i)
      }
    })
  })
}
```
### Promise.allSettled
`allSettled(promises)` 允许传入一组promise实例，并返回一个新的promise对象。

当这组promises的状态从`pending` 都更新到最终状态、无论最终状态是 `fulfilled` 或`rejected`时，触发返回的promise的`onfulfilled`。

`onfulfilled` 回调函数，根据promises定义的顺序，将执行结果以 `{ status: string, [value|reason]: any }[]` 的形式作为参数传入。

#### 示例
``` js
const promises = [
  Promise.resolve({ a: 1}),
  Promise.reject('reason')
]
Promise.allSettled(promises).then(res => {
  console.log(res) // [ { status: 'fulfilled’, value: { a: 1 } }, { status: 'rejected', reason: 'reason' }  ]
})
```


#### 手写Promise.allSettled 实现代码
``` js
function promiseAllSettled(promises) {
  promises = promises || []
  let length = promises.length
  if (length === 0) return Promise.resolve([])
  let count = 0
  const list = []
  return new Promise((resolve) => {
    const resolveFn =  (res, index, status) => {
      list[index] = { status }
      if (status === 'fulfilled') {
        list[index].value = res
      } else {
        list[index].reason = res
      }
      count ++
      if (count >= length) {
        resolve(list)
      }
    }
    promises.forEach((item, i) => {
      if (item instanceof Promise) {
        item.then(
          res => resolveFn(res, i, 'fulfilled'),
          reason => resolveFn(reason, i, 'rejected')
        )
      } else {
        resolveFn(item, i, 'fulfilled')
      }
    })
  })
}
```

### Promise.race

`Promise.race(promises)` 接收一组promise实例作为参数，并返回一个新的promise对象。

当这组promises中的任意一个promise的状态从`pending`更新为`fulfilled`或`rejected`时，返回的promise对象将会把该promise的成功返回值或者失败原因
作为参数调用返回的promise的`onFulfilled`或`onRejected`

#### 示例
``` js
const promises = [
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('timeout')
    }, 500)
  }),
  Promise.resolve('resolve')
]

Promise.race(promises).then(res => {
  console.log(res) // resolve
})
```

#### 手写Promise.race 实现代码
``` js
function promiseRace(array) {
  array = array || []
  return new Promise((resolve, reject) => {
    array.forEach(item => {
      if (item instanceof Promise) {
        item.then(resolve, reject)
      } else {
        resolve(item)
      }
    })
  })
}

```

## 参考资料

> [Promise A+ 规范](https://malcolmyu.github.io/2015/06/12/Promises-A-Plus/)
> 
> [MDN Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
>
> [MDN 使用Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)
