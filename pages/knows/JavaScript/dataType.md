## 数据类型

数据类型有八种
string、number、boolean、null、undefined、symbol(ES6新增)、bigInt(ES6新增)、object

> 数据类型分成  基本数据类型 和  引用数据类型

> 基本数据类型：
string、number、boolean、null、undefined、symbol(ES6新增)、bigInt(ES6新增)

> 引用数据类型：除了基本数据类型之外都是引用数据类型
例如： object对象、array数组、function函数、 new Date()实例化、Map、Set、RegExp

> es6新增的两个基本数据类型：symbol(独一无二)、bigInt(大整型)

---
> - 注意js中有数据类型和内置对象，数据类型是小写的，内置对象是大写的
> - 内置对象例如：Number、String、Boolean、Null、 Undefined、Symbol、BigInt、Object、Map、Set

---
### 存储区别
- 基本数据类型 -> 栈中
- 引用数据类型 -> 堆中

> - 基本数据类型由于体量小，在栈中直接保存数据，变量定义的时候都会新开一块地，对应不同的内存地址
> - 而引用数据类型由于体量较大，在栈中存放的是堆的内存地址， 两个obj可能使用一个内存地址

### 判断数据类型的方式(四种)
#### 1.typeof
> typeof 返回的是：对应的数据类型:
> undefined、boolean、number、string、symbol、bigint、object、funtion

##### 原理
- 在计算机二进制中，typeof检测机器码后三位
- 当机器码后三位为 000 ，则返回 object
- 当为引用类型时，判断是否有[[call]],有=> function, 无 => object

##### 特殊点1：typeof(null) => object
- 原因： null在设计的时候机器码为000...000,判定时根据原理1，返回object

##### 特殊点2：typeof(function(){}) => function
- 原因： typeof在判断引用类型时，根据原理2，判定是否包含[[call],有=> function, 无 => object

##### 总结： typeof(少null多function),

---

#### 2.instanceof（前置知识：原型链）
> A instanceof B 返回的是：A对象是否是由B对象实例化出来的
  检测 构造函数 的 prototype 属性是否出现在 某个实例 对象的 原型链 上
> 返回 true | fasle

##### 原理
- instanceof检测是在原型链上完成的，所以只能检测引用数据类型
- 当前对象如果没有，就沿着原型链往上找，找到原型链尽头，也就是原型为 null 的对象

```js
function myInstanceof(left, right) {
    // typeof false
    if (typeof left !== 'object' || left === null) return false;
    // getProtypeOf Object API
    let proto = Object.getPrototypeOf(left);
    while (true) {
        if (proto === null) return false;
        if (proto === right.prototype) return true;// true
        proto = Object.getPrototypeof(proto);
    }
}
```

##### 特殊点1 instanceof 不能检测基本数据类型
- 原因：instanceof检测需要在原型链上完成，而基本数据类型没有原型和原型链，因此对他们来说是无效的
- 1 instanceof Number //fasle  -Number是内置对象 
- 'aada' instanceof String //fasle  -String是内置对象 

##### 特殊点2 任何引用数据类型 都是由Object对象实例化出来的
- 原因：instanceof检测是在原型链上完成的,万物皆对象
- [] instanceof Object  // true 
   -  []是由new Array实例化出来的，[].__proto__===Array.prototype
   -  Array的原型链上层是Object，Array.__proto__===Obejct.prototype
   -  故：在[]沿着原型链往上找，可以找到Object  ->  true
- new Date() instanceof Object // true

##### 总结： instanceof是在原型链，
- 1. 基本数据类型是没有原型链,因此instanceof对基本数据类型不生效，全返回fasle
- 2. 引用数据类型是沿着原型链上面查找，原型链的顶端是Object，所有对象的原型链最终都会指向obejct.prototype，因此引用数据类型 instanceof Object 全返回true

---
#### constructor（前置知识：原型链）
> constructor 判断 实例对象的原型对象中存在constructor指向构造函数，
> 返回 true | fasle

![图片](../../../public/js02.png)

> 简单介绍一下： const person = new Person()
> 1. Person 是 构造函数
> 2. Person.prototype 是原型对象
> 3. person 是 实例对象
> 4. person.__proto__ === Person.prototype

##### 原理 
- 检测原型对象的constructor是否指向构造函数
- 在上面例子就是： person.__proto__.constructor === Person
- 记住 查找元素内容是在原型链上查找的，所以等于person.constructor === Person

##### 特殊点1 constructor可检测基本数据类型，也可检测引用数据类型(null、undefined除外)
当检查基本数据类型时，JavaScript 会尝试将该基本数据类型隐式转换为对象（称为装箱转换或对象包装），然后访问该对象的 constructor 属性。constructor可检测基本数据类型，但是并不可靠。
- (123).constructor === Number // true
- (true).constructor === Boolean // true
- ({}).constructor === Object // true

##### 特殊点2 constructor不可以检测对象父类
- ([]).constructor === Object  // fasle
- class A {}
class B extends A {}
const b = new B()
b.constructor === B // true
b.constructor === A // false

##### 特殊点3 null和undefined 没有constructor，所以无法检测
- 检测会报错，因为没有constructor

---

#### Object.prototype.toString.call()
> .toString是原型上的方法，返回的是一个字符串，这个字符串格式为"[obejct Type]"
> 在这个的Type就为内置对象类型（ps：万物皆对象）

> 因为基本数据类型一旦使用了内置对象上的方法，js会自动将基本数据类型包装成对应的内置对象,例如 1.toString()
##### 示例
```
Object.prototype.toString.call(123)  =>  [object Number]
Object.prototype.toString.call(null)  =>  [object Null]
Object.prototype.toString.call(undefined)  =>  [object Undefined]
Object.prototype.toString.call(Math)  =>  [object Math]
Object.prototype.toString.call(new Date())  =>  [object Date]
Object.prototype.toString.call({})  =>  [object Object]
Object.prototype.toString.call([])  =>  [object Array]
```

##### 特殊点1： 自定义构造函数实例化出来的对象 => [object Object]

```
function Test(){}

Object.prototype.toString.call(new Test()); // [object Object]
```
- 如果一个对象有 Symbol.toStringTag 属性并且该属性值是个字符串, 那么这个属性值, 会被用作 Object.prototype.toString() 返回内容的 Type 值进行展示

```
const obj = {
  [Symbol.toStringTag]: 'Bar'
}

Object.prototype.toString.call(obj) // [object Bar]
```

##### 获取数据类型function
```js
const getDataType = (data) => {
  let type = typeof obj;
  if (type !== "object") { // typeof
    return type;
  }
  // 如果类型是 object
  return Object.prototype.toString.call(data)
    .slice(8, -1)
    .toLocaleLowerCase()
}
```
