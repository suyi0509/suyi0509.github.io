## 执行上下文

#### 顺序执行
- 写过js的同学们都会有直观的印象，那就是顺序执行

```js
var foo = function () {
 console.log('foo1');
}
foo(); // foo1

var foo = function () {
 console.log('foo2');
}
foo(); // foo2

```

```js
function foo() {
 console.log('foo1');
}
foo(); // foo2

function foo() {
 console.log('foo2');
}
foo(); // foo2
// -----------------------> 这次打印为两个foo2
```

这是因为JS引擎并不是一行行的分析执行的。而是一段段的分析执行。当执行一段代码时，会进行 **准备工作**

这里的**准备工作**，就是 **执行上下文（execution context）**

在了解准备工作之前，我们要先了解一个概念就是 **可执行代码**

---

### 可执行代码
可执行代码有三种
- 1.全局代码
- 2.函数代码
- 3.eval代码

### 执行上下文栈

JS为了管理 执行上下文 ，创建了 **执行上下文栈（Execution context stack， ECS）**

为了更清晰明了，我们定义数组 去模拟 **执行上下文栈** 的行为

```js
ECStack = []  // 模拟执行上下文栈
```

##### 1. 全局代码
> JS开始执行代码，首先遇到就是全局代码。所以在初始化的时候会向 执行上下文栈 压入一个全局执行上下文，我们用 globalContext

- 初始化时，会把全局执行上下文压入 执行上下文栈中，栈是先进后出，所以只有当整个应用程序结束时，ECStack才会被清空。

```js
ECStack = [
    globalContext
]
```

###### 1-1 示例分析1
> 当执行一个函数时,会创建一个执行上下文，并把它压入到执行上下文栈中，当函数执行完成后，会将这个函数的执行上下文从 栈 中弹出

```js
function f3(){
    console.log('f3')
}

function f2(){
   f3()
}

function f1(){
   f2()
}

f1()
```

-  ECStack.push(<f1> functionContext)
-  ECStack.push(<f2> functionContext)
-  ECStack.push(<f3> functionContext)
-  // ---------执行f3，输出'f3'
-  ECStack.pop()  // f3弹出
-  ECStack.pop()  // f2弹出
-  ECStack.pop()  // f1弹出

###### 1-2 示例分析2
- 上章这个示例，结果都为local scope 那么他们的执行栈有啥不一样呢
```js
// case 1
var scope = "global scope";
function checkScope(){
    var scope = "local scope"
    function f(){
        return scope
    }
    return f()
}
checkScope()
 
// case 2
var scope = "global scope";
function checkScope(){
    var scope = "local scope"
    function f(){
        return scope
    }
    return f
}
checkScope()()
```

- case1
> - ECStack.push(<checkScope> functionContext)
> - ECStack.push(<f> functionContext)
> - 执行完成 f()
> - ECStack.pop()  // f弹出
> - ECStack.pop()  // checkScope弹出


- case2
> - ECStack.push(<checkScope> functionContext)
> - ECStack.pop()  // checkScope弹出
> - ECStack.push(<f> functionContext)
> - ECStack.pop()  // f弹出

这就是我们的执行上下文栈
---