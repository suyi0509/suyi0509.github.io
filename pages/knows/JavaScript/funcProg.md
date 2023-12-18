## 函数式编程

### 定义
函数式编程是一种 “编程范式”
主要编程范式有三种：命令式编程、声明式编程、函数式编程

示例
```js
// 命令式编程
var array = [0,1,2,3]
for(let i = 0;i<array.length;i++){
    array[i]=Math.pow(array[i],2)
}

// 函数式方式
[0,1,2,3].map(num => Math.pow(num,2))
```

> 简单来说就是把过程逻辑封装成一个函数，定义好输入的参数，只关心它输出的结果

### 优缺点
- 优点：
  1. 更好的状态管理
  2. 更强的复用性
  3. 更优雅的组合
  4. 更好的维护性

- 缺点：
  1. 函数式编程性能没有那么好
  2. 资源占用
  3. 递归陷阱

---

### 纯函数
> 纯函数 = 无状态 + 数据不可变 , 给相同的输入值会返回相同的函数，对其他数据都没有影响

- 示例
```js
let double = value => value * 2
```
- 特例
  1. 函数内部传入指定的值，就会返回确定唯一的值
  2. 不会造成超出作用域的变化，例如修改全局变量或引用传递的参数

- 优势
  1.使用纯函数，我们可以产生可测试的代码
  2.不依赖外部环境计算，不会产生副作用，提高函数的复用性
  3.可读性更强
  4.可以组装成复杂任务的可能性，符合模块化概念及单一职责原则

### 高阶函数
> 高阶函数，就是以函数作为输入或者输出的函数

```js
const forEachFun = function(arr,fn){
    for(let i = 0;i<arr.length;i++){
        fn(arr[i])
    }
}
let arr = [1,2,3]
forEachFun(arr, (i) => {
    // 函数作为输入
    console.log(i)
})
```
高阶函数存在缓存的特性，主要是利用闭包的特性：外部函数调用结束后，这些局部变量仍然能够被访问


### 柯里化
> 柯里化是把一个多参数函数转换成一个嵌套的一元函数的过程

```js
let fn = (x,y) => x+y // 二元函数

// 函数柯里化
const myFn = function(x){
    return function(y){
        return x+y
    }
}

myFn(1)(2)
```

- 多参数柯里化
```js
const curry = function(fn){
    return function curriedFn(...args){
        if(args.length < fn.length){
            return function(){
                return curriedFn(...args.concat([...arguments]))
            }
        }
        return fn(...args)
    }
}

const fn = (x,y,z,a) => x+y+z+a;
const myfn = curry(fn)
console.log(myfn(1)(2)(3)(1))
```
- 函数柯里化的意义
  - 让纯函数更纯，松散解耦
  - 惰性执行

### 组合与管道
> 组合函数，目的是将多个函数组成一个函数

```js
function afn(a){
    return a*2
}
function bfn(b){
    return b*3
}

const compose = (a,b) => c => a(b(c))
let myfn = compose(afn,bfn)
console.log(myfn(2))
```
