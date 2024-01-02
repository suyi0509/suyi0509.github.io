## Promise

优点：
- 链式操作减低了编码难度
- 代码可读性明显增强

### 状态
promise有三种状态
- pending（进行中）
- fulfilled（已成功）
- rejected（已失败）

### 特点
- 1.promise状态一旦改变（pending -> fulfilled, pending -> rejected），就不会再变
- 2.接受一个函数作为参数，该函数两个参数分别是 **resolve** 和 **reject**
    - resolve函数作用：将Promise对象的状态从 pending => fulfilled
    - reject函数作用：将Promise对象的状态从 pending => rejected

### 用法
```js
const promise = new Promise(function(resolve,reject){})
```

### 实例方法
1. then()
2. catch()
3. finally()

#### then
then是实例状态发生改变时的回调函数
- 1.第一个参数resolved状态的回调函数
- 2.第二个参数时rejected状态的回调函数
- 3.返回一个新的promise实例，promise能链式书写的原因

#### catch
catch是用于指定发生错误时的回调函数
- 1.对象的错误具有冒泡性质，会一直向后传递，直到被捕获为止

#### finally()
finally是用于指定不管Promise对象最后状态如何，都会执行的操作
```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```


### 构造函数方法
- all()
- race()
- allSettled()
- resolve()
- reject()
- try()

#### all()
异步并发,返回一个数组，每个请求都成功才会返回成功结果数组，否则会报错
```js
const p = Promise.all([p1,p2,p3])
实例P的状态由p1、p2、p3决定
- 1. p1-p3状态都是fulfilled，p就会变成fulfilled，这时p1、p2、p3的返回值组成一个数组，传递给p的回调函数
- 2. p1-p3中有rejected，p就会变成rejected，返回第一个被reject实例的返回值，传递给p的回调函数
- 3. 如果reject实例有catch就不会走到外层promise.all()的catch，如果都没有则会调用promise.all()的catch
```

#### race()
只要有一个实例先改变状态，P就跟着改变状态

#### allSettled()
接受一组Promise实例作为参数，只有等所有的参数实例都返回接口才会进行返回，不管是fulfilled或rejected。

#### resolve()
1. 参数为Promise实例，返回这个实例
2. 参数为thenable对象，把这个对象转成Promise对象，然后再执行该对象得then方法
3. 参数不是Promise实例，也不是thenable对象，则会转成Promise对象，状态为resolve()
4. 没有参数，直接返回一个状态为resolve的Promise对象

#### reject()
返回一个状态为reject的Promise对象


## 手写Promise
promise用法
```js
new Promise((resolve, reject) => {
    resolve('resolve') // reject('reject') => 手动控制Promise状态
})
.then((res) => {})
.catch((err) => {})
```
### 分析功能
1. 构造函数接受一个函数，函数接收2个参数(resolve,reject)
2. resolve成功回调
3. reject失败回调
4. promise三种状态，一旦发生变化就无法改变
   - pending 初始状态
   - fulfilled 成功
   - rejected 失败
5. then方法，接受两个回调参数，onFulfilled 和 onRejected
6. 异步调用
7. then方法链式调用
8. onFulfilled 和 onRejected 的异步调用
9. 值穿透
10. catch()
11. all()
12. rate()
13. resolve()
14. reject()
15. allSettled()

### 功能实现
#### 1.基本结构
实现前3个功能
> - 构造函数接受一个函数，函数接收2个参数(resolve,reject)
> - resolve成功回调
> - reject失败回调

```js
class newPromise {
    constructor(executor) {
        let resolve = res => {} // 定义 resolve
        let reject = err => {} // 定义 reject
        executor(resolve, reject); // 传入的整个函数
    }
}

// 测试
new newPromise((resolve, reject) => {
    console.log('hello Promise') // hello Promise
})
```
### 2.三种状态
> promise三种状态，一旦发生变化就无法改变
> - pending 初始状态
> - fulfilled 成功
> - rejected 失败

```js
class newPromise {
    constructor(executor) {
        this.status = 'pending' // 默认状态-pending
        this.value; // 成功时的值
        this.error; // 失败时的值

        let resolve = res => {
            // 成功逻辑处理
            if (this.status === 'pending') {
                this.value = res
                this.status = 'resolved'
                console.log('resolved回调',this.status,this.value)
            }
        }
        let reject = err => {
            // 失败逻辑处理
            if (this.status === 'pending') {
                this.error = err
                this.status = 'rejected'
                console.log('rejected回调',this.status,this.error)
            }
        }
        executor(resolve, reject);
    }
}

// 测试
new newPromise((resolve, reject) => {
    resolve('1.成功') // resolved回调 resolved 1.成功
})

new newPromise((resolve, reject) => {
    reject('2.失败') // rejected回调 rejected 2.失败
})

new newPromise((resolve, reject) => {
    resolve('3.成功') // resolved回调 resolved 3.成功 -状态一发生改变就不会再变
    reject('3.失败')
})
```

### 3.then方法
> then接受两个回调参数，onFulfilled 和 onRejected
```js
class newPromise {
    constructor(executor) {
        this.status = 'pending'
        this.value;
        this.error;

        let resolve = res => {
            if (this.status === 'pending') {
                this.value = res
                this.status = 'resolved'
            }
        }
        let reject = err => {
            if (this.status === 'pending') {
                this.error = err
                this.status = 'rejected'
            }
        }
        executor(resolve, reject);
    }
    // 声明then
    then(onFullfilled,onRejected){
        if(this.status === 'resolved'){// resolved成功回调
            onFullfilled(this.value)
        }
        if(this.status === 'rejected'){// rejected失败回调
            onRejected(this.error)
        }
    }
}

// 测试
new newPromise((resolve, reject) => {
    resolve('成功')
}).then((res) => {
    console.log('res:',res) // res: 成功
},(err) => {
    console.log('err:',err)
})

new newPromise((resolve, reject) => {
    reject('失败')
}).then((res) => {
    console.log('res:',res)
},(err) => {
    console.log('err:',err) // err: 失败
})

```

### 4.异步调用
> - 当resolve在setTimeout内执行，这时then中的state还是'pending'状态
> - 我们就需要在then调用时，把成功和失败存在各自的数组中，直到reject或resolve再执行
> - 这里考虑到promise可链式调用，多个then，再执行时需要遍历执行

```js
class newPromise {
    constructor(executor) {
        this.status = 'pending'
        this.value;
        this.error;
        this.resolveQueue = []; // 成功存放的数组队列
        this.rejectQueue = []; // 失败存放的数组队列

        let resolve = res => {
            if (this.status === 'pending') {
                this.value = res
                this.status = 'resolved'
                this.resolveQueue.forEach(fn => fn()) //一旦resolve执行
            }
        }
        let reject = err => {
            if (this.status === 'pending') {
                this.error = err
                this.status = 'rejected'
                this.rejectQueue.forEach(fn => fn()) //一旦rejected执行
            }
        }
        executor(resolve, reject);
    }
    // 声明then
    then(onFullfilled,onRejected){
        if(this.status === 'resolved'){
            onFullfilled(this.value)
        }
        if(this.status === 'rejected'){
            onRejected(this.error)
        }
        if(this.status === 'pending'){
            this.resolveQueue.push(() => { // 把onFullfilled传入成功的数组中
                onFullfilled(this.value)
            })
            this.rejectQueue.push(() => { // 把onRejected传入失败的数组中
                onRejected(this.error)
            })
        }
    }
}

// 测试
new newPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功')
    },500)
}).then((res) => {
    console.log('res:',res) // 500ms后 res: 成功
})
```
### 5.链式调用
> 链式调用，就是在前一个then函数内返回一个promise，再传递给下一个then中
### 6.onFulfilled 和 onRejected 的异步调用
### 7.值穿透
### 8. catch()

### 9. all()
> - 接受一个Promise数组，数组中如有非Promise项，那么此项当成功
> - 如果所有Promise都成功，就返回成功的数组
> - 有一个Promise失败，就返回那个失败的结果

```js
static all(promises) {
    const result = [] // 结果数组
    let count = 0 // 执行次数
    return new Promise((resolve, reject) => {
        const addData = (index, value) => {
            result[index] = value
            count++
            if (count === promises.length) resolve(result)
        }
        promises.forEach((promise, index) => {
            if (promise instanceof Promise) {
                promise.then(res => {
                    addData(index, res)
                }, err => reject(err))
            } else { // 如果不是Promise类
                addData(index, promise)
            }
        })
    })
}
```
### 10. rate()
### 11. resolve()
### 12. reject()
### 13. allSettled()