## virtual Dom
> Real DOM: 真实的DOM，文档对象模型

> Virtual DOM：本质上是JS对象形式存在的对Dom的描述

```jsx
// 创建 h1 标签，右边千万不能加引号
const vDom = <h1>Hello World</h1>

// 找到 id === 'root' 的节点
const root = document.getElementById('root')

// 把创建h1标签渲染到root节点上
ReactDOM.render(vDom, root)
```

JSX是语法糖, 使用过程中会被babel进行编译转化成JS代码
```jsx
// vDom
const vDom = React.createElement({
    'h1',
    {className:'hClass', id:'hId'},
    'hello world'
})
```
JSX简化直接调用React.creatElement() 方法
1. 第一个参数：标签名，如：h1、span、table
2. 第二个参数：存着标签的一些属性，如id、class等
3. 第三个参数: 节点中的文本

### 区别
- vDom不会进行排版和重绘，dom会进行频繁排版和重绘
- vDom总损耗：vDom增删改 + dom差异增删改 + 排版重绘
- dom总损耗：dom完全增删改 + 排版重绘，操作dom会从构建dom树从头到尾执行一遍流程


> 当需要更新10个Dom节点，直接操作dom，最后会按流程执行10次流程

> 操作vDom，更新10个节点，首先会通过diff算法计算不同，更新保存到本地的一个js对象中，最后一次性attach到Dom树，避免大量无畏计算


### 优缺点
DOM:
- 优点: 易用
- 缺点：
-   -  1. 效率低，解析速度慢，内存占用率高
-   -  2. 性能差，频繁操作dom,会导致重绘和回流

vdom：
- 优点：
- - 1. 简单方便
- - 2. 性能好，避免dom频繁更新，减少重绘和回流，提高性能
- - 3. 跨平台，React借助vDom，带来多端运行(web、React native、Electron、SSR)
- 缺点
- - 1. 一些性能要求极高的虚拟dom无法进行针对性极致优化
- - 2. 首次渲染大量DOM时，由于多一层虚拟DOM计算，速度比正常稍慢