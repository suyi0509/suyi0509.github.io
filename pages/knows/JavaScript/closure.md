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

---
使用场景：
- 创建私有变量
- 延长变量的生命周期
一般函数的词法环境再函数返回后就被销毁，但是闭包依旧会保存对创建时所在的词法环境的引用。
就是即使创建时所在的执行上下文被销毁，但创建时所在的词法环境依旧存在，以达到延长变量的生命周期的目的。

1. 场景1：闭包柯里化函数
> 目的：避免频繁调用具有相同参数函数的同时，又能够轻松重用
柯里化示例
```js
// 求长方形面积的函数
function getArea(width, height){
    return width * height
}
// 如果我们老是碰到长方形的宽是10
// 就可以使用闭包柯里化来计算面积函数
function getArea(width){
    return (height) => {
        return width * height
    }
}

const getTenWidthArea = getArea(10)
const getAreaComputer = getTenWidthArea(20)
```
2. 场景2：闭包模拟私有方法
```js
var makeCounter = (function(){
    var privateCounter = 0;
    function changeBy(val){
        privateCounter += val
    }
    return {
        increment: function(){
            changeBy(1)
        },
        decrement: function(){
            changeBy(-1)
        },
        value:function(){
            return privateCounter
        }
    }
})()

var counter1 = makeCounter()
var counter2 = makeCounter()
console.log(counter1.value() ) // 0
counter1.increment()
counter1.increment()
console.log(counter1.value() ) // 2
counter1.decrement()
console.log(counter1.value() ) // 1
console.log(counter2.value() ) // 0
```

注意：再创建新的对象或者类时，方法通常应该关联于对象的原型，而不是定义到对象的构造器中。
原因在于：每个对象的创建，方法都会被重新赋值
```js
function MyObject(name,message){
    this.name = name.toString()
    this.message = message.toString()
    this.getName = function(){
        return this.name
    }
    this.getMessage = function(){
        return this.message
    }
}
// 这里我们并没有利用到闭包的好处，所以应该避免使用闭包
function MyObject(name,message){
    this.name = name.toString()
    this.message = message.toString()
}
MyObject.prototype.getName = function(){
    return this.name
}
MyObject.prototype.getMessage = function(){
    return this.message
}
```
---

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
