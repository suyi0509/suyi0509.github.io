## Set
> Set 是集合的数据结构，[值，值]的形式存储
> - 集合：一堆**无序的**且**不重复**的内存结构的组合 

### 使用方式
```js
const s = new Set() //值是唯一的不用的
```
### Set实例方法
1. add() 
2. delete()
3. has()
4. clear
```js
s.add(1).add(2).add(2); // 不会重复添加，2只被添加一次
s.delete(1)// 返回布尔值，表示删除是否成功
s.has(1) // 判断该值是否存在Set集合中
s.clear() // 清除所有成功，没有返回值
``` 
### Set实例遍历方法
1. keys(): 返回键名的遍历器
2. values(): 返回键值的遍历器
3. entries(): 返回键值对
4. forEach(): 遍历每个对象

## Map
> Map 是字典的数据结构，[键，值]的形式存储
> - 一些元素的集合，每个元素都有一个 key 的域，不同元素的 key 各不相同
### 使用方式
```js
const s = new Map() 
```
### Map实例属性和方法
1. size属性 
2. set()
3. get()
4. has()
5. delete()
6. clear()
```js
s.add(1).add(2).add(2); // 不会重复添加，2只被添加一次
s.delete(1)// 返回布尔值，表示删除是否成功
s.has(1) // 判断该值是否存在Set集合中
s.clear() // 清除所有成功，没有返回值
``` 
### Set实例遍历方法
1. keys(): 返回键名的遍历器
2. values(): 返回键值的遍历器
3. entries(): 返回键值对
4. forEach(): 遍历每个对象


### Set实例方法

## WeakSet
## WeakMap