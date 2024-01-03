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


--- 

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
1. 初始化变量、初始化this指向、定义resolve、reject
2. 执行resolve、reject、 promise三种状态，一旦发生变化就无法改变
   - pending 初始状态
   - fulfilled 成功
   - rejected 失败
3. then
4. 异步调用
5. then链式调用
6. 执行顺序
7. 值穿透
8. 异常捕获

### 功能实现
#### 1. 初始化
> 构造函数接受一个函数，函数接收2个参数(resolve,reject)resolve成功回调、reject失败回调
> 
```js
class MyPromise{
    constructor(executor){
        this.initValue() // 初始化参数
        this.initBind() // 初始化this绑定
        executor(this.resolve,this.reject)
    }
    initValue(){
        this.promiseStatus = 'pending' // 状态
        this.promiseResult = null // 返回的值
    }
    initBind(){
        this.resolve = this.resolve.bind(this) // 绑定在实例上
        this.reject = this.reject.bind(this)
    }
    resolve(res){}
    reject(err){}
}

// 测试
new MyPromise((resolve, reject) => {
    console.log('hello Promise') // hello Promise
})
```
#### 2.回调和三种状态
> promise三种状态，一旦发生变化就无法改变
> - pending 初始状态
> - fulfilled 成功
> - rejected 失败
```js
class MyPromise {
    constructor(executor) {
        this.initValue() // 初始化参数
        this.initBind() // 初始化this绑定
        executor(this.resolve, this.reject)
    }
    initValue() {
        this.promiseStatus = 'pending' // 状态
        this.promiseResult = null // 返回的值
    }
    initBind() {
        this.resolve = this.resolve.bind(this) // 绑定在实例上
        this.reject = this.reject.bind(this)
    }
    resolve(res) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'fulfilled'
            this.promiseResult = res
        }
    }
    reject(err) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'rejected'
            this.promiseResult = err
        }
    }
}

// 测试
new MyPromise((resolve, reject) => {
    resolve('1.成功') // "fulfilled" 1.成功
})

new MyPromise((resolve, reject) => {
    reject('2.失败') // "rejected" 2.失败
})

new MyPromise((resolve, reject) => {
    resolve('3.成功') // 'fulfilled' 3.成功
    reject('3.失败') 
})
// -状态一发生改变就不会再变
```
#### 3.then方法
> then接受两个回调参数，onFulfilled 和 onRejected
```js
class MyPromise {
    constructor(executor) {
        this.initValue() // 初始化参数
        this.initBind() // 初始化this绑定
        executor(this.resolve, this.reject)
    }

    initValue() {
        this.promiseStatus = 'pending' // 状态
        this.promiseResult = null // 返回的值
    }

    initBind() {
        this.resolve = this.resolve.bind(this) // 绑定在实例上
        this.reject = this.reject.bind(this)
    }

    resolve(res) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'fulfilled'
            this.promiseResult = res
        }

    }

    reject(err) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'rejected'
            this.promiseResult = err
        }
    }

    then(onFulfilled,onRejected){
        if(this.promiseStatus === 'fulfilled'){
            onFulfilled(this.promiseResult)
        }else if(this.promiseStatus === 'rejected'){
            onRejected(this.promiseResult)
        }
    }
}

// 测试
new MyPromise((resolve, reject) => {
    resolve('成功')
}).then((res) => {
    console.log('res:',res) // res: 成功
},(err) => {
    console.log('err:',err)
})

new MyPromise((resolve, reject) => {
    reject('失败')
}).then((res) => {
    console.log('res:',res)
},(err) => {
    console.log('err:',err) // err: 失败
})

```
#### 4.异步调用
> - 当resolve在setTimeout内执行，这时then中的state还是'pending'状态
> - 我们就需要在then调用时，把成功和失败存在各自的数组中，直到reject或resolve再执行
> - 这里考虑到promise可链式调用，多个then，再执行时需要遍历执行

```js
class MyPromise {
    constructor(executor) {
        this.initValue()
        this.initBind()
        executor(this.resolve, this.reject)
    }

    initValue() {
        this.promiseStatus = 'pending' 
        this.promiseResult = null 
        this.onFulfilledCallback = [] // 成功回调合计
        this.onRejectedCallback = [] // 失败回调合计
    }

    initBind() {
        this.resolve = this.resolve.bind(this) 
        this.reject = this.reject.bind(this)
    }

    resolve(res) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'fulfilled'
            this.promiseResult = res
            while(this.onFulfilledCallback.length){ // 循环执行
                this.onFulfilledCallback.shift()(this.promiseResult)
            }
        }

    }

    reject(err) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'rejected'
            this.promiseResult = err
             while(this.onRejectedCallback.length){// 循环执行
                this.onRejectedCallback.shift()(this.promiseResult)
            }
        }
    }

    then(onFulfilled,onRejected){
        if(this.promiseStatus === 'fulfilled'){
            onFulfilled(this.promiseResult)
        }else if(this.promiseStatus === 'rejected'){
            onRejected(this.promiseResult)
        }else if(this.promiseStatus === 'pending'){
            this.onFulfilledCallback.push(onFulfilled.bind(this)) // push进去
            this.onRejectedCallback.push(onRejected.bind(this))// push进去
        }
    }
}

// 测试
new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功')
    },500)
}).then((res) => {
    console.log('res:',res) // 500ms后 res: 成功
})
```
#### 5.链式调用
> 链式调用，就是在前一个then函数内返回一个promise，再传递给下一个then中
```js
class MyPromise {
    constructor(executor) {
        this.initValue()
        this.initBind()
        executor(this.resolve, this.reject)
    }

    initValue() {
        this.promiseStatus = 'pending'
        this.promiseResult = null
        this.onFulfilledCallback = [] // 成功回调合计
        this.onRejectedCallback = [] // 失败回调合计
    }

    initBind() {
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    resolve(res) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'fulfilled'
            this.promiseResult = res
            while (this.onFulfilledCallback.length) { // 循环执行
                this.onFulfilledCallback.shift()(this.promiseResult)
            }
        }

    }

    reject(err) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'rejected'
            this.promiseResult = err
            while (this.onRejectedCallback.length) {// 循环执行
                this.onRejectedCallback.shift()(this.promiseResult)
            }
        }
    }

    then(onFulfilled, onRejected) {
        let thenPromise = new MyPromise((resolve, reject) => {
            const resultPromise = (cb) => {
                const x = cb(this.promiseResult)
                if(x === MyPromise){
                    throw new Error('死循环')
                }
                if(x instanceof MyPromise){
                    x.then(resolve,reject)
                }else{
                    resolve(x)
                }
            }
            if (this.promiseStatus === 'fulfilled') {
                resultPromise(onFulfilled)
            } else if (this.promiseStatus === 'rejected') {
                resultPromise(onRejected)
            } else if (this.promiseStatus === 'pending') {
                this.onFulfilledCallback.push(resultPromise.bind(this, onFulfilled)) // push进去
                this.onRejectedCallback.push(resultPromise.bind(this,onRejected))// push进去
            }

        })
        return thenPromise
    }
}

//  测试
new MyPromise((resolve, reject) => {
   resolve(100)
}).then(res => {
    console.log(res, '第一个then') // 100
    return res * 2
}).then(res => {
    console.log(res, '第二个then') // 200
    return new MyPromise((resolve, reject) => {
        resolve(res + 100)
    })
}).then(res => {
    console.log(res, '第三个then') // 300
})
```
#### 6.执行顺序
```js
class MyPromise {
    constructor(executor) {
        this.initValue()
        this.initBind()
        executor(this.resolve, this.reject)
    }

    initValue() {
        this.promiseStatus = 'pending'
        this.promiseResult = null
        this.onFulfilledCallback = [] // 成功回调合计
        this.onRejectedCallback = [] // 失败回调合计
    }

    initBind() {
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    resolve(res) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'fulfilled'
            this.promiseResult = res
            while (this.onFulfilledCallback.length) { // 循环执行
                this.onFulfilledCallback.shift()(this.promiseResult)
            }
        }

    }

    reject(err) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'rejected'
            this.promiseResult = err
            while (this.onRejectedCallback.length) {// 循环执行
                this.onRejectedCallback.shift()(this.promiseResult)
            }
        }
    }

    then(onFulfilled, onRejected) {
        let thenPromise = new MyPromise((resolve, reject) => {
            const resultPromise = (cb) => {
                setTimeout(() => { // settimeout
                    const x = cb(this.promiseResult)
                    if (x === MyPromise) {
                        throw new Error('死循环')
                    }
                    if (x instanceof MyPromise) {
                        x.then(resolve, reject)
                    } else {
                        resolve(x)
                    }
                })
            }
            if (this.promiseStatus === 'fulfilled') {
                resultPromise(onFulfilled)
            } else if (this.promiseStatus === 'rejected') {
                resultPromise(onRejected)
            } else if (this.promiseStatus === 'pending') {
                this.onFulfilledCallback.push(resultPromise.bind(this, onFulfilled)) // push进去
                this.onRejectedCallback.push(resultPromise.bind(this, onRejected))// push进去
            }

        })
        return thenPromise
    }
}

// 测试
new MyPromise((resolve, reject) => {
    resolve(2)
}).then(res => {
    console.log(res, 'then微任务后执行：2')
})

console.log('外层先执行：1')
// 外层先执行：1
// 2 then微任务后执行：2
```
#### 7.值穿透
```js
class MyPromise {
    constructor(executor) {
        this.initValue()
        this.initBind()
        executor(this.resolve, this.reject)
    }

    initValue() {
        this.promiseStatus = 'pending'
        this.promiseResult = null
        this.onFulfilledCallback = [] 
        this.onRejectedCallback = [] 
    }

    initBind() {
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    resolve(res) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'fulfilled'
            this.promiseResult = res
            while (this.onFulfilledCallback.length) { 
                this.onFulfilledCallback.shift()(this.promiseResult)
            }
        }

    }

    reject(err) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'rejected'
            this.promiseResult = err
            while (this.onRejectedCallback.length) {
                this.onRejectedCallback.shift()(this.promiseResult)
            }
        }
    }

    then(onFulfilled, onRejected) {
        // 做穿透兼容
        onFulfilled = typeof onFulfilled === 'function'?onFulfilled : (val) => val
        onRejected = typeof onRejected === 'function'?onRejected : (err) => { throw err}
        let thenPromise = new MyPromise((resolve, reject) => {
            const resultPromise = (cb) => {
                setTimeout(() => { 
                    const x = cb(this.promiseResult)
                    if (x === MyPromise) {
                        throw new Error('死循环')
                    }
                    if (x instanceof MyPromise) {
                        x.then(resolve, reject)
                    } else {
                        resolve(x)
                    }
                })
            }
            if (this.promiseStatus === 'fulfilled') {
                resultPromise(onFulfilled)
            } else if (this.promiseStatus === 'rejected') {
                resultPromise(onRejected)
            } else if (this.promiseStatus === 'pending') {
                this.onFulfilledCallback.push(resultPromise.bind(this, onFulfilled)) 
                this.onRejectedCallback.push(resultPromise.bind(this, onRejected))
            }

        })
        return thenPromise
    }
}

// 测试
new MyPromise((resolve, reject) => {
    resolve(2)
}).then().then().then().then().then().then().then((res) => {
    console.log('res:',res) // res: 2
})
```
#### 8. 异常捕获
```js
class MyPromise {
    constructor(executor) {
        this.initValue()
        this.initBind()
        // 异常捕获
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    initValue() {
        this.promiseStatus = 'pending'
        this.promiseResult = null
        this.onFulfilledCallback = []
        this.onRejectedCallback = []
    }

    initBind() {
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    resolve(res) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'fulfilled'
            this.promiseResult = res
            while (this.onFulfilledCallback.length) {
                this.onFulfilledCallback.shift()(this.promiseResult)
            }
        }

    }

    reject(err) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'rejected'
            this.promiseResult = err
            while (this.onRejectedCallback.length) {
                this.onRejectedCallback.shift()(this.promiseResult)
            }
        }
    }

    then(onFulfilled, onRejected) {
        // 做穿透兼容
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val
        onRejected = typeof onRejected === 'function' ? onRejected : (err) => { throw err }
        let thenPromise = new MyPromise((resolve, reject) => {
            const resultPromise = (cb) => {
                setTimeout(() => {
                    try {
                        const x = cb(this.promiseResult)
                        if (x === MyPromise) {
                            throw new Error('死循环') // 抛出给外层catch接收
                        }
                        if (x instanceof MyPromise) {
                            x.then(resolve, reject)
                        } else {
                            resolve(x)
                        }
                    } catch (e) {
                        this.reject(e)
                        throw new Error(e) // 抛出给下一个then接收
                    }
                })
            }
            if (this.promiseStatus === 'fulfilled') {
                resultPromise(onFulfilled)
            } else if (this.promiseStatus === 'rejected') {
                resultPromise(onRejected)
            } else if (this.promiseStatus === 'pending') {
                this.onFulfilledCallback.push(resultPromise.bind(this, onFulfilled))
                this.onRejectedCallback.push(resultPromise.bind(this, onRejected))
            }

        })
        return thenPromise
    }
}
```


### 其他方法
1. all()
2. rate()
3. allSettled()
4. any()

#### 1. all()
> - 接受一个Promise数组，数组中如有非Promise项，那么此项当成功
> - 如果所有Promise都成功，就返回成功的数组
> - 有一个Promise失败，就返回那个失败的结果

```js
class MyPromise {
    constructor(executor) {...}
    initValue() {...}
    initBind() {...}
    resolve(res) {...}
    reject(err) {...}
    then(onFulfilled, onRejected) {...}

    // all
    static all(promises) {
        let result = [] // 结果数组
        let count = 0 // 计数
        return new MyPromise((resolve, reject) => {
            const addData = (index, value) => {
                result[index] = value
                count++
                if (count === promises.length) resolve(result)
            }
            promises.forEach((promise, index) => {
                if (promise instanceof MyPromise) {
                    promise.then((res) => {
                        addData(index, res)
                    }, err => reject(err))
                } else {
                    addData(index, promise)
                }
            })
        })
    }
}

// 测试
const p1 = 1
const p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(2)
    },500)
})
const p3 = new MyPromise((resolve, reject) => {
    resolve(3)
})

MyPromise.all([p1,p2,p3]).then(val => {
    console.log(val) // [1,2,3]
})
```

#### 2. rate()
> - 接收一个Promise数组，如果非Promise，则当这项为成功
> - 哪个最快返回，就返回哪个结果
```js
class MyPromise {
    constructor(executor) {...}
    initValue() {...}
    initBind() {...}
    resolve(res) {...}
    reject(err) {...}
    then(onFulfilled, onRejected) {...}

    // rate
    static rate(promises) {
        return new MyPromise((resolve,reject) => {
            promises.forEach((promise,index) => {
                if(promise instanceof MyPromise){
                    promise.then((res) => {
                        resolve(res)
                    },(err) => reject(err))
                }else{
                    resolve(promise)
                }
            })
        })
    }
}

// 测试
const p1 = 1
const p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(2)
    },500)
})
const p3 = new MyPromise((resolve, reject) => {
    resolve(3)
})

MyPromise.rate([p2,p3,p1]).then(val => {
    console.log(val) // 1
})

MyPromise.rate([p2,p3]).then(val => {
    console.log(val) // 3
})
```

#### 3. allSettled()
> - 接收一个Promise数组，如果非Promise，则当这项为成功
> - 把每个Promise的结果，集合成数组后返回
```js
class MyPromise {
    constructor(executor) {...}
    initValue() {...}
    initBind() {...}
    resolve(res) {...}
    reject(err) {...}
    then(onFulfilled, onRejected) {...}

    // allSelect
    static allSelect(promises){
        return new MyPromise((resolve,reject) => {
            const result = []
            let count = 0
            const addData = (status,value,index) => {
                result[index] = {status,value}
                count++
                if(count === promises.length) resolve(result)
            }
            promises.forEach((promise,index) =>{
                if(promise instanceof MyPromise){
                    promise.then((res) => {
                        addData('fulfilled',res,index)
                    },err => {
                         addData('rejected',err,index)
                    })
                }else{
                    addData('fulfilled',promise,index)
                }
            })
        })
    }
}

// 测试
const p1 = 1
const p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject(2)
    },500)
})
const p3 = new MyPromise((resolve, reject) => {
    resolve(3)
})

MyPromise.allSelect([p1,p2,p3]).then(val => {
    console.log(val)
    /**[
     * {status:'fulfilled',value:1}
     * {status:'rejected',value:2}
     * {status:'fulfilled',value:3}
     * ]
     */
})
```
#### 4.any
> - 接收一个Promise数组，数组中如有⾮Promise项，则此项当做成功；
> - 如果有⼀个Promise成功，则返回这个成功结果
> - 如果所有Promise都失败，则报错；
```js
class MyPromise {
    constructor(executor) {...}
    initValue() {...}
    initBind() {...}
    resolve(res) {...}
    reject(err) {...}
    then(onFulfilled, onRejected) {...}

    // any
    static any(promises){
        return new Promise((resolve,reject) => {
            let count = 0
            promises.forEach((promise) => {
                promise.then((res) => {
                    resolve(res)
                },err => {
                    count++
                    if(count === promises.length){
                        reject('报错')
                    }
                })
            })
        })
    }
}
// 测试
const p2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject(2)
    },500)
})
const p3 = new MyPromise((resolve, reject) => {
    resolve(3)
})

MyPromise.any([p2,p3]).then(val => {
    console.log(val) // 3
})

// -------------------------------------------------------------

const p4 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject(2)
    },500)
})
const p5 = new MyPromise((resolve, reject) => {
    reject(1)
})

MyPromise.any([p4,p5]).then(val => {
    console.log(val) // 报错
})
```


## 总结
```js
class MyPromise {
    constructor(executor) {
        this.initValue()
        this.initBind()
        // 异常捕获
        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    initValue() {
        this.promiseStatus = 'pending'
        this.promiseResult = null
        this.onFulfilledCallback = []
        this.onRejectedCallback = []
    }

    initBind() {
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }

    resolve(res) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'fulfilled'
            this.promiseResult = res
            while (this.onFulfilledCallback.length) {
                this.onFulfilledCallback.shift()(this.promiseResult)
            }
        }

    }

    reject(err) {
        if (this.promiseStatus === 'pending') {
            this.promiseStatus = 'rejected'
            this.promiseResult = err
            while (this.onRejectedCallback.length) {
                this.onRejectedCallback.shift()(this.promiseResult)
            }
        }
    }

    then(onFulfilled, onRejected) {
        // 做穿透兼容
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val
        onRejected = typeof onRejected === 'function' ? onRejected : (err) => { throw err }
        let thenPromise = new MyPromise((resolve, reject) => {
            const resultPromise = (cb) => {
                setTimeout(() => {
                    try {
                        const x = cb(this.promiseResult)
                        if (x === MyPromise) {
                            throw new Error('死循环') // 抛出给外层catch接收
                        }
                        if (x instanceof MyPromise) {
                            x.then(resolve, reject)
                        } else {
                            resolve(x)
                        }
                    } catch (e) {
                        this.reject(e)
                        throw new Error(e) // 抛出给下一个then接收
                    }
                })
            }
            if (this.promiseStatus === 'fulfilled') {
                resultPromise(onFulfilled)
            } else if (this.promiseStatus === 'rejected') {
                resultPromise(onRejected)
            } else if (this.promiseStatus === 'pending') {
                this.onFulfilledCallback.push(resultPromise.bind(this, onFulfilled))
                this.onRejectedCallback.push(resultPromise.bind(this, onRejected))
            }

        })
        return thenPromise
    }

    // all
    static all(promises) {
        let result = [] // 结果数组
        let count = 0 // 计数
        return new MyPromise((resolve, reject) => {
            const addData = (index, value) => {
                result[index] = value
                count++
                if (count === promises.length) resolve(result)
            }
            promises.forEach((promise, index) => {
                if (promise instanceof MyPromise) {
                    promise.then((res) => {
                        addData(index, res)
                    }, err => reject(err))
                } else {
                    addData(index, promise)
                }
            })
        })
    }

    // rate
    static rate(promises) {
        return new MyPromise((resolve,reject) => {
            promises.forEach((promise,index) => {
                if(promise instanceof MyPromise){
                    promise.then((res) => {
                        resolve(res)
                    },(err) => reject(err))
                }else{
                    resolve(promise)
                }
            })
        })
    }

    // allSelect
    static allSelect(promises){
        return new MyPromise((resolve,reject) => {
            const result = []
            let count = 0
            const addData = (status,value,index) => {
                result[index] = {status,value}
                count++
                if(count === promises.length) resolve(result)
            }
            promises.forEach((promise,index) =>{
                if(promise instanceof MyPromise){
                    promise.then((res) => {
                        addData('fulfilled',res,index)
                    },err => {
                         addData('rejected',err,index)
                    })
                }else{
                    addData('fulfilled',promise,index)
                }
            })
        })
    }

    // any
    static any(promises){
        return new Promise((resolve,reject) => {
            let count = 0
            promises.forEach((promise) => {
                promise.then((res) => {
                    resolve(res)
                },err => {
                    count++
                    if(count === promises.length){
                        reject('报错')
                    }
                })
            })
        })
    }
}
```