## middleware中间键

> 中间件(middleware)是介于应用系统和系统软件之间的一类软件。它的作用是衔接 系统软件的基础服务 和 网络上应用系统的各个部分或不同的应用，能够达到资源共享、功能共享的目的。
> - 中间件就是在 dispatch过程中，在分发action的时候进行拦截处理

- 当需要支持异步操作，或者支持错误处理、日志监控等，过程就可以用上中间件

### 本质
本质上是一个函数，对store.dispatch方法做改造，在发出action 和执行Reducer这两步之间添加了其他功能

### 常见的中间件
- redux-thunk: 用于异步操作
- redux-logger：用于日志记录
- redux-saga: 用于异步操作

上述中间件都需要通过applyMiddlewares进行注册,作用是将所有的中间件组成一个数组，依次执行。然后再作为第二个参数传入createStore中
```jsx
const store = createStore(
    reducer,
    applyMiddleware(thunk, logger)
);
```

#### redux-thunk
redux-thunk是官网推荐的异步处理中间件,默认情况下dispatch(action),action需要一个JavaScript的对象,redux-thunk中间件会判断你当前传进来的数据类型，如果是一个函数，将会给函数传入(dispatch,setState)

- dispatch函数用于我们再次派发action
- getState函数考虑到我们之后的一些操作需要依赖原来的状态，用于让我们可以获取之前的一些状态

dispatch写成函数的形式
```jsx
const getHomeMultidataAction = () => {
    return (dispatch) => {
        axios.get("http://xxx.xx.xx.xx/test").then(res => {
            const data = res.data.data
            dispatch(changeBannersAction(data.banner.list))
            dispatch(changeRecommendAction(data.recommend.list))
        })
    }
}
```

#### redux-logger
实现一个日志功能，可以直接使用redux-logger
```jsx
import { applyMiddleware, createStore } from './redux'
import createLogger from 'redux-logger'

const logger = createLogger()
const store = createStore(
    reducer,
    applyMiddleware(logger)
)
```
---

### 实现原理
#### applyMiddlewares源码
```jsx
export default function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState, enhancer) => {
        var store = createStore(reducer, preloadedState, enhancer);
        var dispatch = store.dispatch;
        var chain = [];
        var middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        };
        chain = middlewares.map(middleware => middleware(middlewareAPI));
        dispatch = compose(...chain)(store.dispatch);
        return {...store, dispatch}
    }
}
```
所有中间件被放入一个数组chain中，然后嵌套执行，最后执行store.dispatch; middlewareAPI拿到了 getState、dispatch两个方法。在redux-thunk中，内部会将dispatch进行一个判断，然后执行该操作
```jsx
function patchThunk(store){
    let next = store.dispatch;
    function dispatchAndThunk(action) {
        if (typeof action === "function") {
            action(store.dispatch, store.getState);
        } else {
            next(action);
        }
    }
    store.dispatch = dispatchAndThunk;
}

// 日志输出原理
let next = store.dispatch
function dispatchAndLog(action){
    console.log("dispatching:", addAction(10));
    next(addAction(5));
    console.log("new state:", store.getState());
}

store.dispatch = dispatchAndLog;
```
