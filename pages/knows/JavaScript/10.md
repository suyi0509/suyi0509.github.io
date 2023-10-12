## 闭包

### 定义
```js
// 闭包示例
function outerFunction() {  
  var outerVariable = 100; // 外部作用域的变量  
  
  function innerFunction() {  
    console.log(outerVariable); // 内部函数访问外部变量的示例  
  }  
  
  return innerFunction; // 返回内部函数作为闭包  
} 
```
- 定义
> - 闭包是指有权访问另一个函数作用域中的变量的函数。
> - 闭包 = 函数 + 函数能够访问的⾃由变量
> - 通常是定义在外层函数中的内层函数，对外层函数中的局部变量进行引用，使得在外部函数调用结束后，这些局部变量仍然能够被访问。

- 实践⻆度上闭包定义(在结合执行作用域链)
- 1. 即使创建它的上下文已经销毁,但是它依旧存在
    - (比如上文的 checkScope 已经销毁,但是我们依旧可以沿着作用域链找到)
- 2. 在代码中引用了自由变量


### 思考
```js
var data = []

for(var i = 0; i< 3; i++){
    data[i] = function () {
        console.log(i);
    };
}

data[0](); // 3
data[1](); // 3
data[2](); // 3
```
- 答案全是3,分析一下原因

1.在data[0]函数之前, 这时的全局上下文的VO为
```js
globalContext = {
    VO:{
        data:[...]
        i:3
    }
}
```
2.当执行data[0]函数时,data[0]函数的作用域链[[scope]]
```js
data[0]Context = {
    Scope:[AO, globalContext.VO]
}
// data[0]Context 沿着作用域链查找,AO上无i, 则会在globalContext上查找,所以输出 3
```

### 解决思路1 - 修改成闭包
```js
var data = [];

for (var i = 0; i < 3; i++) {
    data[i] = (function (i) {
        return function () {
            console.log(i);
        }
    })(i);
}
data[0](); // 0
data[1](); // 1
data[2](); // 2
```

- 分析一下原因

1.在data[0]函数之前, 这时的全局上下文的VO为
```js
globalContext = {
    VO:{
        data:[...]
        i:3
    }
}
```
2.当执行data[0]函数时,data[0]函数的作用域链[[scope]]  **发生了变化**
```js
data[0]Context = {
    Scope:[AO, 匿名函数Context.VO ,globalContext.VO]
}
// data[0]Context 沿着作用域链查找,AO上无i, 则会在匿名函数Context上查找
```
```js
匿名函数Context = {
    AO:{
        arguments:{
            0:0,
            length:1
        },
        i:1
    }
}
```
就找到了 匿名函数Context 上的i，值为1

data[1]和data[2]也是这个道理，i分别在匿名函数上为2，3


### 解决思路1 - var修改成let
```js
var data = []

for(let i = 0; i< 3; i++){
    data[i] = function () {
            console.log(i);
        };
}

data[0](); // 0
data[1](); // 1
data[2](); // 2
```

- 分析一下原因

1.在data[0]函数之前, 这时的全局上下文的VO为
```js
globalContext = {
    VO:{
        data:[...]
        //  let是块级作用域，所以全局不存在i
    }
}
```
2.当执行data[0]函数时,data[0]函数的作用域链[[scope]]  **发生了变化**
```js
data[0]Context = {
    A0: {
        arguments:{
            0:0,
            length:1
        },
        i:0
    }
    Scope:[AO, globalContext.VO]
}
// data[0]Context 沿着作用域链查找,AO上i为0
```

data[1]和data[2]也是这个道理，i分别在AO上为1，2
