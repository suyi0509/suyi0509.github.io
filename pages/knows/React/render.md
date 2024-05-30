## React render
- 在类组件中，render指的是render方法
- 在函数组件中，render指的是函数组件本身

```jsx
class Index extends Component{
    render(){
        return <h1>Index</h1>
    }
}

function Index() {
    return <h1>Index</h1>
}
```

在render中，jsx会通过babel编译后转化成我们熟悉的js格式
```jsx
return (
    <div className='cn'>
        <Header> hello </Header>
        <div> start </div>
        Right Reserve
    </div>
)
/** ------------babel编译后------------ */
return (
    React.createElement(
        'div',
        {
            className : 'cn'
        },
        React.createElement(Header,null,'hello'),
        React.createElement('div',null,'start'),
        'Right Reserve'
    )
)

// createElement接收三个参数
/**
 * 1. type: 标签
 * 2. attributes：标签属性，若无则为null
 * 3. children: 标签的子节点
 */
// 在render过程中，render将调用的render函数返回的树与旧版本的树进行，这一步决定如何更新Dom的必要步骤，进行diff比较，更新Dom树
```

### 触发时机
1. 类函数调用setState修改状态时
2. 函数组件通过useState hook修改状态时
3. 类组件重新渲染时，每一次子组件都会重新render
4. 函数组件重新渲染时，只有首次会触发Foo render

### 总结
1. 类组件只要执行了setState方法，就一定会触发render函数执行
2. 函数组件使用useState方法更改状态，不一定导致重新render
3. 组件得props改变，如果props是来自父组件、祖先组件得state，就一定会导致子组件得重新渲染

> 一旦执行了setState则重新渲染，执行useState会判断当前值有无发生改变确定是否执行render方法，一旦父组件发生渲染，子组件也会渲染