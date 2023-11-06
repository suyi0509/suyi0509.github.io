## 事件模型
由于Dom是一个树结构，如果在父子节点绑定事件，当触发子节点得时候，就存在一个顺序问题，这就涉及到一个事件流的概念
> 事件流概念：都会经过三个阶段,1.事件捕获阶段、2.处于目标阶段、3.事件冒泡阶段
事件捕获（从上往下）、 事件冒泡（从下往上）

事件模型分成三种：
1.原始事件模型
2.标准事件模型
3.IE事件模型（基本不用）

### 1.原始事件模型
事件绑定监听函数
1.Html中直接绑定
```js
<input type="button" onclick="fun()">
```
2.通过JS代码绑定
```js
var btn = document.getElementById('.btn');
btn.onclick = fun
```
- 特性
1. 绑定速度快
2. 只支持冒泡、不支持捕获
3. 同一类型得事件只能绑定一次，后绑定会覆盖前绑定

### 2.标准事件模型
- 事件捕获阶段：事件从document一直向下传播
- 事件处理阶段：事件到达目标元素，触发目标元素得监听函数
- 事件冒泡阶段：事件从目标元素冒泡到document，依次检查经过的节点是否绑定了事件监听函数

事件绑定监听函数的方式
```
addEventListener(eventType,handler,useCapture)
```
事件移除监听函数的方式
```
removeEventListener(eventType,handler,useCapture)
```
参数如下：
eventType：指定事件类型
handler：事件处理函数
useCapture：是一个boolean用于指定是否在捕获阶段进行处理，一般设置为fasle

- 特性
1. 可以在一个Dom元素上绑定多个事件处理器，各自不会冲突
2. 执行时机，当第三个参数useCapture为true时，就会在捕获过程中执行，反之会在冒泡过程中执行
3. event事件中1.为捕获阶段，2.为事件对象触发阶段，3.冒泡阶段


### 3.IE事件模型
- 事件处理阶段
- 事件冒泡阶段
