---
title: Vue组件间通信
lang: zh-CN
tags: 
  - vue
createTime: 2018/07/20 11:15:27
permalink: /article/iezlvhvg
author: pengzhanbo
top: false
type: null
---
在我们在进行基于[Vue](https://cn.vuejs.org/)的项目开发时，组件间的数据通信，是我们必须考虑的。

<!-- more -->

> 注： 本文所实现的方式，是在不考虑`vuex`下所做的实现。


我把组件间的关系，大致分为三种：
1. 父子组件
    ``` html
    <parent>
        <child></child>
    </parent>
    ```
    拥有类似结构，`parent`组件包含`child`组件，则`child`组件是`parent`的子组件，`parent`组件是`child`组件的父组件。
2. 兄弟组件
    ``` html
    <item></item>
    <item></item>
    ```
    两个`item`组件在结构上同级，我们称之互为兄弟组件。
3. 跨多级组件
    ``` html
    <list>
        <item>
            <message><message>
        </item>
    </list>
    <dialog>
        <content></content>
    </dialog>
    ```
    在这个结构中，`<list>`和`<message>`并不是直接的父子组件，中间还跨了一个级，在实际场景中，还会有跨更多层级的组件关系。`<message>` 和 `<content>` 组件两个既不是兄弟组件，又不是父子组件，而是跨了兄弟，父子的多级关系，实际场景中也会有发生交互。

那么这三种关系的组件，我们应该如何进行组件通信？

### 父子组件通信

要讲父子组件的通信，首先，我们需要了解 `vue` 组件的 特性。
1. 单向数据流，数据自上而下。
    > Prop 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是反过来不会。这是为
    >了防止子组件无意间修改了父组件的状态，来避免应用的数据流变得难以理解。

2. 事件自下而上。

    组件内部状态的变化，通过事件往上冒泡，通知上一级组件，由上一级组件监听事件，并触发相应回调。

基于以上，父子组件通信推荐的方式是：

父组件通过`props`将状态传到子组件，子组件通过事件将状态冒泡到父组件，由父组件监听触发回调改变状态。

`parent.vue`
``` html
<template>
    <div class="parent">
        <child
            :name="name"
            @name-change="nameChange"
        >
        </child>
    </div>
</template>
<script>
import Child from './child';
export default {
    name: 'parent',
    data () {
        return {
            name: 'Jack'
        };
    }
    methods: {
        nameChange(name) {
            this.name = name;
        }
    },
    components: {
        Child
    }
}
</script>
```
`child.vue`
``` html
<template>
    <div class="child">
        <span>{{name}}</span>
        <button @click="onClick">change name</button>
    </div>
</template>
<script>
export default {
    name: 'child',
    props: {
        name: {
            type: String,
            defualt() {
                return '';
            }
        }
    },
    methods: {
        onClick() {
            this.$emit('name-change', 'John');
        }
    }
}
</script>
```
在某些例子或个人项目中，经常有发现到在子组件中使用 `this.$parent` 直接改变父组件的状态，诚然这种方式能够简化两个深耦合的组件的数据通信，在一些简单的场景中也会比较方便，但其实并不推荐采用这种方式实现父子组件通信，这样做的后果就是导致了数据流的不明确性，牺牲了单项数据流的简洁性，数据的变化流动变得不易于理解。

### 兄弟组件通信、跨多级组件通信

这两种组件关系，并没有直接的联系。

如兄弟组件，我们会很自然的想到使用他们的父级组件作为中转，将 `子组件1` 的状态通信到父组件，再由父组件通过 `props` 流向 `子组件2` ，反之亦然，但是如果兄弟组件间的交互复杂，但又与父组件没有存在直接的交互关联，父组件在这个过程当中，承担了多余的职责。

又如跨多级组件，上述例子中，`<list>`和`<message>`之间间隔了多层，如果我们继续使用父子组件通信`prop`和事件冒泡，中间的层需要重复的定义`prop`和事件，这显然也导致了它们承担了多余的职责。 `<message>` 和 `<content>` 组件之间，更是在结构上没有关联，`prop`和事件冒泡显得十分乏力，无法直接完成通信。

那么这两种组件关系，该如何完成通信，又不对它们中间层级组件，或者父级组件造成多余的干扰？

由于两种组件关系没有直接的关联，所以我们需要有一个桥梁，能够直接连接它们，使它们变得有关联。即，我们需要一个`中间件`。

官方给我们的解决方案是`vuex`，但我认为它更多是的作为全局状态的管理，使用它作为某两个组件的通信中间件，显得大材小用，所以我这里不做讨论。

我所采取的方案是使用 自定义事件 完成组件通信。

__实例化Vue__

`vue`已实现了一套事件系统，可以很方便的使用它来完成我们的组件通信。

``` javascript
let middleware = new Vue();
export defualt middleware;
```
`message.vue`
``` javascript
export default {
    name: 'message',
    data () {
        return {
            info: 'hello'
        };
    },
    methods: {
        sayHello() {
            middleware.$emit('say-hello', this.info);
        }
    }
};
```
`content.vue`
``` javascript
export default {
    name: 'content',
    data() {
        return {
            info: '';
        }
    },
    created() {
        middleware.$on('say-hello', info => {
            this.info = info;
        });
    }
}
``` 
我们通过 `middleware`， 在`content.vue`注册了`say-hello`事件，当`message.vue`触发该事件时，`content.vue`监听到事件触发回调，从而实现了状态传导。

组件数据传导不再是通过`props`传导，而是通过事件进行通信。

__如果不使用实例化Vue的方式去完成，我们也可以自己实现一套自定义事件。__ 这可以做更加个性化的自定义事件，满足项目中的多样的使用场景。
``` javascript
class Event{
    constructor() {
        // some props
    }
    on() {
        // do something
    }
    emit() {
        // do something
    }
    off() {
        // do somethig
    }
}
```

### 总结
复杂结构的组件通信，实现它们的通信，关键是实现中间件作为桥梁连接它们，无论是使用自定义事件，还是其他的方案。
