## 高阶组件

> 高阶函数(Higher-order function): 1.接受一个或多个函数作为输入、 2.输出一个函数

高阶函数，要接受一个或多个组件作为参数并且返回一个组件，本质上就是一个函数，并不是一个组件

```js
const EnhancedComponent = highOrderComponent(WrappedComponent)
```

- 高阶函数的实现方式，本质上是一个装饰者的设计模式


### 编写模板
```js
import React, { Component } from 'react';

export default (WrappedComponent) => {
    return class EnhancedComponent extends Component{
        // do something
        render(){
            return <WrappedComponent/>
        }
    }
}
```
对传入的原始函数 WrappedComponent 做一些你想要的操作，比如 props，提取state，给原始组件包裹其他元素等，从而加工出想要的组件 EnhancedComponent。

高阶函数主要的功能都是：封装并分离组件的通用逻辑，让通用逻辑在组件中更好的被复用

---
### 高阶组件约定
1. props保持一致
2. 不能在函数式（无状态）组件上使用ref属性，因为它没有实例
3. 不要以任何方式改变原始组件 WrappedComponent
4. 透传不相关props属性被包裹的组件 WrappedComponent
5. 不要再render()方法中使用高阶组件
6. 包装显示名字以便于调试

高阶组件可以传递所有props，但是不能传递ref，如果要向高阶组件添加refs，那么ref指向的是最外层容器组件得实例，而不是被包裹得组件，需要传递refs得话，需要使用React.forwardRef

```js
function WithLogging(WrappedComponent){
    class Enhance extends WrappedComponent{
        componentWillReceiveProps(){
            console.log('Current Props',this.props)
            console.log('Next Props',nextProps)
        }
        render(){
            const {forwardedRed，...rest} = this.props
            // 把forwardedRef 赋值给 ref
            return <WrappedComponent {...rest} ref={forwardedRef}></WrappedComponent>
        }
    }

    // React.forwardRef 方法会传入props和ref两个参数给其回调函数
    // 所以这边ref是由React.forwardRef 提供的
}
```


### 应用场景
高阶组件是用来提高代码的可复用性和灵活性，常用于与核心业务无关，但又在多个模块上使用的功能，如：权限控制、日志记录、数据校验、异常处理、统计上报

#### example1
> 存在一个组件，需要从缓存中获取数据，然后渲染

```jsx
import React,{ Component } from 'react'
class MyComponent extends Component { 
    componentWillMount(){
        let data = localStorage.getItem('data')
        this.setState({data})
    }

    render(){
        return <div>{this.state.data}</div>
    }
}

```

```jsx
import React, { Component } from 'react'

function withPersistentData(WrappedComponent){
    return class extends Component{
        componentWillMount(){
            let data = localStorage.getItem('data');
            this.setState({data})
        }
    }

    render(){
        // 通过{...this.props}把传递给当前组件得属性继续传递给包装得组件WrappedComponent
        return <WrappedComponent data={this.state.data} {...this.props} />
    }
}


class MyComponent2 extends Component{
    render(){
        return <div>{this.props.data}</div>
    }
}

const MyComponentWithPersistentData = withPersistentData(MyComponent2)
```

---
#### example2
> 组件渲染性能监控

```jsx
function withTiming(WrappedComponent){
    return class extends WrappedComponent{
        constructor(props){
            super(props)
            this.state = 0
            this.end = 0
        }

        componentWillMount(){
            super.componentWillMount && super.componentWillMount()
            this.start = Date.now()
        }

        componentDidMount(){
            super.componentDidMount && super.componentDidMount()
            this.end = Date.now()
            console.log(`${WrappedComponent.name}组件渲染时间为${this.end - this.start} ms`)
        }

        render(){
            return super.render()
        }
    }
}

class Home extends React.Component{
    render(){
        return <div>hello world</div>
    }
}

const MyComponentWithTimingData = withTiming(Home)
```