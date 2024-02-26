## class类

> 类(Class)是面向对象的程序设计（OOP，Object-Oriented Programming）实现信息封装的基础。类是一种用户定义的引用数据类型，也称类类型。JS的class有一些特性没有加入修饰符和抽象类,而TS的class支持面向对象的所有特性，类、接口等

类（class）包含以下模块
- 字段
- 构造函数
- 方法

```js
class Car{
    constructor()
}
```

### 1.继承
```js
class Animal {
    move(name:string){
        console.log(name + 'move')
    }
}

class Dog extends Animal{
    speak(){
        console.log('Wang Wang')
    }
}

const dog = new Dog()
dog.move('dog')
dog.speak()
```
Dog是一个派生类，它的派生来自于 Animal 基类，派生类一般被称为子类，基类也通常会被称为超类

- 类在继承后，子类可以对父类的方法重新定义，这个过程称为 方法的重写，通过**super**关键字是对父类的直接引用

### 2.修饰符
ts添加三种修饰符
- 公有 pubilc: 可以自由的访问类程序的定义的成员
- 私有 private： 只能够在该类的内部进行访问
- 受保护 protect：除了在该类的内部访问，还可以在子类中访问
- 只读 readonly：只读属性，可以访问，无法重新分配

#### 2.1 私有修饰符
只能在类中进行访问，实例对象不能够访问，继承子类也不能访问

```js
class Father{
    private name:String
    constructor(name: String){
        this.name = name
    }
}
const father = new Father('111')
father.name // name为私有属性，只能在类Father中里面访问

class Son extends Father{
    say(){
        console.log(`my name is ${this.name}`)// name为私有属性，只能在类Father中里面访问
    }
}
```

#### 2.2受保护修饰符
跟私有修饰符类似，实例对象不可访问受保护的属性，但是继承子类可以访问
```js
class Father{
    private name:String
    constructor(name: String){
        this.name = name
    }
}
const father = new Father('father')
father.name // name为私有属性，只能在类Father中里面访问

class Son extends Father{
    say(){
        console.log(`my name is ${this.name}`)
    }
}
const son = new Son('son')
son.say()// my name is son
```

#### 2.3静态属性
static 存在于类本身上面，而不是类的实例上。访问这些属性 **类型.静态属性** 这种形式访问

```js
class Square{
    statuc width = '100px'
}

console.log(Square.width) // 100px
```

