## 生命周期

> 生命周期（Life Cycle）包括创建、初始化数据、编译模板、挂载DOM、 渲染DOM、更新DOM、卸载DOM等一系列过程

在react16.4之后的生命周期，可以分成三个阶段
- 创建阶段
- 更新阶段
- 卸载阶段

[图片](../../../public/react2.png)

### 1. 创建阶段
创建阶段包含一下几个生命周期方法：
- constructor： 在方法内部通过super关键字获取来自父组件的props，通常用来初始化state状态或者this上挂载方法

- getDerivedStateFromProps：静态方法，不能访问组件实例，执行时机：组件创建和更新阶段，无论是props变化还是state变化也会调用，每次render方法前调用，第一个参数为即将更新的props，第二个参数为上一个状态的state，可以比较props和state来限制条件，防止无用得state更新，方法需要返回一个新的对象作为新的state或者返回null，表示state状态不需要更新

- render：用于渲染DOM结构，可以访问state和prop属性，不能在render里面setState，否则会触发死循环导致内存奔溃
  
- componentDidMount：组件挂载到真实DOM节点后执行，在render方法后执行，多用于执行一些数据获取、事件监听的操作

### 2. 更新阶段
更新节点主要包含几个生命周期
- getDerivedStateFromProps: 同上

- shouldComponentUpdate：用于告知组件本身基于当前 props 和 state 是否需要重新渲染组件，默认情况返回 true
执行时机：到新的props 或者是 state 都会调用，通过返回true或者false告知组件更新与否，一般情况下，不建议在该生命周期方法中进行深层比较，会影响效率，同时不能调用setState，否则会导致无限循环调用更新

- render：同上

- getSnapshotBeforeUpdate: 周期函数在render后执行，执行得时候DOM元素还未被更新，该方法返回一个Snapshot值，作为componentDidUpdate第三参数传入
```js
getSnapshotBeforeUpdate(prevProps,prevState){
    console.log('### 我进来了 getSnapshotBeforeUpdate')
    return '123'
}

componentDidUpdate(prevProps,prevState,snapshot){
    console.log('### 我又进来了 componentDidUpdate',snapshot) // 123
}
```
 
- componentDidUpdate
执行时机：组件更新结束后触发
在该方法时，可以根据前后的props和state的变化做出相应的操作，如获取数据、修改DOM样式


### 3. 卸载阶段
- componentWillUnmount
用于组件卸载前，清理一些注册是监听事件或者取消订阅的网络请求等，一旦一个组件实例被卸载，其不会被再次挂载，只可能是被重新创建


新版生命周期减少了以下三种方法：
- componentWillMount
- componentWillReceiveProps
- componentWillUpdate
其中三个方法都存在，只是前者加上了 UNSAFE_ 前缀

新增了两个生命周期函数:
- getDerivedStateFromProps
- getSnapshotBeforeUpdate


