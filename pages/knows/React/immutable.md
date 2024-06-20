## immutable
> immutable 不可改变，在计算机中，即一旦创建，就不能再被更改的数据, 对Immutable对象的任何修改或者添加删除操作都会返回一个新的Immutable对象


- Immutable实现的原理是Persistent Data Structure（持久化数据结构）
- 1. 这是一种数据结构来保存数据
- 2. 当数据被修改时，会返回一个对象，但是新的对象会尽可能地利用之前的数据结构而不会对内存造成浪费

使用旧数据创建新数据时，要保证旧数据同时可用且不变，同时为了避免deepCopy把所有节点都复制一遍带来的性能损耗，Immutable使用了Structural Sharing(结构共享)


### 使用
使用immutable对象最主要的库时immutable.js,这是一个完全独立的库，无论基于什么框架都可以用它。

> 其出现场景在于弥补JS没有不可变数据结构的问题，通过structual sharing来解决的性能问题，内部提供一套完整的Persistent Data Structure,还有很多易用的数据类型，


- Collection
- List（有序索引值，JS中的Array）
- Map（无序索引值，JS中Object）
- Set（没有重复值的集合）
- Record
- Seq
- fromJS(): 将一个JS数据转换为Immutable类型的数据，const obj=Immutable.fromJS({a:'1',b:'2'})
- toJS(): 将一个Immutable数据转换为JS类型数据
- is(): 对两个对象进行比较
```js
import { Map, is } from 'immutable'
const map1 = Map({ a: 1, b: 1, c: 1 })
const map2 = Map({ a: 1, b: 1, c: 1 })
map1 === map2 //false
Object.is(map1, map2) // false
is(map1, map2) // true
```
- get(key): 对数据或对象取值
- getIn([]): 对嵌套对象或数组取值，传参为数组，表示位置

### 在React中的应用
使用Immutable可以给React应用带来性能的优化，主要体现在减少的渲染的次数
在react性能优化当中，我们使用shouldComponentUpdate()中做对比，当返回true执行render方法。
这时候可以通过is方法完成对比
