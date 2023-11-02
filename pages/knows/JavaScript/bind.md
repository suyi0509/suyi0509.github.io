## bind、call、apply

### 作用
它们的作用都是改变函数执行时的上下文，就是改变函数运行时的this指向

```js
var name = "lucy";
var obj = {
    name: 'sue2',
    say: function(){
        console.log(this.name)
    }
}

obj.say()  // sue2, this指向obj对象
setTimeout(obj.say,0)// lucy, this指向window对象
// 实际情况：定时器作为回调函数来执行，因此回到主执行栈时，是在全局执行上下文的环境中执行，所以这时候this指向window

// 需求：实际上我们需要把this指向obj对象，所以这时候就需要去改变this指向

setTimeout(obj.say.bind(obj),0) // sue2
```
### 区别
#### 1. apply
特点：
 - apply接受两个参数，第一个参数是this的指向，**第二个参数以数组的形式传入的参数**
 - 原函数会立即执行，这方法是临时改变this指向一次
 - 第一个参数为null、undefined时，默认指向window

```js
function fn(...args){
    console.log(this,args)
}

let obj = {
    myname:'suyi'
}
fn.apply(obj, [1,2]) // this指向obj，args传入必须是数组
fn(1,2) // 直接执行，this指向window
```
#### 2. call
特点：
 - call接受两个参数，第一个参数是this的指向，**第二个参数以列表的形式传入的参数**
 - 原函数会立即执行，这方法是临时改变this指向一次
 - 第一个参数为null、undefined时，默认指向window

```js
function fn(...arg){
    console.log(this,args)
}

let obj = {
    myname:'suyi'
}
fn.call(obj, 1,2) // this指向obj，args传入必须是列表
fn(1,2) // 直接执行，this指向window
```
#### 3. bind
特点：
 - call接受两个参数，第一个参数是this的指向，**第二个参数以列表的形式传入的参数**,但是这个列表可以分多次传入
 - 原函数不会立即执行，这方法是返回一个新的函数，一个永久改变this指向的函数
 - 第一个参数为null、undefined时，默认指向window
```js
function fn(...arg){
    console.log(this,args)
}

let obj = {
    myname:'suyi'
}
const bindFn = fn.bind(obj) // this指向obj，但是bind不会立即执行
bindFn(1,2) // 执行，this指向obj
fn(1,2) // this指向window
```
#### 4.总结
1. 三者都可以改变函数的this对象指向
2. 三者第一个参数都是this要指向的对象，如果没有这个参数，或为null、undefined，则默认全局window
3. 三者都可以传参，但是apply是数组、call和bind是列表，bind还可以分开多次进行传入，而apply、call是一次性传入
4. bind是返回绑定this之后的一个新的永久的函数，apply、call则立即执行

### 实现
#### 实现call
```js
function fn(...arg){
    console.log(this.myname)
}

let obj = {
    myname:'suyi'
}
fn.call(obj) // this指向obj，args传入必须是列表
```
功能：
1. call改变了this指向,指向了obj
2. fn函数立即被执行了

---
- step1：思考如何可以指向obj，换种方式，即fn是obj里面的函数
```js
let obj = {
    myname:'suyi',
    callFn: function(...arg){
         console.log(this.myname)
    }
}
obj.callFn() // suyi
// 这时候就是this指向obj
```
但是这样却是给foo添加了一个属性，我们需要做删除detail

因此步骤为
1. 将函数设置为对象属性
2. 执行该函数
3. 删除该函数

```js
obj.callFn = fn // 1.将函数设置为对象属性
obj.callFn() // 2. 执行该函数
delete obj.callFn // 3. 删除该函数
```
##### 第一步代码：
```js
// myCall(obj)  context上下文为obj 
Function.prototype.myCall = function(context){
    // 正常使用为 fn.myCall(obj)  this初始化为fn
    context.callFn = this // context相当于obj, this相当于fn
    context.callFn()
    delete context.callFn
}
```
---
- step2：实现第二个参数，传入参数
实例效果：
```js
let obj = {
    myname:'suyi',
}
function fn(name,age){
    console.log(name)
    console.log(age)
    console.log(this.myname)
}
fn.call(obj, 'zhangsan',18) // zhangsan  18  suyi
```
```js
// 因此我们应该把参数 obj提出
arguments = {
    0: obj,
    1:'zhangsan',
    2: 18,
    length: 3
}
```
##### 第二步代码：
```js
// myCall(obj，'zhangsan',18)  context上下文为obj 
Function.prototype.myCall = function(context){
    context.callFn = this // context相当于obj, this相当于fn
    let arg = [...arguments].slice(1) // 把obj隔离出来，把其他参数弄出来，返回一个数组
    // 例如[1,2,3,4,5].slice(1)  => [2, 3, 4, 5]
    context.callFn(...arg)
    delete context.callFn
}
```

---
- step3: 当第一个参数为null或undefined时，默认指向window 
```js
var value = 1;
function bar() {
 console.log(this.value);
}
bar.call(null); // 1
```
当函数具有返回值时
```js
var obj = {
 value: 1
}
function bar(name, age) {
 return {
 value: this.value,
 name: name,
 age: age
 }
}
console.log(bar.call(obj, 'kevin', 18));
// Object {
// value: 1,
// name: 'kevin',
// age: 18
// }
```

##### 第三步代码：
```js
// 默认this指向
Function.prototype.myCall = function(context){
    let context = context || window
    context.callFn = this  // callFn为内置的新的一个callFn 函数属性
    let arg = [...arguments].slice(1) 
    let result = context.callFn(...arg) // 返回函数返回值
    delete context.callFn
    return result
}
```
##### 精湛写法
```js
// 默认this指向
Function.prototype.myCall = function(context, ...args){
    if(typeof context === 'undefined' || context=== null){
        context = window
    }
    let fnSymbol = Symbol() // 独一无二的
    context[fnSymbol] = this 
    let result = context[fnSymbol](...arg) // 返回函数返回值
    delete context[fnSymbol]
    return result
}
```

#### 实现apply
- apply 的实现跟 call 类似，只是⼊参不⼀样，apply为数组
##### 简易
```js
Function.prototype.myApply = function(context, arr){
    let context = context || window
    context.ApplyFn = this  // ApplyFn为内置的新的一个ApplyFn 函数属性
    var result
    if(!arr){
        result = context.ApplyFn()
    }else{
        result = context.ApplyFn(...arr)
    }
    delete context.ApplyFn
    return result
}
```

##### 精湛写法
```js
Function.prototype.myApply = function(context, args){
   if(typeof context === 'undefined' || typeof context === null){
        context = window
   }
   let fnSymbol = Symbol() 
   context[fnSymbol] = this
   let  result = context[fnSymbol](...args)
   delete context[fnSymbol]
   return result
}
```

#### 实现bind
- bind() ⽅法会创建⼀个新函数。当这个新函数被调⽤时，bind() 的第⼀个参数将作为它运⾏时的 this，
之后的⼀序列参数将会在传递的实参前传⼊作为它的参数

特点:
1. 不会立刻执行，返回一个函数
2. 可以多次传入参数 fn.bind(obj,1)(2)

实例效果
```js
var foo = {
 value: 1
};
function bar() {
 console.log(this.value);
}
// 返回了⼀个函数
var bindFoo = bar.bind(foo); 
bindFoo(); // 1
```

##### 第一步：this指向
```js
Function.prototype.myBind = function(context){ // context === foo
    let bindFn = this; // this => bar
    return function(){
        //  函数里面this指向为window，所以要在外面定义好，传入进来
        return bindFn.apply(context)  // bar.apply(foo)
    }
}
```
---

##### 第二步：传参模拟
```js
Function.prototype.myBind = function(context){
    let bindFn = this;
    // 获取bind2函数从第⼆个参数到最后⼀个参数
    const args = [...arguments].slice(1)
    return function(){
        const bindArgs = [...arguments]// 这里的arguments是调用myBind时传的参数，所以不用裁剪
        return bindFn.apply(context, args.concat(bindArgs)) // bindArgs 调用时传的参数
    }
}
```


##### 最简化版
```js
Function.prototype.myBind = function(context){
    if (typeof context === "undefined" || context === null) {
      context = window;
    }
    self = this;
    return function(...args) {
         return self.apply(context, args);
    }
}
```

##### 学习更多
- ⼀个绑定函数也能使⽤new操作符创建对象：这种⾏为就像把原函数当成构造器。提供的 this 值被忽
略，同时调⽤时的参数被提供给模拟函数

- 就是说当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传⼊的参数依然⽣
效