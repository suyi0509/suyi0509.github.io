## New

### 是什么
new操作符,用于创建一个给定构造函数的实例对象

```js
function Person(name, age){
 this.name = name;
 this.age = age;
}
Person.prototype.sayName = function () {
 console.log(this.name)
}
const person1 = new Person('Tom', 20)
console.log(person1) // Person {name: "Tom", age: 20}
t.sayName() // 'Tom'
```
new通过构造函数Person创造出实例对象 person1
这个实例对象person1，可以访问构造函数中的属性，也可以访问原型链上的一些属性合方法

- 构造函数返回值
  1.如果是返回原始值，返回值无效
  ```js
  function Test (name){
    this.name = name
    return 1
  }

  const test = new Test('sue')
  console.log(test.name)  // sue
  ```
  2.如果是返回对象，那么就会返回这个值
  ```js
  function Test (name){
    this.name = name
    return {age: 18}
  }

  const test = new Test('sue')
  console.log(test)  // {age: 18}
  console.log(test.name) // undefined
  ```
### new过程
1.创建一个新对象 obj
2.将对象与构造函数通过原型链链接起来
3.将构造函数中的this绑定在新建的obj上
4.根据构造函数的返回类型做判断，进行返回

```js
const person = new Person('sue')
1. 创建一个对象person {}
2. 链接原型链person   person.__proto__ === Person.prototype 
    // 这时候的person =  {__proto__:Person.prototype  }
3. 把this绑定到新对象上  this指向person apply绑定
     // 这时候的person =  {__proto__:Person.prototype， name: sue  }
4. 看Person 构造函数的返回值，返回对应的person对象
```

### 手写new

```js
function newFn(Func, ...args) {
    // 1.创建一个新对象
    const obj = {}
    // 2.绑到构造函数的原型链上
    obj.__proto__ = Func.prototype
    // 3.把this指向新对象
    let result = Func.apply(obj, args)
    // 4.根据返回值判断
    return result instanceof Object? result : obj
}

// 测试一下
function Person(name, age){
 this.name = name;
 this.age = age;
}
Person.prototype.sayName = function () {
 console.log(this.name)
}
const person1 = newFn(Person,'Tom', 20)
person1.sayName() // 'Tom'
```