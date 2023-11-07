## 函数缓存

> 函数缓存，就是将函数运算过的结果进行缓存
> 本质上就是用空间（缓存存储）换时间（计算过程）

```js
const add = (a,b) => a+b
const calc = memoize(add) // 做函数缓存
calc(10,20) // 30
calc(10,20) // 30 缓存
```

实现函数缓存主要依靠：1.闭包，2.柯里化，3.高阶函数

### 1.闭包
闭包 = 函数 + 函数体内可访问的变量总和
```js
(function(){
    var a = 1;
    function add(){
        const b = 2
        let sum = b + a
        console.log(sum)  // 3
    }
    add()
})()
```

### 2.函数柯里化
```js
var add = function(x,y){
    return x+y
}
add(3,4) // 7
// 函数柯里化
var add2 = function(x){
    return (y) => {
        return x+y
    }
}
add2(3)(4)
```

### 3.高阶函数
> 通过接收其他函数作为参数或**返回其他函数的函数**
```js
function foo(){
    var a = 2;
    function bar() {
        console.log(a);
    }
    return bar; // 返回其他函数
}
var baz = foo();
baz();//2
```


### 实现函数缓存
> 原理：把参数和对应得结果数据存在一个对象中，调用时判断参数对应得数据是否存在，存在则返回对应得结果数据，否则就返回计算结果

```js
const memoize = function(func, content){
    let cache = Object.create(null)
    content = content || this
    return (...key) => {
        if(!cache[key]){
            cache[key] = func.apply(content,key)
        }
        return cache[key]
    }
}
```
- 分析
1.当前函数作用域定义了一个空对象，用于缓存运行结果
2.运用柯里化返回一个函数，返回的函数由于闭包特性，可以访问到cache
3.然后判断是否在cache中，如果存在，直接返回cache的内容，如果没有存在，使用函数func对输入参数求值，把结果存在cache中


### 应用场景
1.对于昂贵的函数调用，执行复杂计算的函数
2.对于具有有限且高度重复输入范围的函数
3.对于具有重复输入值的递归函数
4.对于纯函数，即每次使用特定输入调用时返回相同输出的函数