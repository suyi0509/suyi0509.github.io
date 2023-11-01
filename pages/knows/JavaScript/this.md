## this

### Types
ECMAScript的类型分为 1.语言类型 和 2.规范类型
- 语言类型就是我们常见的Undefined、Null、Boolean、String、Number和Object
- 规范类型是用来表述语言结构和语言类型的
   >- Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, 和 Environment Record
   >- 作用是用来描述 语言底层行为逻辑


### Reference
Reference由三个部分组成
- base value
- referenced name
- strict reference
---

- base value
> 就是属性所在的对象或者全局EnvironmentRecord，他的值只可能是 undefined, an Object, a Boolean, a String, a Number, or an environment record其中一种


- referenced name
> 就是属性的名称

#### 示例
```js
var foo = 1

// foo对应的Reference
var fooReference = {
    base：EnvironmentRecord,
    name:'foo',
    strict: false
}

---

var foo = {
    bar: function(){
        return this
    }
}

foo.bar() // foo

// bar对应的Reference
var barReference = {
    base：foo,
    name:'bar',
    strict: false
}
```

#### 获取Reference的方法：GetBase和IsPropertyReference

- GetBase 
返回reference的base value，内部使用GetValue返回对象属性真正的值

- IsPropertyReference
base value 是⼀个对象，就返回true

## 如果确定this值
- step1： 计算 MemberExpression 的结果赋值给 ref；
- step2： 判断 ref 是不是⼀个 Reference 类型
> - a: 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref) 
> - b: 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么this的值为 ImplicitThisValue(ref)  
> - c: 如果 ref 不是 Reference，那么 this 的值为 undefined； 

## MemberExpression计算结果

```js
function foo() {
 console.log(this)
}
foo(); // MemberExpression 是 foo


function foo() {
 return function() {
 console.log(this)
 }
}
foo()(); // MemberExpression 是 foo()


var foo = {
 bar: function () {
 return this;
 }
}
foo.bar(); // MemberExpression 是 foo.bar
```

- 简单理解 MemberExpression 其实就是()左边的部分

### 示例
```js
var value = 1;

var foo = {
 value: 2,
 bar: function () {
    return this.value;
 }
}
console.log(foo.bar())   // 示例1
console.log((foo.bar = foo.bar)()) // 示例2
console.log((false || foo.bar)()) // 示例3
```

- 示例1 foo.bar()
1. 计算MemberExpression： MemberExpression = foo.bar
2. foo.bar是否是Reference 是的
```js
// bar的Reference 
var Reference = {
    base: foo,
    name: 'bar',
    strict: false
}
```
3. IsPropertyReference(ref) 是否为true
> IsPropertyReference(ref) 是否为true， 就看她的base value是否是一个对象，
> foo是一个函数对象，所以返回true
4. this的值就为 GetBase(ref) 既 foo， this指向foo

- 示例2 示例3
- (foo.bar = foo.bar)()
> - 1.计算MemberExpression, MemberExpression = (foo.bar = foo.bar)
> - 2. (foo.bar = foo.bar) 是否是Reference， 使用了赋值，即使用了GetValue()
> - 3. ref 不是 Reference, 那么this的值为undefined
> - 4. 代表如果在严格模式下为undefined，非严格模式下会转换成全局对象

- (false || foo.bar)()
> - 1.计算MemberExpression, MemberExpression = (false || foo.bar)
> - 2. (false || foo.bar) 是否是Reference， 使用了或运算，即使用了GetValue()
> - 3. ref 不是 Reference, 那么this的值为undefined
> - 4. 代表如果在严格模式下为undefined，非严格模式下会转换成全局对象


### 简单绑定规则
#### 使用场景
- 1.默认绑定
- 2.隐式绑定
- 3.new绑定
- 4.显式绑定
- 5.箭头函数


##### 1.默认绑定
全局环境中定义person函数，内部使用this关键字
```js
var name = 'Jenny'
function person() {
 return this.name;
}
console.log(person()); //Jenny
```
上方是在window上调用的person，所以this指向window，输出Jenny
- 严格模式及下，不能讲全局对象默认绑定，this绑定undefined
  

##### 2.隐式绑定
如果函数作为了某个对象的方法调用，这时this就指向这个上级对象
```js
function test() {
   console.log(this.x)
}
var obj = {}
obj.x = 1;
obj.m = test

obj.m()  //1
```
当函数被调用，this指向调用的那个对象

```js
var o = {
    a:10,
    b:{
        fn:function(){
           console.log(this.a); //undefined
        }
    }
}
o.b.fn();
// fn是被b调用的，所以this.a是在对象b的层级上，b内部并没有定义，所以输出undefined
```

- 变量会沿着作用域链往上找，this不会

```js
var o = {
    a:10,
    b:{
       a:12,
       fn:function(){
           console.log(this.a); //undefined
           console.log(this); //window
       }
    }
}
var j = o.b.fn;
j();

// 这里this指向window，为什么呢，因为我们说得是函数调用时，所在的环境。
// j=o.b.fn 只是赋值，并没有被调用执行
// 当执行j(),才是调用执行，所以指向函数j的上一层对象window
```

##### 3.new绑定
通过构建函数new关键字生成一个实例对象，这时this会指向这个实例对象

```js
function test() {
    this.x = 1
}

var obj = new test()
obj.x = 1
// 这个是因为new关键字，new出来的指向这个实例对象
```
- 特殊点
1. return了一个对象，这时this指向为返回的对象
```js
function fn(){
    this.user = 'xxx'
    return {}
}
var a = new fn()
console.log(a.user) // undefined
// return出去了{}，this指向{}，所以是undefined
```

2. return了一个简单类型，则this指向这个实例对象
```js
function fn(){
    this.user = 'xxx'
    return 1
}
var a = new fn()
console.log(a.user) // xxx
// return出去了1，为简单类型，this指向实例对象a，
```

3. null虽然也是对象，但是这时new也依然指向实例对象
```js
function fn(){
    this.user = 'xxx'
    return null
}
var a = new fn()
console.log(a.user) // xxx
// return出去了null，特殊，this指向实例对象a，
```

##### 显式修改
apply() 、call() 、bind() 是函数的一个方法，作用是改变函数的调用对象
- 第一个参数就是this指向

```js
var x = 0;
function test() {
    console.log(this.x);
}

var obj = {};
obj.x = 1;
obj.m = test;
obj.m() // 1
obj.m.apply() // 0
// 之前我们说过，正常情况下谁调用就指向谁
// 所以obj.m(),调用指向obj，但是加入apply，this就执行第一个参数，如无即全局
```

##### 箭头函数
箭头函数的this是书写的时候就决定的了(编译时决定)

```js
const obj = {
    sayThis: () => {
        console.log(this)
    }
}

obj.sayThis() // window,箭头函数定义的时候this就绑到了window上
const globalSay = obj.sayThis;
globalSay() // window浏览器中的globalSay
```
- 注意点
1.绑定事件监听
```js
const button = document.getElementById('btn')
button.addEventListener('click',() => {
    console.log(this === window) // true
})
// 这里我们想要得是this指向点击得btn，但是这里this指向了window
```

2.原型上添加方法
```js
Cat.prototype.sayName = () => {
    console.log(this === window) // true
    return this.name
}
const cat = new Cat('mm')
cat.sayName()
```
原型上添加方法，这时this指向window，箭头函数不能作为构建函数


### 优先级
- 显式绑定 >> 隐式绑定
```js
function foo(){
    console.log(this.a)
}

var obj1 = {
    a:1,
    foo:foo
}   

var obj2 = {
    a:2,
    foo:foo
}

obj1.foo() // 1
obj2.foo() // 2

obj1.foo.cal(obj2) // 2
obj2.foo.cal(obj1) // 1
```

- new绑定 >> 显式绑定
```js
function foo(something){
    this.a = something
}

var obj1 = {}
var bar = foo.bind(obj1)
bar(2)
console.log(obj1.a) //2
// bar被绑到obj1上

var obj2 = new bar(3)
// new了bar   bar就会被绑定在obj2上
console.log(obj2.a) //3

bar(2)
```

总： 箭头函数 > new绑定 > 显式绑定 > 隐式绑定 > 默认