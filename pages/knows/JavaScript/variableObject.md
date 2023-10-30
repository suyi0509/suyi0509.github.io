## 变量对象

上个章节我们了解到了js在执行 **可执行代码** 时，会创建对应的 **执行上下文**, 会把对应的执行上下文 压入至 **执行上下文栈**

---

在每个执行上下文当中，都有三个重要属性
- 1.变量对象（Variable object，VO）
- 2.作用域链
- 3.this

### 变量对象

- 定义
> - 变量对象：它是执行上下文的数据作用域，里面存储了在 执行上下文 中定义的变量和函数声明
> - 因为不同的执行上下文中的变量对象是不一样的，这里又分成 1. 全局执行上下文的变量对象  和 2. 函数执行上下文的变量对象

#### 全局执行上下文的变量对象

- 全局对象是预定义的对象， 他是作为JS的全局函数和全局属性的占位符。通过使用全局对象可以去访问所有其他的预定义对象、函数和属性
- 在顶层JS中，可以使用this引用全局对象，因为全局对象是作用域链得头，这意味这可以通过该对象得属性去做查询

- 1. this引用, 全局对象就是Window对象
```js
console.log(this);  // Window
```
- 2. 全局对象是由 Object 构造函数实例化的⼀个对象
```js
console.log(this instanceOf Object); // true
```
- 3. 预定义的属性是否可用
```js
console.log(Math.random())
console.log(this.Math.random() )
```
- 4. 作为全局变量的宿主
```js
var a = 1;
console.log(this.a)
```
- 5. 全局对象有window属性指向自身
```js
var a = 1
console.log(window.a)

this.window.b = 2
console.log(this.b)
```

- 全局上下⽂中的变量对象就是全局对象


#### 函数执行上下文的变量对象

> 在函数上下文中，我们把 **活动对象** （activation object，AO）来表示 函数执行上下文中的 变量对象

- 所以 **活动对象** 和 **变量对象** 是一个东西
- 只是变量对象是规范上或者引擎上实现的，不可在js环境中访问
- 只有进入一个执行上下文中，才会被激活， 所以叫 activation object
- 只有被激活的变量对象，才能被访问到其属性

活动对象是在进入 函数上下文 的时候被创建的，它通过函数的arguments属性初始化，arguments属性是Arguments对象


## 执行过程
执行上下文的代码会分成两个阶段进行处理： **分析**和**执行**
也能叫 **1.进入执行上下文**  **2.代码执行**


- 1.进入执行上下文
  - 1.1 刚进入执行上下文，创建活动对象，初始化

```js
变量对象会包括
1. 函数的所有形参（如果是函数上下文）
   - 创建一个变量对象的属性： 由名字和对应值，组成键值对的结构
   - 没有实参，属性设为 undefined

2. 函数声明
   - 创建一个变量对象的属性： 由名字和对应值（函数对象[function-object]），组成键值对的结构
   - 如果变量对象已存在相同名称的属性，则完全替换掉之前的属性

3. 变量声明
   - 创建一个变量对象的属性： 由名字和对应值，组成键值对的结构
   - 如果变量名称跟已经声明好的形参或函数相同，则变量声明不会干扰已经存在的这类属性
```

示例
```js
function foo(a){
    var b = 2
    function c(){}
    vat d = function(){}
    b = 3
}
foo(1)
```
进入执行上下文之后，AO是
```js
AO  = {
    arguments: {
    // 形参 - 传入的参数
        0: 1, 
        length: 1
    }
    a:1,  // 形参
    b = undefined, // 变量声明
    c:reference to function c(){}, // 函数声明
    d:undefined // 变量声明
}
```

- 2.代码执行
在代码执行阶段，会顺序执行代码，根据代码去修改 变量对象的值

```js
代码执行完成后
AO  = {
    arguments: {
    // 形参 - 传入的参数
        0: 1, 
        length: 1
    }
    a:1,  // 形参
    b = 3, // 变量声明
    c:reference to function c(){}, // 函数声明
    d:reference to FunctionExpression "d" // 变量声明
}
```

- 变量对象就创建完成了

### 总结
1.全局上下文得变量对象初始化是全局对象
2.函数上下文得变量对象初始化只包括 Arguments 对象  // AO = { argument:{length: 0} }
3.在 1进入执行上下文，会给变量对象添加 形参、 函数声明、变量声明等初始化属性
4.在 2代码执行阶段，会再次修改变量对象得属性值


### 测试1
```js
function foo(){
    console.log(a)
    a = 1
}

foo() // ??? Uncaught ReferenceError: a is not defined
- 报错是因为吧 函数中得 "a", 并没有通过var关键字声明，所以不会被存放在AO中
AO = {
    arguments:{
        length: 0
    }
}



function foo(){
    console.log(a)
    var a = 1
}

foo() // undefined，通过var全局声明，但是未执行到，所以输出undefined
AO = {
    arguments:{
        length: 0
    }
    a:undefined
}


function bar(){
    a = 1;
    console.log(a)
}
bar() // 1
AO = {
    arguments:{
        length: 0
    }
    a:1
}
- 
```


### 测试2
```js
console.log(foo); // 打印函数

function foo(){
    console.log("foo")
}

var foo = 1

- 在1.进入执行上下文时，首先会处理函数声明，其次会处理变量声明
- 如果变量声明和 声明得形参或者函数相同，变量声明不会影响已存在得这类属性
```


