## react渲染优化
1. 父组件渲染导致子组件渲染，子组件并无发生改变，这种无谓的渲染
- shouldComponentUpdate
- PureComponent
- React.memo

### shouldComponentUpdate
通过shouldComponentUpdate生命周期函数，来对比 state 和 props，确定是否需要重新渲染，如果一致不需要渲染则返回 false

### PureComponent
和shouldComponentUpdate原理一样，通过对 props 和 state 做浅比较来实现shouldComponentUpdate

```jsx
if (this._compositeType === CompositeTypes.PureClass) {
 shouldUpdate = !shallowEqual(prevProps, nextProps) || ! shallowEqual(inst.state, nextState);
}
```


### React.memo
React.memo用来缓存组件的渲染，避免不必要的更新，其实也是一个高阶组件，与PureComponent十分类似，不同的是，React.memo只能用于函数组件(浅比较)

```jsx
import { memo } from 'react';
function Button(props) {
 // Component code
}

export default memo(Button);
```
如果需要深层次比较，这时候可以给memo传第二个参数传递比较函数
```jsx
function arePropsEqual(prevProps,nextProps){
    return prevProps === nextProps
}
export default memo(Button,arePropsEqual)
```
## 总结
随着业务的复杂，遇到性能问题的概率也在增高，组件颗粒化更小，也能减少子组件不必要的渲染

---
2. 性能优化
除了上面三种，还有以下优化手段
- 1. 避免使用内联函数
- 2. 使用React Fragments避免额外标记
- 3. 使用Immutable
- 4. 懒加载组件
- 5. 事件绑定方式
- 6. 服务端渲染

### 1.避免使用内联函数
在使用内联函数，每次调用render函数都会创建一个新的函数实例。我们应该组件内部创建一个函数，并将事件绑定到该函数本身
```jsx
import react from 'react'

export default class InlineFunctionComponent extends React.Component{
    render(){
        return(
            <input type="button" 
                onClick={(e) => { this.setState({inputValue:e.target.value}) }} value="Click For Inline Function" />
        ) 
    }
}
// 优化后
export default class InlineFunctionComponent extends React.Component {
    setNewStateData = (event) => {
        this.setState({
            inputValue: e.target.value
        })
    }
 
 render() {
     return (
      <input type="button" 
        onClick={this.setNewStateData} 
        value="Click For Inline Function" />
     )
 }
}
```


### 2. 使用React Fragments 避免额外标记
用户创建新组件时，每个组件应该有单个父标签，这时候我们应该使用Fragments(<></>),Fragments充当父标签，没有其他作用。这时候react不会给他打标记
```jsx
export default class NestedRoutingComponent extends React.Component {
    render() {
        return (
        <>
            <h1>This is the Header Component</h1>
            <h2>Welcome To Demo Page</h2>
        </>
        )
    }
}
```

### 3. 事件绑定方式
我们了解过四种事件绑定的方式

从性能方面：render方法中 使用bind和箭头函数。再每一次render的时候都会生成新的方法实例，性能欠缺
在constructor中使用bind，在定义阶段使用箭头函数这两种形式只会生成一种方法实例。


### 4. 使用Immutable
Immutable通过is方法则可以完成对比
```js
// 比较两个Map（或List）的值是否相等
var map1 = Immutable.Map({ a: 1,b: 1,c: 1 }); 
var map2 = Immutable.Map({ a: 1,b: 1,c: 1 });
console.log(Immutable.is(map1, map2));
```

### 5. 懒加载组件
1. 工程方面：webpack存在拆分代码 能力，为应用多创建几个包，运行时动态加载，减少初始包大小
react中用 Suspense 和 lazy 组件，实现代码拆分功能
```jsx
const johanComponent = React.lazy(() => import('./myAwesome.component'))

export const johanAsyncComponent = props => (
    <React.Suspense fallback={<Spinner/>}>
        <johanComponent {...props}/>
    </React.Suspense>
)
```

### 6.服务器渲染
使用服务器渲染，可以更快渲染完整的页面，服务器渲染需要起一个node服务，使用express、koa等，调用react的renderToString方法，将根组件渲染成字符串，再输入到响应中
```js
import { renderToString } from 'react-dom/server';
import MyPage from './MyPage'

app.get("/", (req, res) => {
 res.write("<!DOCTYPE html><html><head><title>My Page</title></head><body>");
 res.write("<div id='content'>"); 
 res.write(renderToString(<MyPage/>));
 res.write("</div></body></html>");
 res.end();
});
```
客服端使用render方法来生成HTML
```js
import ReactDom from 'react-dom';
import MyPage from './MyPage';

ReactDom.render(<MyPage/>,document.getElementById('app') )
```

## 总结
性能优化三个层面：
- 代码层面
- 工程层面
- 框架机制层面