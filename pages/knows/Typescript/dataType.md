## TS的数据类型

> ts在js基础上，新增了一些更实用的数据类型，在开发阶段，可以为明确的变量定义为某种类型，这样ts就能在编译阶段进行类型检查，当类型不符合预期结果的时候则会出现错误提示


### 数据类型
- boolean(布尔型)
- number（数字类型）
- string（字符串类型）
- array（数组类型）-> string[] | Array<元素类型>
- tuple（元组类型）-> [string, number, boolean]
- enum（枚举类型）-> 
  ```js
  enum ColorEnum {Red,Yellow,Blue}
  let c:ColorEnum = ColorEnum.Red
  ```
- any（任意类型）
- null和undefined类型
- void类型 -> 表示该方法没有返回值
- never类型 -> 一般用来指定那些总是会抛出异常、无限循环
  ```js
  let a:never;
  a=(() => {
    throw new Error('错误')
  })()

  function err(msg: string):never {
    throw new Error(message);
  }
  ```
- object类型 


### 高级类型

- 交叉类型
- 联合类型
- 类型别名
- 类型索引
- 类型约束
- 映射类型
- 条件类型

#### 1. 交叉类型（&）
将多个类型合并为一个类型，包含所需的所有类型的特性，本质上是一种并的操作
```js
// T & U

function extendFunc<T,U>(first:T,second:U):T&U{
    let result:< T & U > = {}
    for(let key in first) {
        result[key] = first[key]
    }
    for(let key in second) {
        if(!result.hasOwnProperty(key)){
            result[key] = second[key]
        }
    }
    return result
}

```

#### 2. 联合类型（|）
其类型为连接得多类型中得其中一个，本质上是一个交的关系
```js
// T | U

function Test(arg: string[] | string){
    let result = '';
    if(typeof(arg) === 'string'){
        result = arg.trim()
    }else {
        result = arg.join('').trim()
    }
}
```

#### 3. 类型别名（type）
类型别名会给类型起一个新的名字，可以作用于 原始值、联合类型、元组（重新定义类型）

```js
interface A {...}
type someName = A | B | Boolean | string

const a:someName = true // OK
const b:someName = '111' // OK
const c:someName = 123 // error

type Test<T> = { value: T };

// 也可以使用类型别名在属性里引用自己
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>
}
```

- interface是用于定义对象类型，而type是除了对象之外还可以定义交叉、联合、原始类型 更为广泛


#### 4.类型索引（keyof）
keyof 类似于Object.keys，用于获取一个接口中Key的联合类型
```js
// keyof
interface Button {
    type：string
    text：string
}
type BottonKeys = keyof Button
// 等同于
type BottonKeys = "type" | "text"
```

#### 5.类型约束（extend）
通过关键字 **extend** 进行约束，不同于class后使用extends的继承作用，泛型内使用是为了 对泛型加以约束

```js
// extend

type TypeTest = string | number | boolean

function copy<T extends TypeTest>(arg:T):T{
    return arg
}

function getValue<T, K extends keyof T>(obj: T, key: K) {
 return obj[key]
}
const obj = { a: 1 }
const a = getValue(obj, 'a') // 1

```

#### 6. 映射类型（in）
通过in做类型的映射，遍历已有接口的key或者遍历联合类型
```js
type Readonly<T> = {
    readonly [P in keyof T]:T[p]
}

interface Obj { 
    a: string
    b：string
}

type ReadOnlyObj = Readonly<Obj>
```
- keyof T: 通过类型索引keyof得到联合类型 'a' | 'b'
- P in keyof T 等同于 P in 'a' | 'b',相当于执行一次forEach的逻辑，遍历 'a' | 'b'

等同于下述
```js
interface ReadOnlyObj{
    readonly a: string;
    readonly b: string;
}
```

#### 7.条件类型
语法规则和三元表达式一致，常用于一些类型不确定的情况
```js
T extends U? X:Y
// 如果T是U的子集，就是类型X，否则为类型Y
```