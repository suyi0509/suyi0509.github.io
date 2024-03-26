## 基础知识

> React,用于构建用户页面的JS库，提供了UI层面的解决方案

使用虚拟DOM来有效操作DOM，遵循从高阶组件到低阶组件的单向数据流
书写JSX，最终会被babel编译为合法的JS语句输出

### 特性
- JSX语法
- 单向数据绑定
- 虚拟DOM
- 声明式编程: 关注你要做什么，而不是怎么做。命令式
- Component


### Component
在React中，一切皆为组件。

- 可组合：每个组件易于和其它组件一起使用，或者嵌套在另一个组件内部
- 可重用：每个组件都是具备独立功能，可使用在多个UI场景中
- 可维护：每个小的组件仅仅包含自身的逻辑，更容易理解和维护

### 优势
- 高效灵活
- 声明式设计，简单使用
- 组件式开发，提高代码复用率
- 单向响应的数据流会比双向绑定的更安全，速度更快

---
### state和props
相同点：
- 两者都是JS对象，都可以用来保存信息
- props和state都可以触发渲染更新
不同点:
- props是外部传递给组件的，而state是组件内组件自己管理的，一般为constructor中初始化
- props在组件内部是不可修改的，而state是多变的，在组件内部是可以进行修改

### super() 和 super(props)区别
- ES6
> 如果在子类中不使用 super, 关键字，则引发报错，原因：子类没有自己的this对象，只能继承父类的this对象，然后对其进行加工，而super()就是将父类中的this对象继承给子类，没有super()子类就得不到this对象

在子类constructor中，必须用super才能引用this

- 类组件
> 在React中，类组件是基于ES6的规范实现的，继承React.Component，因此如果用到constructor就必须写super()才初始化this，但是在render中 this.props 是可以使用的，这是React自动附带的

>不建议使用super()代替super(props),因为在React类组件构造函数生成实例后再给this.props赋值，所以在不传递props在super()的情况下，调用this.props为undefined。 而super(props)则正常访问

```js
Class Test extends React.Component { 
    constructor(props)
    super()//不传props
    console.log(props) // {}
    console.log(this.props)// undefined
}

Class Test extends React.Component { 
    constructor(props)
    super(props)//传props
    console.log(props) // {}
    console.log(this.props)// {}
}
```
在React中，类组件基于ES6，所以在constructor中必须使用super
在调用super过程中，无论是否传入props，React内部都会将props赋值给组件实例props属性中
如果只调用super()，那么this.props在super()和构造函数结束之间仍时undefined
