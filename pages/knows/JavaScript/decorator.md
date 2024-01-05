## 装饰器decorator

### 介绍
> 在ES6中 decorator, 本质上并不是什么高大上的结构，就是一个普通函数，用于扩展类属性和类方法

#### 用法
装饰器： **@ + 函数名** 用来装饰4种类型的值
- 类
- 类的属性
- 类的方法
- 属性存取器（accessor）

```js
@frozen  //  装饰 类Foo（） 等同于  Foo = decorator(Foo) || Foo;
class Foo {
  @configurable(false) //  装饰 method
  @enumerable(true) //  装饰 method
  method() {}

  @throttle(500) //  装饰 expensiveMethod（）
  expensiveMethod() {}
}
```

#### 类
当对类本身做装饰，只能够接收1个参数，就是它本身。如果需要多添加参数，则需要在装饰器外层再封装多一层函数
```js
function testable(isTestable) { // 再封装多一层函数
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true
```

#### 方法装饰器
装饰器同样可以用在函数上，可以去修改类的整个方法
```js
class A {
    @decMethod
    sayHello(){
        return 'hello dec'
    }
}
// 相当于 decMethod(A.sayHello)
```

#### 类属性装饰器
当对类属性进行装饰，能够接受三个参数
1. 类的原型对象
2. 需要装饰的属性名
3. 装饰属性名的描述对象

```js
// 1.readonly装饰器
function readonly(target,name,descriptor){
    descriptor.writable = fasle; // 描述对象 可写属性设为false
    return descriptor
}

// 2. 使用装饰类属性
class Person{
    @readonly
    name(){ return `${this.first} ${this.last}`}
}

// === readonly(Person,'name',descriptor)
```
> 如果一个方法，有多个装饰器，是先从外到内进入，再从内到外执行

```js
function dec(id){
    console.log('进入', id);
    return (target, property, descriptor) =>console.log('执行', id);
}
class Example {
    @dec(1)
    @dec(2)
    method(){}
}
// 进入 1
// 进入 2
// 执行 2
// 执行 1
```


> 装饰器不能用于修饰函数，因为函数存在遍历声明，所以函数组件，不能使用装饰器