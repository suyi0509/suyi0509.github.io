## React捕获异常

> 当出现问题导致程序奔溃是，react16引用了 **错误边界** 新的概念,
**错误边界**是一种React组件，组件捕获发生在其子组件树任何位置的JavaScript错误，并打印这些错误，同时展示降级UI，并不会渲染那些发生奔溃的子组件树


错误边界在渲染期间、生命周期方法和整个组件树的构造函数中捕获错误

#### 形成错误边界组件的两个条件

- 使用了 static getDerivedStateFromError()
- 使用了 componentDidCatch()

```js
// 抛出错误，1.使用static getDerivedStateFromError()渲染备用UI，2.使用componentDidCatch打印错误信息

class ErrorBoundary extends React.Component {
    constructor(props){
        super(props);
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error){
        // 更新state 下一次渲染能够显示降级后的UI
        return { hasError: true}
    }

    componentDidCatch(error,errorInfo){
        // 你同样可以将错误日志上报给服务器
        logErrorToMyService(error,errorInfo)
    }

    render(){
        if(this.state.hasError){
            // 你可以自定义降级后的UI并渲染
            return <h1>Something went wrong.</h1>
        }

        return this.props.children
    }
}

// 然后就可以用自身组件作为错误边界的子组件 
<ErrorBoundary>
    <MyWidget />
</ErrorBoundary>
```

#### 无法捕获到异常的事件
- 事件处理
- 异步代码
- 服务端渲染
- 自身抛出来的呃错误

> react16版本后，会渲染期间发生的所有错误到打印台上，除了错误信息，React16还提供组件栈追踪，可以准确看到组件树内的错误信息

对于无法捕获的异常，1. 采用try...catch  2.监听onerror事件
```jsx
// 1. 采用try...catch
class MyComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {error: null}
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        try{
            ...
        }catch(error){
            this.setState({error})
        }
    }

    render(){
        if(this.state.error){
            return <h1>Caught an error</h1>
        }
        return <button onClick={this.handleClick}>click Me</button>
    }
}
```

```jsx
//1. 监听onerror事件
window.addEventListener('error', function(event){})
```









