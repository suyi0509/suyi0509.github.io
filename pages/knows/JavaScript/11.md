## DOM
 DOM叫文档对象模型，是HTML和XML文档编程得接口。DOM节点包含着其他类型得节点，例如：div、 p就是元素节点，里面得content就是文本节点，classname、title就是属性节点

### 节点操作
- 创建节点
- 查询节点
- 更新节点
- 添加节点
- 删除节点


#### 创建节点
1.createElement
创建新元素，接受一个参数（要创建元素的标签名）
```js
const divEL = document.createElement("div")
```

2.createTextNode
创建一个文本节点
```js
const textEl = document.createTextNode("context")
```

3.createDocumentFragment
创建文档碎片，是一种轻量级文档，主要用来存储临时节点，把文档碎片的内容一次性添加到DOM中
```js
const fragment = document.createDocumentFragment()
```
当请求把一个DocumentFragment节点插入文档树，插入的不是DocumentFragment自身,而是它所有的子孙节点


4.createAttribute
创建属性节点，可以是自定义属性
```js
const dataAttribute = document.createAttribute("custom")
```


#### 获取节点
1.querySelector
传入任何有效的css选择器，就可选中单个DOM元素（首个）
```js
document.querySelect('.element') //类选择器
document.querySelect('#element') //id选择器
document.querySelect('div') // 节点选择器
```

2.querySelectorAll
返回所有节点子树内与之匹配的element节点列表，返回时一个NodeList静态实例，它是静态的"快照"，并非是实时查询

```js
document.querySelectorAll(p)
```

3.获取节点还有很多种方式
```js
document.getElementById('id')
document.getElementsByClassName('classname')
document.getElementsTagName('Tag')
document.getElementsByName('name')
document.all[''] // 所有的
```

### 更新节点
1.innerHtml
不但可以修改一个DOM节点的文本内容，还能通过HTML片段修改DOM节点内部的子树
```js
const p = document.getElementById('p')
p.innerHtml = 'ABC' // <p id="p">ABC</p >
p.innerHtml = 'ABC <span style="color:red">RED</span> XXX';
// <p id="p">ABC <span style="color:red">RED</span> XXX</p >
```

2.innerText、textContent
会自动对字符串进行HTML编码，保证无法设置任何HTML标签

```js
const p = document.getElementById('p')
p.innerText = 'ABC' // <p id="p">ABC</p >
p.innerText = '<span>RED</span>';
// <p id="p"> &lt;span&gt;RED&lt;span&gt; </p >
```
innerText、textContent的区别在于读取属性时，innerText不返回隐藏元素的文本，而textContent会返回所有文本


3.style
```js
const p = document.getElementById('p')
p.style.color = '#ff0000'
```

### 添加节点
1.innerHtml
上面说得，修改Dom节点的内容，相当于添加了新的Dom节点

2.appendChild
把一个子节点添加到父节点的最后一个子节点
```js
<!-- HTML -->
<p id="js"></p >
<div id="list">
 <p id="java">Java</p >
 <p id="python">Python</p >
</div>
```
添加一个p元素
```js
const js = document.getElementById('js')
js.innerHTML = "JavaScript"
const list = document.getElementById('list');
list.appendChild(js);
```

```js
<!-- HTML -->
<div id="list">
 <p id="java">Java</p >
 <p id="python">Python</p >
 <p id="js">JavaScript</p >
</div>
```
我们是获取dom元素之后再进行添加操作，js节点已经存在当前的文档树中了，因此这个节点会先从原本的位置删除、再插入新的位置上

3.insertBefore
在子节点插入到指定的位置
```js
parentElement.insertBefore(newElement,referenceElement)
// 子节点会插到referenceElement之前
```

4.setAttribute
在指定元素中添加一个属性节点，如果元素中已有该属性改变属性值
```js
const div = document.getElementById('id')
div.setAttribute('class','white') // 第一个是参数属性名   第二个是参数属性值
```

### 删除节点
要删除一个节点，需要获取到该节点的父节点，然后调用父节点的removeChild移除该子节点
```js
// 需要删除的节点
const child = document.getElementById('child_to_move')
// 获取该节点的父节点
const parent = child.parentElement
// 调用父节点的removeChild
const removed = parent.removeChild(child)
removed === child // true 抛出该删除节点
```