## React 组件通信

> 组件通信：组件通过某种方式来传递信息以达到某个目的

### 通信方式
1. 父组件 -> 子组件 传递
2. 子组件 -> 父组件 传递
3. 兄弟组件之间得通信
4. 父组件 -> 后代组件传递
5. 非关系组件传递

#### 1. 父组件 -> 子组件 传递
由于React得数据流动是单向得，父组件向子组件传递是最常见得方式，通过props传递
```js
function  Son(props){
    return <div>{props.name}</div>
}
ta
const father = <Son name={'i am father'}></Son>
```

#### 2. 子组件-> 父组件 传递
子组件向父组件通信：父组件向子组件传一个函数，通过函数得回调，拿到子组件传递过来得值
```js
class Parents extends Component{
    constructor(){
        super();
        this.state = {
            price: 0
        }
    }

    getItemPrice(e){
        this.setState({
            price:e
        })
    }

    render(){
        return (
            <div></div>
            <Child getPrice={this.getItemPrice.bind(this)} />
        )
    }
}


class Child extends Component{
    handleClick(e){
        this.props.getPrice(e)
    }
    render(){
        return <div onClick={this.handleClick.bind(this,100)}></div>
    }
}
```

#### 3.兄弟组件之间的通信
兄弟组件之间传递，则父组件作为中间层来实现数据的互通，通过使用父组件传递
```js
class Parent extends React.Component{
    constructor(props){
        super(props)
        this.state = {count : 0}
    }
    setCount = () => {
        this.setState({ count: this.state.count + 1})
    }

    render(){
        return (
         <SonA count={this.state.count}></SonA>
         <SonB count={this.setCount}></SonB>
        )
    }

}

```

#### 4. 父组件向后代传递
父组件向后代组件传递数据是一件最普通的事情，就像全局数据一样
使用context提供组件之间通信的一种方式，共享数据，通过React.createContext创建一个context

```js
const PriceContext = React.createContext('price')
/** 当context创建成功后，其下存在Provider组件用于创建数据源，Consumer组件用于接收数据 */

Provider 组件通过value属性用于给后代组件传递数据
<PriceContext.Provider value={100}></PriceContext.Provider>


// 获取数据
class MyClass extends React.Component{
    static contextType = PriceContext
    render(){
        let price = this.context
    }
}

Consumer组件
<PriceContext.Consumer>
    {price => <div>price:{price}</div>}
</PriceContext.Consumer>
```


#### 5.非关系组件传递
全局资源管理：实现通信，例如redux、mobx

---