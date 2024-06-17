## React router
> react-router: 是可以实现无刷新条件下切换显示不同得页面, 路由得本质就是页面URL发生改变时，页面得显示结果可以根据URL得变化而变化，但是页面不会刷新。
> 因此通过前端路由可以实现单页(SPA)应用

react-router主要分成几个不同得包
- react-router: 实现了路由的核心功能
- react-router-dom:基于react-router，加入了浏览器运行环境下的一些功能
- react-router-native：基于react-router,加入了react-native运行环境下的一些功能
- react-router-config：用于配置静态路由得工具库


### react-router-dom API
react-router-dom API主要提供了一些组件
- BrowserRouter、HashRouter
- Router
- Link、NavLink
- switch
- redirect

### BrowserRouter、HashRouter
Router 中包含了对路径改变的监听，并且会将相应的路径传递给子组件
BrowserRouter 是 history 模式、HashRouter 模式
```jsx
import { BrowserRouter as Router } from "react-router-dom"

export default function App(){
    <Router>
        < a href=" ">Home</ a>
    </Router>
}
```

### Router
Router用于路径匹配，然后进行组件的渲染
- path属性：用于设置匹配到的路径
- component属性：设置匹配到路径后，渲染的组件
- render属性：设置匹配到的路径后，渲染的内容
- exact属性: 开启精准匹配，只有完全一致才会渲染对应组件

```jsx
import { BrowserRouter as Router, Route} from 'react-router-dom'

export default function App(){
    return (
        <Router>
            <Route path="/" render={() => <h1>Welcome!</h1>} />
        </Router>
    )
}
```

### Link、NavLink
通常路径的跳转时使用Link组件，最终会被渲染成a元素，其中属性to代替a标题的href属性

NavLink是在Link基础之上增加的一些样式属性，例如组件被选中时，发生样式变化，则可以设置NavLink的属性：
- activeStyle: 活跃时（匹配时）的样式
- activeClassName：活跃时添加class

如下：
```jsx
<NavLink to="/" exact activeStyle={{color: "red"}}>首页</NavLink>
```
通过Router作为顶层组件包裹其他组件后，页面组件就可以接收到一些路由相关的东西，例如props.history
```jsx
const Contact = ({ history }) => {
    <Fragment>
        <h1>Contact</h1>
        <button onClick={() => history.push('/')}></button>
    </Fragment>
}
```
props 中接收到history对象具体有 goBack、goForward、push等方法

### redirect
路由重定向,执行redirect的to路径
```jsx
const About = ({
    isLogin:''
}) => {
    <Fragment>
        {isLogin ? '':<Redirect to='/home'></Redirect>}
    </Fragment>
}
```

### switch
switch组件的作用适用于当匹配到第一个组件，后面就不继续匹配了
```jsx
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about" component={About} />
  <Route path="/profile" component={Profile} />
  <Route path="/:userid" component={User} />
  <Route component={NoMatch} />
</Switch>
```
一些路由相关的组件之外，react-router还提供一些hooks，如下
- useHistory
- useParams
- useLocation

### useHistory
useHistory可以直接让组件访问history，无须通过props获取
```jsx
import { useHistory } from "react-router-dom";

const Contact = () => {
    const history = useHistory()
    return (
    <Fragment>
        <h1>Contact</h1>
        <button onClick={() => history.push("/")}>Go to home</button>
    </Fragment>
    );
}
```

### useParams
useParams可以获取到路径携带的参数
```jsx
const About = () => {
    const params = useParams()
    const {name} = params
}
```

### useLocation
useLocation 会返回当前url的location对象
```jsx
import { useLocation } from "react-router-dom";

const Contact = () => {
 const { pathname } = useLocation();
 return (
    <Fragment>
       <h1>Contact</h1>
       <p>Current URL: {pathname}</p >
    </Fragment>
    );
};
```

---
## 参数传递
参数传递的三种形式
1. 动态路由方式
2. search传递参数
3. to传入对象

### 1. 动态路由
动态路由：将path在Router匹配写出/detail/:id
```js
<NavLink to='/detail/12345'></NavLink>
<Switch>
    // ... Route
    <Route path="/detail/:id" component={Detail}/>
    <Route component={NoMatch} />
</Switch>

// 获取
const {id} = useParams()
// props.match.params.id
```

### 2.search传递参数
在跳转路径上添加了一些query参数
```jsx
<NavLink to="/detail?name=sue"></NavLink>

<Switch>
    <Route path="/detail" component={Detail}/>
</Switch>

// 获取
 const { name } = useLocation();
 // props.location.search
```

### 3.to传入对象
```js
<NavLink to={{
    pathname: "/detail",
    query: {name: "sue", age: 18},
    state: {height: 2, address: " "},
    search: "?apikey=123"
    }}>
</NavLink>

// 获取
console.log(props.location)
```

---
## Router的两种模式
> 单页面中，一个web项目只有一个html页面，一旦页面加载完成之后，就不能因为用户的操作而进行页面的重新加载或跳转

### 特性
1. 改变url且不让浏览器像服务器发送请求
2. 在不刷新页面的前提下动态改变浏览器地址栏中的URL地址

- hash模式：在url后面加个#，比如http://127.0.0.1:3000/home/#/page （HashRouter）
- history模式：允许操作浏览器的曾经在标签页或者框架里的访问会话历史记录 （BrowserRouter）

```jsx
// 1.import { BrowserRouter as Router } from "react-router-dom";
// 2.import { HashRouter as Router } from "react-router-dom";
import React from 'react';
import {
    BrowserRouter as Router,
    // HashRouter as Router 
    Switch,
    Route,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Backend from './pages/Backend';
import Admin from './pages/Admin';

function App() {
 return (
    <Router>
        <Route path="/login" component={Login}/>
        <Route path="/backend" component={Backend}/>
        <Route path="/admin" component={Admin}/>
        <Route path="/" component={Home}/>
    </Router>
    );
}
export default App;
```

### 原理
路由描述URL和UI之间的映射关系，这种映射是单向的，即URL变化引起UI更新（无需刷新页面）
在改变hash值时，并不会导致浏览器向服务器发送请求，浏览器不发出请求，也就不会刷新页面

hash值改变，触发全局window对象上的hashChange事件，所以hash模式路由就是利用hashChange事件监听URL变化，从而进行dom操作来模拟页面跳转，react-router也基于这个特性实现路由跳转

#### HashRouter
HashRouter包裹整个应用，通过window.addEventListener('hashChange',callback)监听hash值得变化，并传递给其嵌套的组件，然后通过context 将location数据往后代组件传递

```jsx
import React,{Component} from 'react'
import { Provider } from './context'

// 该组件下API提供给子组件使用
class HashRouter extends Component {
    constructor() {
        super()
            this.state = {
                location: {
                pathname: window.location.hash.slice(1) || '/'
            }
        }
    }
    // url location
    componentDidMount() {
        window.location.hash = window.location.hash || '/'

        window.addEventListener('hashchange', () => {
            this.setState({
                location: {
                    ...this.state.location,
                    pathname: window.location.hash.slice(1) || '/'
                }
            }, () => console.log(this.state.location))
        })
    }
    render() {
        let value = {
            location: this.state.location
        }
        return (
            <Provider value={value}>
                {this.props.children}
            </Provider>
        );
    }
}
export default HashRouter;
```

#### Router
Router组件主要是通过BrowserRouter传过来的值，通过props传进来的path与context传进来的pathname进行匹配，然后决定是否执行渲染组件
```jsx
import React,{ Component } from 'react';
import { Consumer } from './context'

const { pathToRegexp } = require("path-to-regexp");
class Route extends Component {
    render() {
        return (
            <Consumer>
            {
                state => {
                    console.log(state)
                    let {path, component: Component} = this.props
                    let pathname = state.location.pathname
                    let reg = pathToRegexp(path, [], {end: false})
                    // path pathname
                    if(pathname.match(reg)) {
                        return <Component></Component>
                    }
                    return null
                }
            }
            </Consumer>
        );
    }
}
export default Route;
```