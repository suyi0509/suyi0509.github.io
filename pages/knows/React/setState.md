## 类组件setState

> 我们都如果直接调修改state，this.state.message = 'hello word'，是不生效的。因为它并不像vue2调用Object.defineProperty或者vue2调用Proxy监听数据变化。必须通过setState告知改变

### 源码
```jsx
Component.prototype.setState = function(partialState, callback) {
    invariant( // 第一参数是对象/函数，第二对象是回调函数
    typeof partialState === 'object' ||
    typeof partialState === 'function' ||
    partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
    'function which returns an object of state variables.',
    );
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```

### 更新类型
- 异步更新
- 同步更新

```jsx
this.state={
    message:'hello world'
}

// 1. 异步更新
this.setState({
    message:'你好'
})
console.log(this.state.message) // hello world (拿不到最新的值)
// 想要获取最新的值，需要在第二个回调中执行
this.setState({
    message:'你好'
},() =>{
    console.log(this.state.message) // 你好
})

// 2. 同步更新
setTimeout(() => {
    this.setState({
        message:"你好啊！"
    })
    console.log(this.state.message)// 你好啊！
},0)
```

- 在组件生命周期和React合成事件中，setState是异步的
- 在setTimeout或者元素dom事件中，setState是同步的

> React合成事件: 在React中，事件处理是一个核心概念，但React并不直接使用DOM事件，而是实现了一套自己的事件系统，称为“合成事件”（SyntheticEvents）,它在DOM事件的基础上进行了封装，提供了统一的接口和更好的跨浏览器兼容性。React合成事件不是真实的DOM事件，但它提供了与DOM事件相似的接口

> 元素dom事件: buttonRef.current.addEventListener 、 buttonRef.current.removeEventListener


### 批量更新
```jsx
handleClick = () => {
    this.setState({
        count: this.state.count + 1,
    })
    console.log(this.state.count) // 1
    this.setState({
        count: this.state.count + 1,
    })
    console.log(this.state.count) // 1
    this.setState({
        count: this.state.count + 1,
    })
    console.log(this.state.count) // 1
}
// 对同一个值，多次setState实际上等价于
Object.assign(
    previousState,
    {index: state.count + 1},
    {index: state.count + 1},
     ...
)
// 解决方案
handleClick = () => {
    this.setState((pre,props) => {
        return {count: pre.count + 1}
    })
    console.log(this.state.count) // 1
    this.setState((pre,props) => {
        return {count: pre.count + 1}
    })
    console.log(this.state.count) // 2
}

```