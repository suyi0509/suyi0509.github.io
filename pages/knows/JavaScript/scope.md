## 作用域

### 定义
> 作用域：指程序中源代码定义变量得区域，作用域它规定了当前执行代码对变量得访问权限

|            | 定义                                                                     |
| ---------- | ------------------------------------------------------------------------ |
| 静态作用域 | 静态作用域也称为**词法作用域**，函数的作用域在**函数定义的时候就决定了** |
| 动态作用域 | 函数作用域在**函数调用的时候才决定的**（bash为动态作用域）               |

- js是采用静态作用域，也就是词法作用域（lexical scoping）

```js
var value = 1

function foo(){
    console.log(value)
}

function bar(){
    var value = 2
    foo()
}

bar()
// 结果会输出什么呢 ------答案为 1
```

> - 如果js是静态作用域，那么在定义的时候就已经决定了
>    - 在执行foo函数时，先从foo内部查找是否有局部变量value，没有，则根据书写的位置，查找上层代码，既输出值为 value === 1
> 
> - 如果js是动态作用域，那么在调用的时候在决定
>   - 在执行foo函数时，先从foo内部查找是否有局部变量value，没有，则从调用函数作用域中找，也就是bar函数内部，既输入值为 value === 2
>   - bash语言为动态作用域，执行为 value === 2

---

### 示例

```js
// case 1
var scope = "global scope";
function checkScope(){
    var scope = "local scope"
    function f(){
        return scope
    }
    return f()
}
checkScope()

// case 2
var scope = "global scope";
function checkScope(){
    var scope = "local scope"
    function f(){
        return scope
    }
    return f
}
checkScope()()

// 两段代码的执行结果为...
```
两段代码执行结果都为"local scope"
> - step1: f()都定义在 checkScope() 里面，因为js是静态作用域，既定义时就决定了。
> - step2: 所以f()在定义的时候就决定了作用域，在f()中没有，则往上一层查找，既在checkScope（）中
> - step3: 所以 都返回 scope === "local scope"


引⽤《JavaScript权威指南》
> JavaScript 函数的执⾏⽤到了作⽤域链，这个作⽤域链是在函数定义的时候创建的。嵌套的函数 f() 定
义在这个作⽤域链⾥，其中的变量 scope ⼀定是局部变量，不管何时何地执⾏函数 f()，这种绑定在执
⾏ f() 时依然有效


## 总结
js是静态作用域，定义时就决定
--- 

了解上面js时静态作用域，我们通常说js里面的作用域
- 全局作用域
- 函数作用域
- 块级作用域
  
#### 全局作用域
任何不在函数中或括号中声明的变量，都是全局作用域下，全局作用域下的变量可以在程序中的任何位置被访问到
```js
var globalVar = 'hello'

function getGlobalVar () {
    console.log(globalVar)
}

getGlobalVar() // 'hello'
console.log(globalVar) // 'hello'
```

#### 函数作用域
函数作用域也叫局部作用域, 如果一个变量时在函数内部进行声明，那她就在这个函数作用域下面，这个变量也只能在这个函数内部被访问，不能再函数之外去访问
```js
function getFnVar () {
    var fnVar = 'function var'
    console.log(fnVar)
}

getFnVar() // 'function var'
console.log(fnVar) // fnVar is not defined
// 函数内部声明的变量或函数，在函数外部无法进行访问，这说明函数内部定义得方法只是函数作用域
```

#### 块级作用域
ES6引入得let和const关键字，和var关键词不同，在大括号中使用的let和const声明的变量存在于块级作用域中，在大括号之外不能访问这些变量
```js
{
    // 在大括号里面定义的是 块级作用域
    const sex = 'girl'
    let name = 'hello world'
    var age = 28
}
console.log(age)  // 28
console.log(sex)  // sex is not defined
console.log(name) // undefined
```





