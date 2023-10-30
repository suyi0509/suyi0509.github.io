## BOM
BOM(Browser Object Model), 浏览器对象模型， 提供了独立于内容与浏览器窗口进行交互的对象，其作用就是跟浏览器做一些交互效果，比如如果进行页面的后退、前进、刷新、浏览器窗口发生变化，获取用户的一些信息：浏览器分辨率

-浏览器显示的内容可以看成DOM，整个浏览器就是BOM


|  | 模型 | 顶级对象 | 学习 | 规范 | 
| --- | --- | --- | --- | --- | 
| DOM | 文档对象模型 | document | 操作页面元素 | W3C标准 | 
| BOM | 浏览器对象模型 | window | 浏览器窗口交互 | 各厂家各自定义，兼容性差 |


### 核心window
BOM的核心是window，表示浏览器的一个实例

在浏览器中，window对象有双重角色，即浏览器窗口的一个接口，又是一个全局对象，因此所有在全局作用域中声明的变量、函数都会变成window对象的属性和方法

```js
const name = 'suyi'
function getName() {
    alert(this.name)
}

console.log(window.name); //suyi
getName(); //suyi
window.getName(); //suyi
```

一些窗口控制方法
- moveBy(x,y) // 整体移动x，y
- moveTo(x,y) // 距离左上角x,y
- scrollTo(x,y) // 相对窗口
- scrollBy(x,y) // 滚动条在左移x，下移y

window.open // 打开一个新的浏览器窗口
如果传第二个参数，该参数是也有窗口的名称，就会在目标窗口加载第一个参数指定的URL
```js
window.open('https://xxx','getUrl')
<a href='' target="getUrl"></a>
```
window.close() 仅用于通过window.open()打开的窗口
在新创建的window对象中有一个opener属性，该属性指向打开他的原始窗口对象


### location
url地址
```js
http://www.baidu.com:8080/s?wd=js#contents
```
| 属性名 | 例子 | 说明 | 
| --- | --- | --- |
| hash | #contents | url中#后端的字符，没有则返回空串 | 
| host | www.baidu.com:8080 | 服务器名称：端口号 | 
| hostname | www.baidu.com | 服务器名称 | 
| href |http://www.baidu.com:8080/s?wd=js#contents | 完整url | 
| pathname | /s/ | 服务器下面的文件路径 | 
| port | 8080 | 端口号，没有则为空 | 
| protocol | http: | 使用的协议 | 
| search | ?wd=js | url的查询字符串，通常为?后面的内容，中文会进行编码转换 | 

除了hash外,只要修改location的一个属性，就会导致页面重新刷新新的URL

- location.reload()可以重新刷新当前页面，如果页面上次请求以来就没改变过，页面就会从浏览器缓存中重新加载，如果要强制从服务器中重新加载，传递一个参数true即可


### navigator

navigator对象主要是用来获取浏览器的属性，区分浏览器类型，属性较多且兼容性比较复杂

### screen
存储客户端能力信息，就是浏览器窗口外的客户端显示器的信息，比如像素宽度和像素高度

### history
history对象主要用来操作浏览器URL的历史记录，可以通过参数向前，向后，或者向指定URL跳转

- history.go()
接收一个整数数字或者字符串参数：向最近的一个记录中包含指定字符串的页面跳转

当参数是整数数组时，整数代表向前跳转指定的页面，负数为向后跳转指定的页面
```js
history.go(3) // 向前跳转三个记录
history.go(-1) // 向后跳转一个记录
```

history.forward()  // 向前跳转一个页面 
history.back() // 向后跳转一个页面
history.length // 获取历史记录数