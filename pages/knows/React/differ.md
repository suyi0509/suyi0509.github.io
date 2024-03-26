## 类组件和函数组件

### 类组件
> 用ES6去编写形式去编写组件， 该类必须继承React.Component
> 访问父组件传递过来的参数，是通过this.props方式
> 组件中必须实现render方法，在return中返回React对象


```js
class Test extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return <h1>Hello,{this.props.name}</h1>
    }
}
```

### 函数组件
> 函数组件，通过函数编写的形式去实现一个React组件
```js
function Test(props){
    return <h1>Hello,{props.name}</h1>
}
```
函数第一个参数 props 用于接收父组件传递过来的参数

---

### 区别
- 编写形式： 编写形式和上面描述的
- 状态管理: hooks出来之前，函数组件就是无状态组件，不能保管组件的状态，不像类组件中调用setState,出了hooks就可以用useState
```js
const FunctionalComponent = () => {
    const [count,setCount] = React.useState(0)
    return (
        <div>
            <p>count:{count}</p>
            <button onClick={()=> setCount(count + 1)}>count++</button>
        </div>
    )
}
```
- 生命周期
在函数组件中，就不存在生命周期。这生命周期钩子都来自于继承的React.Component,类组件就要用到生命周期，函数使用useEffect能替代生命周期的作用
```js
const FunctionalComponent = (props) => {
    React.useEffect(() => {
        return () => {
            console.log('Bye')
        }
    },[])

    return <h1>bye,{this.props.name}</h1>
}
```
- 调用方式
函数组件，直接调用执行函数即可
```js
function SayHi(){
    return <p>Hello</p>
}

const SayBye = SayHi(props)
```

一个类组件则需要将组件进行实例化，调用实例对象的render方法
```js
class SayHi extends React.Component {
    render(){
        return <p>Hello，React</p>
    }
}

// React内部
const instance = new SayHi(props) // 
const result = instance.render() // <p>Hello，React</p>
```

- 获取渲染的值
函数组件
```js
function FuncComponent(props) {
    const getNames = () => {
        alert('name:' + props.name)
    }

    const handleClick = () =>{
        getNames()
    }

    return(
        <button onClick={handle}></button>
    )
}
```

类组件
```js
class ClassComponent extends React.Component{
    getNames() {
        alert('name:' + this.props.name)
    }

    handleClick(){
        getNames()
    }

    render(){
        return(
            <button onClick={handle}></button>
        )
    }
}
```

实现的功能是一致的，类组件中，输出this.props.name，Props在React中是不可变的所以它永远不会改变，但是this总是可变的，以便在render和生命周期函数中读取新版本

因此在组件请求运行更新时，this.props将会改变，getNames方法从最新的 props 中读取name，而函数组件，本身就不存在this，props并不发生改变，因此同样是点击，输出内容依旧是之前的内容