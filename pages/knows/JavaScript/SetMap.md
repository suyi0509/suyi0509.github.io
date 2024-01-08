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

--- 

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
const map = new Map()
map.set('name', 'sue')
map.set('age', 18)

map.size // 2
map.get('name') // 'sue'
map.has('age') // true
map.delete('age')
map.has('age') // false
map.clear()
map.size // 0
``` 
### Map实例遍历方法
1. keys(): 返回键名的遍历器
2. values(): 返回键值的遍历器
3. entries(): 返回键值对
4. forEach(): 遍历每个对象

---

## WeakSet
> 1. 成员只能是引用类型
> 2. 没有遍历操作的API、没有size属性
> 3. 可以接受一个具有 Iterable 接口的对象作为参数
> 4. 里面的引用只要在外部消失，它在WeakSet里面的引用就会自动消失
### 使用方式
```js
const a = [[1,2],[3,4]]
const ws = new WeakSet(a) 
// WeakSet {[1,2],[3,4]}

// 成员不能是其他类型
let weakSet = new WeakSet([2,3])
console.log(weakSet) // 报错
```
---

## WeakMap
> 1. 用于生成键值对的集合
> 2. 没有遍历操作的API，没有clear清空方法
> 3. 只接受对象作为键名(null除外)，不接受其他的值作为键名
> 4. 键名指向的对象，一旦不再需要，里面的键名对象和对于的键值对会自动消失
> 5. WeakMap弱引用只是键名，而不是键值，键值依旧正常引用

### 使用方式
```js
const wm = new WeakMap(a)
const key = {foo:1};
wm.set(key,2)
wm.get(key) // 2

const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // "bar"
```

#### 自动清除例子
> 在网页的dom元素添加数据，使用WeakMap结构，当Dom元素被清除，其所对应的WeakMap记录就会被自动移除
```js
const wm = new WeakMap();
const element = document.getElementById('example');
wm.set(element, 'some information');
wm.get(element) // "some information"
```

#### 键名弱引用，而不是键值
> 键值obj会在 WeakMap 产生新的引用，修改obj不会影响内部的值
```js
const wm = new WeakMap();
let key = {}
let obj = {foo: 1};

wm.set(key,obj);
obj = null;
wm.get(key)
// Object { foo: 1}
```
