## 继承

### 定义
> 继承：如果B继承A，那么我们就称B为A的子类，A为B的父类或超类
- 优点
  - 1. 子类可以具有父类的属性和方法
  - 2. 子类可以重写某些属性和方法，即覆盖父类原有的方法

### 实现方式
1. 原型链继承
2. 构造函数继承(call)
3. 组合继承
4. 原型式继承
5. 寄生式继承
6. 寄生组合式继承

#### 1.原型链继承
> 前提：构造函数、原型、实例
> 每一个构造函数都有一个原型对象，原型对象也有一个指向构造函数的指针

```js
function Person() {
    this.name = 'parent1';
    this.play = [1, 2, 3]
}

function Child2() {
    this.type = 'child2';
}

Child2.prototype = new Person()
console.log(new Child2(), Child2.name)
/**
{type: "child2"}
[[Prototype]]: {
    Person
    name: "parent1"
    play: (4) [1, 2, 3, 4]
    [[Prototype]]: Object
}
*/

var s1 = new Child2();
var s2 = new Child2();
s1.play.push(4);

console.log(s1.play, s2.play);
// [1,2,3,4] [1,2,3,4]
```
再上面实例中，改变s1属性  s2也会跟着改变

#### 2.构造函数继承
```js
function Parent(){
    this.name = 'parent'
}
Parent.prototype.getName = function(){
    return this.name
}

function Child(){
    Parent.call(this)
    this.type = 'child'
}

let child1 = new Child()
console.log(child1,'child1') 
// {
//    "name": "parent",
//    "type": "child"
//}
console.log(child1.getName()) // 不存在 报错
```
在父类原型上定义得方法，子类是无法继承到，这种相对于原型链继承，父类得一些引用属性就不会被共享，只能继承父类得一些实例属性和方法，不能被继承原型属性或方法

#### 3.组合继承
把原型链继承和构造函数继承结合起来
```js
function Parent3() {
    this.name = 'parent3';
    this.play = [1, 2, 3];
}
Parent3.prototype.getName = function () {
    return this.name;
}
function Child3() {
    Parent3.call(this);
    this.type = 'child3';
}
Child3.prototype = new Parent3();
Child3.prototype.constructor = Child3;
var s3 = new Child3();
var s4 = new Child3();
s3.play.push(4)
console.log(s3,s4)
/** 
 *  ------------------>s3
    {
    "name": "parent3",
    "play": [
        1,
        2,
        3,
        4
    ],
    "type": "child3"
    }

    ---------------------> s4
    {
    "name": "parent3",
    "play": [
        1,
        2,
        3
    ],
    "type": "child3"
    }
 */
```

#### 4.原型式继承
借助Object.create方法实现对普通对象得继承

```js
let parent = {
    name:'parent',
    firends:['p1','p2','p3'],
    getName:function(){
        return this.name
    }
}

const child1 = Object.create(parent)
child1.name = 'child1';
child1.firends.push('c1')

const child2 = Object.create(parent)
child2.firends.push('c2')

console.log(child1,child2)
console.log(child1.getName()) // child1

/**
-------------------------->child1
name: "child1"
[[Prototype]]:{
    firends: Array(5):["p1","p2","p3","c1","c2"]
    getName: ƒ ()
    name: "parent"
[[Prototype]]: Object

-------------------------->child2
[[Prototype]]:{
    firends: Array(5):["p1","p2","p3","c1","c2"]
    getName: ƒ ()
    name: "parent"
[[Prototype]]: Object
 */
```
Object.create方法是实现浅拷贝，多个引用实例的引用类型指向相同的内存，导致篡改

#### 5.寄生式继承
```js
let parent = {
    name:'parent',
    firends:['p1','p2','p3'],
    getName:function(){
        return this.name
    }
}

function clone(original){
    let clone = Object.create(original)
    clone.getFriends = function(){
        return this.firends
    };
    return clone
}

let child1 = clone(parent)
let child2 = clone(parent)
child1.name = 'child1'
child1.firends.push('c1')
child2.name = 'child2'
child2.firends.push('c2')
console.log(child1,child2)
console.log(child1.getFriends()) // ["p1","p2","p3","c1","c2"]


/**
-------------------------->child1
name: "child1",
getFriends: ƒ ()
[[Prototype]]:{
    firends: Array(5):["p1","p2","p3","c1","c2"]
    getName: ƒ ()
    name: "parent"
[[Prototype]]: Object

-------------------------->child2
name: "child2",
getFriends: ƒ ()
[[Prototype]]:{
    firends: Array(5):["p1","p2","p3","c1","c2"]
    getName: ƒ ()
    name: "parent"
[[Prototype]]: Object
 */
```
寄生式继承，和原型式继承是一样的，也会导致篡改

#### 6.寄生组合式继承
所有方式里面相对最优得继承方式
```js
function clone(parent,child){
    child.prototype = Object.create(parent.prototype)
    child.prototype.constructor = child
}

function Parent(){
    this.name = 'parent'
    this.play = [1,2,3]
}

Parent.prototype.getName = function(){
    return this.name
}

function Child(){
    Parent.call(this)
    this.friends = 'child'
}

clone(Parent,Child)

Child.prototype.getFriends = function(){
    return this.friends
}

let person = new Child()
console.log(person)
/** 
 friends: "child"
 name: "parent"
 play: (3) [1, 2, 3]
 [[Prototype]]: Parent
 */
console.log(person.getName()) // parent
console.log(person.getFriends()) // child
```
属性得到了继承，方法正常输出

- extends也是采用寄生组合继承方式
```js
// 利用babel工具转换
class Person{
    constructor(name){
        this.name = name
    }
    // 原型方法
    // Person.prototype.getName = function(){}
    getName = function(){
        console.log('Person',this.name)
    }
}

class Gamer extends Person {
    constructor(name,age){
        // 子类中存在构造函数，则需要在使用this前使用super()
        super(name)
        this.age = age
    }
}

const asuna = new Gamer('apple',20)
asuna.getName() // 'Person apple'
```


## 总结
- 不使用object.create
    - 构造函数继承
    - 原型链继承
- 使用object.create
    - 原型式继承
    - 寄生式继承

构造函数继承 + 原型链继承 = 组合继承
原型式继承 + 寄生式继承 + 组合继承 = 寄生组合继承 （类似es6 extends）