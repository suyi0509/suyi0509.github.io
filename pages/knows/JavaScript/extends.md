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


#### 4.原型式继承
#### 5.寄生式继承
#### 6.寄生组合式继承
