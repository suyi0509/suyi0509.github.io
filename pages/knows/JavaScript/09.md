## 执行上下文总结
```js
// 代码片段一
var scope = 'global scope';
function checkScope(){
    var scope = 'local scope'
    function f(){
        return scope
    }
    return f()
}
checkScope()
```
```js
// 代码片段二
var scope = 'global scope';
function checkScope(){
    var scope = 'local scope'
    function f(){
        return scope
    }
    return f
}
checkScope()()
```
上述结果都为 'local scope'

### 代码片段一
- step1. 执行全局代码，创建全局上下文，全局上下文被压入执行上下文栈
```js
ECStack = [
    globalContext
]
```
- step2. 全局执行上下文初始化,包含三个元素
```js
globalContext = {
    VO：[global] // 变量对象
    Scope： [globalContext.VO] // 作用域链集合
    this：globalContext.VO
}
```

- step3. checkScope函数被创建，先保存作用域链到内部属性[[scope]]
```js
checkScope.[[scope]] = {
    globalContext.VO // 保存作用域链
}
```

- step4. 执行checkScope函数，创建函数执行上下文，压入进执行栈
```js
ECStack = [
    checkScopeContext, // 压入进执行栈
    globalContext
]
```

- step5. checkScope函数执行上下文初始化
   - a. 复制函数[[scope]]属性，创建作用域链
   ```js
    checkScopeContext = {
        Scope： [globalContext.VO] // 复制函数[[scope]]属性
        this：undefined
    }
   ``` 
   - b. 用arguments创建活动对象
    ```js
    AO = {
        arguments: { // 创建
            length: 0
        }
    }
    ```

   - c. 初始化活动对象，即加入形参、函数声明、变量声明
     - c.1 第一阶段： 进入执行上下文之后 
        ```js
        AO = {
            arguments:{
                length: 0
            }
            scope2: undefined // 加入
            f：reference to function f(){} // 加入
        }
        ``` 
     - 总
     ```js
      checkScopeContext = {
         AO = {
              arguments:{
                  length: 0
              }
              scope2: undefined
              f：reference to function f(){}
          }
          Scope： [globalContext.VO]
          this:undefined
      }
     ``` 

   - d. 将活动对象压⼊ checkscope 作⽤域链顶端；
    ```js
     checkScopeContext = {
        AO = {
             arguments:{
                 length: 0
             }
             scope2: undefined
             f：reference to function f(){}
         }
         Scope： [AO,globalContext.VO] // 压⼊ checkscope 作⽤域
         this:undefined
     }
    ``` 

- step6. 准备工作完成后，执行函数，修改AO的属性值
```js
//  第二阶段： 代码执行
 checkScopeContext = {
        AO = {
             arguments:{
                 length: 0
             }
             scope2: 'local scope' // 修改AO的属性值
             f：reference to function f(){}
         }
         Scope： [AO,globalContext.VO]
     }
``` 

- step7. 执行函数，创建fContext - fContext
- step8. f函数被创建，先保存作用域链到内部属性[[scope]]
```js
f.[[scope]] = {
    checkScopeContext.VO
    globalContext.VO // 保存作用域链
}
```
- step9.创建函数执行上下文，压入进执行栈
```js
ECStack = [
    fContext, // 压入进执行栈
    checkScopeContext,
    globalContext
]
```

- step10.执行函数，修改AO的属性值
```js
fContext = {
    VO：{
        arguments={
            length：0
        }
    }
    Scope： [AO,checkScopeContext.VO,globalContext.VO] // 作用域链集合
    this：undefined
}
```
- step10. 执行完f函数 弹出执行栈
```js
ECStack = [
    checkScopeContext,
    globalContext
]
```
- step10. 执行完checkScope函数 弹出执行栈
```js
ECStack = [
    globalContext
]
```

执行栈应该是 
> -  ECStack.push(globalContext)
> -  ECStack.push(<checkScope> functionContext)
> -  ECStack.push(<f> functionContext)
> -  ECStack.pop()  // f弹出
> -  ECStack.pop()  // checkScope弹出
> -  ECStack.pop()  // globalContext弹出

- step11.在f中找不到就会沿着作用域链往上找 所以scope = 'local scope'

### 代码片段二
简述一下 执行栈
```js
1-1. 创建全局执行上下文
1-2. 把全局执行上下文压入进执行文栈
1-3. 初始化全局执行上下文

2-1. 创建checkScope函数，保存作用域链到内部属性[[scope]]
2-2. 创建checkScope函数执行上下文
2-3. 把函数执行上下文压入进执行文栈
2-4. 初始化函数执行上下文

3-1. 执行checkScope函数完成，弹出执行上下文栈

4-1. 创建f函数执行上下文
4-2. 把f函数执行上下文压入进执行文栈
4-3. 初始化f函数执行上下文

5-1. 执行f函数完成，弹出执行上下文栈
```

简述一下 函数执行上下文初始化
```js
1-1. 复制函数[[scope]]属性，创建作用域链
2-1. 用arguments创建活动对象
2-2. 初始化活动对象，即加入形参、函数声明、变量声明等准备工作
2-3. 将活动对象压⼊ checkscope 作⽤域链顶端；
2-4. 准备工作完成后，执行函数，修改AO的属性值
```



执行栈应该是 
> -  ECStack.push(globalContext)
> -  ECStack.push(<checkScope> functionContext)
> -  ECStack.pop()  // checkScope弹出
> -  ECStack.push(<f> functionContext)
> -  ECStack.pop()  // f弹出
> -  ECStack.pop()  // globalContext弹出
// f执行上下文上维护了一个作用域链