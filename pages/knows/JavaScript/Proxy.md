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

###  Proxy 支持的拦截操作
#### get(target,propKey,receiver):
拦截对象属性的读取，比如proxy.foo和proxy['foo']
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

#### set(target,propKey,value,receiver)
拦截对象属性的设置，比如proxy.foo = v 或proxy['foo'] = v, 返回一个布尔值

#### has(target, propKey)
拦截propKey in proxy的操作，返回一个布尔值

#### deleteProperty（target，propKey）
拦截delete proxy[propKey]的操作，返回一个布尔值

#### ownKeys(target)
拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、
Object.keys(proxy)、for...in循环，返回一个数组，该方法返回目标对象所有自身的属性的属性名。
Object.keys()的返回结果仅包括目标对象自身的可遍历属性

#### getOwnPropertyDescriptor(target, propKey)
拦截Object.getOwnPropertyDescriptor，返回属性的描述对象

#### defineProperty(target, propKey, propDesc)
拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)返回一个布尔值

#### preventExtensions(target)
拦截Object这个属性，返回一个布尔值

#### getPrototypeOf(target)
拦截Object这个属性，返回一个对象

#### isExtensible(target)
拦截Object这个属性，返回一个布尔值

#### setPrototypeOf(target, proto)
拦截Object这个属性，返回一个布尔值

#### apply(target, object, args)
拦截Proxy实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)

#### construct(target, args)
拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...arg)



