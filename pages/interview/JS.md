## 1. var | let | const
```ts
变量声明：在ES5中有Var、function, ES6中有let、const、import、class、promise等

1. var和let都是定义变量，const是定义常量 (const需要保证值不变，这里值是指变量指向的内存地址不变)
2. var具有变量提升，（变量提升就是变量可以在声明之前使用，值为undefined），let、const具有暂时性死区（暂时性死区，会生成一个封闭的作用域，变量不可以在声明之前去使用，不然会报错）
3. var是可以重复声明的,而let、const不行
4. var的作用域是全局作用域，而let、const作用域是块级作用域
```
---

## 2. 数据类型
```ts
1. JS数据类型分为2种，分别是基本数据类型，和引用数据类型
- 基本数据类型（7种）：string，number，boolean，null，undefined，symbol(es6)， bigInt(es6)
- 引用数据类型：除了基本数据类型其他都是引用数据类型，例如：object对象、array数组、
function函数、new Date实例化、Map、Set

2. 存储区别
基本数据类型：数据保存在栈中，因为它体量小，变量定义时都会新开一块地对应不同的内存地址
引用数据类型：数据保存在堆中，因为它体量大，在栈中存放的是堆的内存地址，因此两个obj可能同时使用一个内存地址

3. 判断数据类型的4种方法
（1）typeof:常用于基本数据类型的判断，他的特点就是少Null多function
- typeof(null) === object（计算机中，typeof是检查机器码后三位的，null当初设定的机器码是 00...00，当后三位为000时，返回object），
- typeof(function(){}) === function(但判断引用类型时，判断是否包含[[call]],有=> function, 无 => object)

（2）instanceof：常用于引用数据类型的判断，A instanceof B，A对象是否是由B对象实例化出来的
- instanceof检测是在原型链上完成的，而基本数据类型是没有原型链，所以不能用instanceof去检测基本数据类型。

（3）constructor：同样依赖于原型链，检测原型对象的constructor是否指向构造函数。
- 特殊点1：constructor可检测基本数据类型（null、undefined除外）
当检查基本数据类型时，JavaScript 会尝试将该基本数据类型隐式转换为对象（称为装箱转换或对象包装），然后访问该对象的 constructor 属性。所以constructor可检测基本数据类型，但是并不可靠。

- 特殊点2：constructor不可检查对象父类


（4）Object.prototype.toString.call()：toString是原型上的方法，返回的是一个字符串，包含其内置对象类型
- 当检查基本数据类型，js会自动将基本数据类型包装成对应的内置对象
- 如果一个对象有 Symbol.toStringTag 属性并且该属性值是个字符串，就会被反回当成Type进行展示
```
---
## 3.原型和原型链
```ts
- 原型：
在js中分为函数对象和普通对象，每一个对象都有__proto__属性，但只有函数对象才有prototype属性，这个属性是一个指针，指向一个原型对象，这个原型对象包含了所有实例共享的属性。

- 原型链：
当试图访问一个对象的某个属性时，JavaScript会首先在该对象上查找该属性。如果找不到，就会去它的原型对象（也就是它的__proto__属性所指向的对象）上查找。如果还找不到，就会继续去该原型对象的原型对象上查找，以此类推，直到找到为止。这个链式的查找过程就是原型链
```
---

## 4. 作用域
```ts
作用域：又分为静态作用域和动态作用域

1.静态作用域：又称为词法作用域，作用域是在函数定义时绝对的
2.动态作用域：在函数被调用的时候再决定

js是采用的静态作用域，是在定义的时候就决定了, js里面的作用域，又分为：全局作用域，函数作用域，块级作用域
```
---

## 5. 执行上下文
```ts
js引擎并不是一行行执行的，而是一段段的分析执行。当执行一段代码，先构造可执行上下文。
可执行上下文分为3种：全局执行上下文，函数执行上下文，eval函数执行上下文

每个执行上下文都有生命周期，包括三个阶段：创建阶段 - 执行阶段 - 回收阶段

1. 在创建阶段，需要 1. 确定this的值（ThisBinding） 2. 词法环境（全局环境、函数环境）（let const function）3.变量环境（var）

- 为了管理执行上下文，创建了 执行上下文栈

每个执行上下文当中，都有三个重要属性：
- 1.变量对象（VO）： 存储定义变量和函数声明
- 2.作用域链
- 3.this

全局执行上下文，函数执行上下文里面的VO是不一样的，全局上下⽂中的变量对象就是全局对象就是Window对象

函数执行上下文，用活动对象（AO）来表示 函数执行上下文中的 变量对象。所以在函数执行上下文中，**活动对象** 和 **变量对象** 是一个东西

2. 在执行过程中，又分为2个阶段1.进入执行上下文（创建活动对象，初始化），2.代码执行（修改变量对象的值）

--- 作用域链
多个执行上下文的变量对象构成的链表就叫作用域链， 函数[[scope]]是所有父变量对象的层级链

执行过程：
1. 函数被创建，先保存作用域链
2. 创建函数执行上下文，并压入执行上下文栈


```

### 数据结构

---

#### Question 1
- typeof 和 instanceof 检测数据类型的异同
###### Step 1
JS的数据类型

```js
- 原始数据类型（基本类型）
  Undefined、Null、Boolean、Number、String
  
- 引用类型（复杂类型）
  object => []数组、{}对象、new Date()实例化、function函数
  
- es6新增两个基本数据类型 symbol（独一无二）、bigInt（大整性）
```

###### Step 2
typeof的特点(少null多function)
```js
- typeof 检测 返回的是对应的数据类型
  Undefined、Boolean、Number、String、symbol、bigint、Object、function
  
- 特殊：typeof(null) //object
  原因：在计算机二进制中，typeof检测机器码后三位
  - 当机器码后三位为 000 ，则返回 object
  - null在设计时机器码为 0000....000
  
- 特殊：1.typeof(function(){}) // function  2.typeof(Array) // function 
  原因：typeof在判断引用类型时，在ECMA定义包含[[call]], 有=> function, 无 => object
```
--
###### Step 3
instanceof的特点(返回值是Boolean，只有ture、fasle)
```js
- A instanceof B 去检测，A对象是否是由B对象实例化出来的

- 特殊：1 instanceof Number // fasle
  原因：instanceof检测是在原型链上完成的，而基本数据类型是没有原型链，所以不能用instanceof去检测基本数据类型

- 特殊：[] instanceof Object // true   new Date() instanceof Object // true
  原因：instanceof检测是在原型链上完成的，
        []是由Array实例化出来的，[].__proto__===Array.prototype
        Array.__proto__===Obejct.prototype,因此[] instanceof Object // true
        
- 思考：原型链的顶端是什么
  原型链的顶端是object.prototype。所有对象的原型链最终都会指向 object.prototype
```





#### Question 2: 0.1 + 0.2 !== 0.3 (精度丢失)
###### Step 1 
计算机语言存储浮点型是 IEEE754
###### Step 2 
出现精度丢失
```js
- 0.1 => 0.1110101111...; 0.2 => 0.0000110101...
  0.1 + 0.2 = 0.1110101111... + 0.0000110101..
  二进制 => 十进制  精度丢失  0.3000...0004

- 解决方案1: 舍弃部分精度值
  parseFloat((0.1 + 0.2).toFixed(2))
  toFixed(n) => 字符串  parseFloat => 浮点型

- 解决方案2: 把浮点变成整数型（倍数增加）
  function add(num1,num2){
    m = Math.pow(10,2) // 10的2次方
    return (num1 * m + num2 * m) / m
  }
```





#### Question 3: 装箱和拆箱
###### Step 1 
装箱和拆箱的含义
```js
- 装箱：把基础数据类型转化为对应的引用数据类型的操作
- 拆箱：把引用数据类型转化为对应的基础数据类型的操作

- 示例
  -------------------------------------------- 装箱(new 内置对象)
  let num = 123 // number
  let objNum = new Number(123) // object
  -------------------------------------------- 拆箱(valueOf)
  let objNum = new Number(123) // object
  objNum.valueOf() // number
```
###### Step 2 
深入拆箱原理： js.toPrimitive() [js内部的拆箱方法]
```js
- toPrimitive(input, type) 两个参数,input:传入的值、type值类型
  1. input 判断是不是原始类型的值  是：直接返回
  2. 否, 判断 input.valueOf 是不是原始类型的值  是：直接返回
  3. 否，input.toString()  只能是原始类型  返回
  其他问题： 报错
```
###### Step 3 
深入原理： valueOf() 、 toString()
```js
- valueOf()运作原理
  input 判断有没有原始类型的值  是：返回原始类型的值, 否：返回对象本身
  // 示例 let objNum = new Number(123) // object
  valueOf(objNum)的原始类型就是Number，有，所以返回123

- toString()运作原理
  input 做字符串转换，对象=>[object type]   type: 对象类型
```
###### Step 4 
实践 [] + [] = ？ [] + {} = ？
```js
- [] + [] 当我们使用"+"时，js内部会调用 toPrimitive（）
  1. 判断是否时原始类型得值，[]不是
  2. 调用 [].valueOf() // []  又不是
  3. 调用 [].toString() // ''string  是原始类型，返回''
  4. '' + '' = ''

- [] + {} js内部会调用 toPrimitive（） // [object object]
  1. [] // ''
  2. 判断是否时原始类型得值，{} 不是
  3. 调用 {}.valueOf() // []  又不是
  4. 调用 {}.toString() // [object object]  第二个object为他的对象类型

特殊： {}+[], 有些浏览器(fireFox)，{}会被识别为代码块，代码块空，就等于表达式为: + [] = 0
```







