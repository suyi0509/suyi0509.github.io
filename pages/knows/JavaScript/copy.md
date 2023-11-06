## 浅拷贝和深拷贝

- 手写浅拷贝
```js
function shallowClone(obj){
    const newObj = {}
    for(let prop in obj){
        if(obj.hasOwnPrototype(prop)){
            newObj[prop] = obj[prop]
        }
    }
    return newObj
}
```
1.Object.assign()
2.Array.prototype.slice()、Array.prototype.concat()
3.[...xxx]


- 手写深拷贝
1. _.cloneDeep()
2. jQuery.extend()
3. JSON.stringify()
4. 手写循环递归
```js
function deepClone(obj, hash = new WeakMap()){
    if(obj === null) return obj; // 如果是null或者undefined不进行拷贝
    if(obj instanceof Date) return new Date(obj)
    if(obj instanceof RegExp) return new RegExp(obj)
    // 可能是对象或者普通得值，  如果是函数就不需要深拷贝
    if(typeof obj !== "object") return obj
    // 是对象就要进行深拷贝
    if(hash.get(obj)) return hash.get(obj)
    let cloneObj = new obj.constructor()
    // 找到得是所属类原型上的constructor，而原型上得constructor指向的是当前类本身
    hash.set(obj,cloneObj)
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            // 实现一个递归拷贝
            cloneObj[key] = deepClone(obj[key],hash)
        }
    }
    return cloneObj
}
```