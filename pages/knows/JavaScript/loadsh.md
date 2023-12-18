## 防抖节流

> 防抖节流都是防止多次数调用某个方法

- 节流：n秒内只运行一次，若n秒内重复触发，只有第一次生效
- 防抖：n秒后执行该事件，若n秒内被重复触发，否则重新计时, 只有最后一次生效

### 应用场景
- 节流：间隔一段时间执行一次回调
  1. 滚动加载：加载更多、滚到底部监听

- 防抖：在连续调用，只走最后一次
  1.搜索框搜索输入。只需用户最后一次输入完，再发送请求
  2.手机号、邮箱验证输入检测
  3.窗口大小resize，只需窗口调用完成后，计算窗口大小。防止重复渲染

### 代码实现
#### 节流
- 1.节流使用时间戳的写法
```js
function throttled1(fn,delay = 500){
    let oldtime = Date.now()
    return function(...args){
        let newtime = Date.now()
        if(newtime - oldtime >= delay){
            fn.apply(null,args)
            oldtime = Date.now()
        }
    }
}
```

- 2.节流使用定时器的写法
```js
function throttled2(fn,delay = 500){
    let timer = null
    return function(...args){
        if(!timer){
            timer = setTimeout(() => {
                fn.apply(this.args)
                timer = null
            },delay)
        }
    }
}
```

- 3.结合时间戳和定时器，实现更加精准的节流
```js
function throttled(fn,delay){
    let timer = null
    let starttime = Date.now()
    return function(){
        let curTime = Date.now()  // 当前时间
        let remaining = delay - (curTime - starttime)// 从上一次到现在，还剩余多少多余时间
        let context = this
        let args = arguments
        clearTimeout(timer)
        if(remaining <= 0){
            fn.apply(context,args)
            starttime = Date.now()
        }else{
            timer = setTimeout(fn,remaining)
        }
    }
}
```

#### 防抖
- 1.简单版本
```js
function debounce(func,wait){
    let timeout;
    return function(){
        let context = this; // 保存this指向
        let args = arguments; // 拿到event对象

        if(timeout)clearTimeout(timeout) // 清理上一次的
        timeout= setTimeout(function(){
            func.apply(context, args)
        },wait)
    }
}
```

- 2.添加立即执行功能
```js
function debounce(func,wait){
    let timeout;
    return function(){
        let context = this; // 保存this指向
        let args = arguments; // 拿到event对象
        if(timeout)clearTimeout(timeout) // 清理上一次的
        if(immediate){
            let callNow = !timeout; // 第一次会立即执行
            timeout = setTimeout(function(){
                timeout = null
            },wait)
            if(callNow){
                func.apply(context,args)
            }
        }else{
            timeout= setTimeout(function(){
                func.apply(context, args)
            },wait)
        }
    }
}
```

### 区别总结
- 节流：在一定时间内，只有第一次生效，后面不生效
- 防抖：在一定时间内，只有最后一次生效，前面的不生效