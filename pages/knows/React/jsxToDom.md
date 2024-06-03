## JSX转换成dom
> JSX通过bebel转换成React.createElement

```jsx
<div>
    <img src="avatar.png" className='profile'/>
    <Hello/>
</div>

// -------被bebel转化后
React.createElement(
    "div",
    null,
    React.createElement('img',{
        src:"avatar.png",
        className:"profile"
    })
    React.createElement(Hello,null)
)
```
> babel编译时，会判断JSX组件得首字母，当首字母为小写时，其认定为原生DOM标签，createElement的第一个变量被编译为字符串。当首字母为大写时，其认定为自定义组件，createElement第一个变量被编译为对象


最后都会通过RenderDOM.render(...)方法进行挂载
```jsx
ReactDOM.render(<App/>, document.getElementById('root'))
```

### creatElement源码
```jsx
// 传入标签类型type、标签属性props 及若干子元素children，作用是生成一个虚拟Dom对象
function createElement(type, config, ...children) {
    if (config) {
        delete config.__self;
        delete config.__source;
    }
    // ! key ref
    const props = {
        ...config,
        children: children.map(child =>
            typeof child === "object" ? child : createTextNode(child)
        )
    };
    return {
        type,
        props
    };
}
function createTextNode(text) {
    return {
        type: TEXT,
        props: {
            children: [],
            nodeValue: text
        }
    };
}
export default {
    createElement
};
```

### 过程
节点类型
- 原生标签节点： type为字符串，如 div、span
- 文本节点：type就没有，这里是TEXT
- 函数组件： type是函数名
- 类组件：type是类名

```jsx
ReactDOM.render(element,containerl,callback)
```

> 首次调用时，容器节点里的所有DOM元素都会被替换，后续的调用则会使用React的diff算法进行高效更新

