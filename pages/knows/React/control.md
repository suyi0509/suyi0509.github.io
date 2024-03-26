## 受控组件和非受控组件

> 受控组件，就是受我们控制的组件，组件状态完全响应，通过this.state改变

> 非受控组件，简单来说就是不受我们控制的组件,可通过ref查询DOM

---

## 事件机制
>  React基于浏览器的事件机制自身实现了一套事件机制，包括事件注册、事件合成、事件冒泡、事件派发等，这套事件被称为合成事件

### 合成事件（syntheticEvent）
合成事件是 React 模拟原生DOM事件所有能力的一个事件对象，即浏览器原生事件的跨浏览器包装器

- 获取原生DOM事件，可以通过e.nativeEvent属性获取

React事件和原生事件的区别
- 事件名称命名方式不同
```js
// 原生事件绑定方式
<button onclick="handleClick()">原生事件绑定方式</button>

// React合成事件绑定
const button = <button onclick={handleClick}>React合成事件绑定</button>
```

- 事件处理函数书写不同
```js
// 原生事件 事件处理函数写法
<button onclick="handleClick()"></button>

// React合成事件 事件处理函数写法
const button = <button handel={handleClick}></button>
```
看上去是绑定到DOM元素上，实际并不会把事件代理函数直接绑定到真实的节点上，而是把所有的事情绑定到结构的最外层，使用一个统一的事件去监听，这个事件监听器维持了一个映射来保存所有组件内部的事件监听和处理函数。当组件挂载或卸载时，只是在这个统一的事件监听器插入或删除一些对象

当事件发生时，首先被这个统一的事件监听器处理，然后映射里找到真正的事件处理函数并调用

### 执行顺序
1. React 所有事件都会挂载在 document 对象上
2. 当真实的DOM元素触发事件，会冒泡到document对象后，再处理React事件
3. 所以会先执行原生事件，然后再处理React事件
4. 最后真正执行document上挂载的事件

[图片](../../../public/react1.png)

- 阻止合成事件间得冒泡，用e.stopPropagation()
- 阻止合成事件与最外层document上的事件间的冒泡用e.nativeEvent.stopImmediatePropagation()
- 阻止合成事件与除最外层document上的原生事件上的冒泡，通过判断e.target来避免

```js
document.body.addEventListener('click',e => {
    if(e.target && e.target.matches('div.code')) return
    this.setState({ active: false})
})
```
---

### react事件机制总结
- react上注册的事件最终会绑定在document这个DOM上。而不是React组件对应的DOM（减少内存开销就是因为所有事件都绑定在document，其他节点没有绑定事件）
- React自身实现了一套事件冒泡机制，所以这就是我们为什么event.stopPropagation()
- React通过队列的形式，从触发的组件向父组件回缩，然后调用他们JSX中定义的callback
- React有一套自己的合成事件SyntheticEvent