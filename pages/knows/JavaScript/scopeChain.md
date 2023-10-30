## 作用域链

> - 当查找变量的时候，会先从当前上下文的变量对象中查找，没有查到
> - 就会从父级执行上下文的变量对象中查找，直到找到全局执行上下文的变量对象，既全局对象
> - 这样由多个执行上下文的变量对象构成的链表就叫作用域链


### 函数创建
作用域 分为 1. 动态作用域 和 2. 静态作用域
js使用的就是静态作用域（词法作用域）在函数定义时就决定了

在函数内部有一个[[scope]]属性，当函数创建时候，就会保存所有父变量对象到这个属性里
也就是[[scope]]是所有父变量对象的层级链，但是注意 [[scope]] 并不代表完整的作用域链


#### 示例
```js
function foo(){
    function bar(){
         ...
    }
}
// 上面在函数创建时，各自的[[scope]]为

foo.[[scope]] = [
    globalContext.VO
]

bar.[[scope]] = [
    fooContext.VO,
    globalContext.VO
]
```

### 函数激活
当进入到函数上下文，创建好VO/AO后，会把活动对象添加到作用域链的前端
这时候创建执行上下文的作用域链
```js
Scope = [AO].concat([[Scope]])
// 作用域链创建完毕
```

## 总结过程
结合之前的变量对象和执行上下文栈，我们来模拟整个创建过程
```js
var scope = "global scope"
function checkScope(){
    var scope2 = 'local scope';
    return scope2
}
checkScope()
```

执⾏过程如下:
- 1.checkScope函数被创建，保存作用域链到内部属性 [[scope]]
```js
checkScope.[[scope]] = [
    globalContext.VO
]
```
- 2.执行checkScope函数，创建对应得函数执行上下文，再压入函数执行上下文栈中
```js
ECStack = [
    globalContext
]
// checkScope得执行上下文
ECStack.push(<checkScope> functionContext)

// 执行上下文栈
ECStack = [
    checkScopeContext
    globalContext
]
```

- 2.checkScope函数并不会立刻执行，需要做准备工作
- 2.1 第一步： 复制函数的[[scope]]属性创建作用域链
```js
checkScopeContext = {
    Scope: checkScope.[[scope]]
}
```
- 2.2 第二步： arguments创建活动对象，初始化变量对象
```js
checkScopeContext = {
    AO:{
        arguments:{
            length:0
        },
        scope2: undefined
    }
    Scope: checkScope.[[scope]]
}
```
- 2.3 第三步：将活动对象压⼊ checkScope 作⽤域链顶端
```js
checkScopeContext = {
    AO:{
        arguments:{
            length:0
        },
        scope2: undefined
    }
    Scope:[AO, [[scope]]]
}
```


- 3.准备工作完成后，开始执⾏函数，修改AO的属性值
```js
checkScopeContext = {
    AO:{
        arguments:{
            length:0
        },
        scope2: 'local scope'
    }
    Scope:[AO, [[scope]]]
}
```

- 4.执行函数，查找到scope2的值，执行完毕，函数上下文从执行栈中弹出
```js
// 执行完成 checkScope()
ECStack.pop()  //checkScope弹出
ECStack = [
 globalContext
];
```