## 事件代理
> 概念：把一个元素响应事件的函数委托到另外一个元素，事件委托就是在冒泡阶段完成的。
> 事件委托会把一个或一组元素的事件委托到它的父层或更外层的元素上，真正绑定事件的时外层元素，而不是目标元素
> 当事件在目标元素上响应时，会通过事件冒泡机制从而触发它的外层元素的绑定事件，然后再外层元素上去执行函数

- 示例
```js
<ul>
    <li>1</li>
    <li>2</li>
    ......
    <li>n</li>
</ul>

// 如果给每一个列表项都绑定一个函数，对内存消耗时非常大的
// 这时候就需要进行事件委托，把事件点击绑定到ul上面，再去匹配目标元素

document.getElementById('list').addEventListener('click',function(e) => {
    var event = e || window.event
    var target = event.target || event.srcElement
    // 判断是否匹配目标元素
    if(target.nodeName.toLocaleLowerCase === 'li'){
        console.log('the content is:', target.innerHTML)
    }
})

```

使用事件委托的两个优点
1.减少整个页面所需的内存，提升整体性能
2.动态绑定，减少重复工作

- 局限性
1. focus、blur事件没有冒泡
2. mousemove、mouseout需要不断的通过位置计算定位，对性能消耗高