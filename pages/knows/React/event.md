## React事件绑定的方式

> 事件名都是小驼峰写法， onclick => onClick

### 绑定方法
1. render方法 bind
2. render方法里面使用箭头函数
3. constructor中bind
4. 定义阶段使用箭头函数绑定


### 区别
1. 编写方面：方式1，2写法简单， 方式3过于复杂
2. 性能方面：方式1和方式2，在每次组件render的时候都回生成新的方法实例，性能问题欠缺，若该函数作为属性值传给子组件的时候,都会导致额外的渲染。而方式三、方式四只会生成一个方法实例

--- 
## 如何构建组件
1. 函数式创建
2. 通过React.createClass方法创建
3. 继承React.Component创建

### 1. 函数式创建
在 react hook 出来之前，函数式组件是无状态组件，只负责传入Props来展示数据，和state状态无关

```js
function HelloComponent(props){
    return <div>hello，{props.name}</div>
}
```

### 2.通过React.createClass方法创建
```js
function HelloComponent(props){
    return React.createElement{
        'div',
        null,
        'Hello',
        props.name
    }
}
```

### 3.继承React.Component创建
在react hooks出来前，有状态的组件只能通过继承React.Component这种形式进行创建
```js
class HelloComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {second: 0 }
    }

    componentDidMount(){
        this.interval = setInterval(()=> this.tick(), 100)
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    tick() => {
        this.setState(state => {
            second: state.second + 1
        })
    }

    render(){
        return (<div>Second:{this.state.second}</div>)
    }
}
```


