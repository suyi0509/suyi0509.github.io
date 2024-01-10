## Proxy代理
### 概述
**定义：** 用于修改某些操作的默认行为，等同于在语言层面做出修改。属于"元编程"，即对编程语言进行编程
**介绍：** 在目标对象之前是指一层 **拦截**, 外界访问该对象，都必须经过这次拦截，在这里可以对外界的访问进行过滤和改写

### 使用方式
```js
var proxy = new Proxy(target,handler)  // 生成Proxy实例

// target代理的目标对象
// handler配置对象，拦截对应的操作
```

```js
// 对一个空对象架设了一层拦截，重定义了属性的读取（get）和设置（set）行为
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});
obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
//  2
说明，Proxy重载(overload)了运算符，用自己的定义覆盖了语言的原始定义
```

> 如果一个属性不可配置且不可写，则proxy不能修改该属性，否则报错


### Reflect
在Proxy内部调用对象的默认行为，建议使用Reflect
特点：
1. 只要Proxy对象具有的代理当都，Reflect对象全具有，以静态方法的形式存在
2. 修改某些Object方法的返回结果，让其变得更合理
3. 让Object操作都变成函数行为

###  Proxy 支持的拦截操作
#### 1. get(target,propKey,receiver):
接受三个参数，目标对象、属性名、proxy实例本身。拦截对象属性的读取，比如proxy.foo和proxy['foo']
```js
var person = {
  name: "张三"
};

var proxy = new Proxy(person, {
  get: function(target, propKey) {
    if (propKey in target) { // 对象是否有这个属性
      return target[propKey]; 
    } else {
      throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.");
    }
  }
});

proxy.name // "张三"
proxy.age // 抛出一个错误
```

#### 2.set(target,propKey,value,receiver)
接受4个参数，目标对象、属性名、属性值和Proxy实例本身.
拦截对象属性的设置，比如proxy.foo = v 或proxy['foo'] = v, 返回一个布尔值
> 严格模式下，如果没有返回true，即为报错
```js
let validator = {
  set:function(obj,prop,value){
    if(prop === 'age'){
      if(!Number.isInteger(value)){
         console.log('不是整数') 
      }
      if (value > 200) {
        console.log('值太大了') 
      }
    }
    obj[prop] = value
  }
}
```


#### 3.has(target, propKey)
拦截propKey in proxy的操作，返回一个布尔值

#### 4.deleteProperty（target，propKey）
拦截delete proxy[propKey]的操作，返回一个布尔值

#### 5.ownKeys(target)
拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、
Object.keys(proxy)、for...in循环，返回一个数组，该方法返回目标对象所有自身的属性的属性名。
Object.keys()的返回结果仅包括目标对象自身的可遍历属性

#### 6.getOwnPropertyDescriptor(target, propKey)
拦截Object.getOwnPropertyDescriptor，返回属性的描述对象

#### 7.defineProperty(target, propKey, propDesc)
拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)返回一个布尔值

#### 8.preventExtensions(target)
拦截Object这个属性，返回一个布尔值

#### 9.getPrototypeOf(target)
拦截Object这个属性，返回一个对象

#### 10.isExtensible(target)
拦截Object这个属性，返回一个布尔值

#### 11.setPrototypeOf(target, proto)
拦截Object这个属性，返回一个布尔值

#### 12.apply(target, object, args)
拦截Proxy实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)

#### 13.construct(target, args)
拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...arg)

---

### 取消代理
```js
Proxy.revocable(target,handler)
``` 

### 使用场景
> Proxy 功能类似于 设计模式中的代理模式

#### 功能
1. 拦截和监视外部对对象的访问
2. 降低函数或类的复杂度
3. 在复杂操作前对操作进行校验或对所需资源进行管理

##### 1.使用proxy保障数据类型的准确性
```js
const numberArr = { count：2, value: 12, total: 14}
numberArr = new Proxy(numberArr,{
  set(target,key,value,proxy){
    if(typeof value !== number){
      throw Error("属性只能是number类型")
    }
    return Reflect.set(target,key,value,proxy)
  }
})

numericDataStore.count = "foo"
// Error: 属性只能是number类型
numericDataStore.count = 333  // 成功
```

##### 2. 内部属性，禁止外部访问
```js
let api = {
    _apiKey: '123456',
    name: 'sue'
}

const disableArr = ['_apiKey']
api = new Proxy(api, {
    get(target, key, proxy) {
        if (disableArr.indexOf(key) > -1) {
            throw Error('内部属性不可访问')
        }
        return Reflect.get(target, key, proxy)
    },
    set(target, key, value, proxy) {
        if (disableArr.indexOf(key) > -1) {
            throw Error('内部属性不可访问')
        }
        return Reflect.set(target, key, proxy)
    }
})

console.log(api._apiKey) //  内部属性不可访问
api._apiKey = '666666' // 内部属性不可访问
```

##### Proxy观察者模式
> 观察者模式：函数自动观察数据对象，一旦对象有变化，函数就会自动执行Observable函数返回一个原始对象的Proxy代理，
> 拦截赋值操作，触发充当观察者的各个函数

```js
const queuedObservables = new Set()

const observe = fn => queuedObservables.add(fn)
const observable = obj => new Proxy(obj,{set})

function set(target,key,value,receiver){
  const result = Reflect.set(target,key,value,receiver)
  queuedObservables.forEach(observer => observer())
  return result
}
```
观察者函数都会放到Set集合，当修改obj的值，在会set函数中拦截，自动执行Set所有的观察者



