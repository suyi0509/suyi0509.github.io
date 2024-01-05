## Generator
### 介绍
> Generator函数是ES6提供的一种异步编程解决方案

执行Generator函数会返回一个遍历器对象，可以依次遍历Generator函数内部的每一个状态

#### 特点
1. Generator函数， function关键字和函数名之间有一个星号
2. 函数体内部使用 **yield** 表达式，定义不同的内部状态，value是值，done是完成状态
3. Generator函数，会将异步操作同步化表达出来

### 使用方式
```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator(); // helloWorldGenerator{}

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }

```
> 调用Generator函数，返回一个遍历器对象，代码Generator函数的内部指针，每调用遍历器对象的next方法，指针指向就会返回 value 和 done 两个属性，value是返回值，done是完成状态。

> generator其实是提供了可以暂停执行的函数， **yield**就是暂停的标志，遇到yield就暂停执行后面的操作，直到下一次调用next方法，才会继续往下执行，因此这也等于为 js 提供了手动的 **惰性求值** 功能

### 异步解决方案
- 回调函数
- Promise对象
- generator函数
- async/await

#### 区别
1. Promise、async/await是专门用来处理异步操作
2. Generator 并不是专门为异步而设计的，它还具备其他功能（对象迭代、控制输出、部署 Interator 接口）
3. promise 编写的代码都比 async/await、generator更为复杂，可读性也更差
4. generator 、 async 需要和promise对象搭配处理异步情况
5. async/await 本质上是 generator 的语法糖，相当于会自动执行 generator 函数
6. async/await 使用上更简洁，将异步代码以同步形式进行编写，是处理异步编程的最终方案

### 应用场景

1. 将异步操作，同步化表达
redux-saga中间件也充分利用了 Generator 特性
```js
function* loadUI(){ // Generator函数
    showLoadingScreen()
    yield loadUIDataAsynchronously();
    // ----------------走完loadUIDataAsynchronously 再暂停
    hideLoadingSCreen()
}


var loader = loadUI()

loader.next() // 加载UI
loader.next() // 卸载UI
```

2. 利用 generator 在对象上实现Iterator接口
```js
function* itemEntries(obj){
    let keys = Object.keys(obj);
    for (let i=0; i < keys.length; i++) {
        let key = keys[i];
        yield [key, obj[key]];
    }
}
let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
 console.log(key, value);
}
// foo 3
// bar 7
```

