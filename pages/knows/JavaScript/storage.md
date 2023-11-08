## 存储方式

1. cookie
2. sessionStorage
3. localStorage
4. indexedDB

### cookie
Cookie，类型为【小型文本文件】，指某些网站为了辨别用户身份而存储在用户本地终端上的数据，是为了解决HTTP无状态导致的问题

- 一般不超过4KB，由名称(name)、指(value)和一些用于控制cookie有效期、安全性、适用范围的可选属性组成
- cookie每次请求都会被携带，不使用Https对其加密，保存的信息就很容易被窃取，导致安全风险

1. Expires用于设置Cookie的过期时间
2. Max-Age用于设置在Cookie失效之前需要经过的秒数(优先级比Expires高)
3. Domain指定了Cookie可以送达的主机名
4. Path指定一个URL路径，这个路径必须出现在要请求的资源的路径中才可以发送Cookie首部
5. 标记为Secure的Cookie只应通过被Https协议加密过的请求发送给服务端

- 使用方式
```js
document.cookie = '名字=值'
```
> 修改时，需要确定domain和path属性都是相同的，其中有一个不同的时候就会创造新的cookie

```js
Set-Cookie:name = aa; domain=aa.net;path=/  #服务端设置
document.cookie = name=bb; domain=aa.net; path=/ #客户端设置
```

> 删除cookie，就是给cookie设置一个过期时间，过期就会被浏览器删除掉

### localStorage
- 特点
1. 生命周期：持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的
2. 存储的信息在同一个域下是共享的
3. 当本页操作(新增、修改、删除)了localStorage的时候，本页面不会触发storage事件，但是别的页面会触发storage事件
4. 大小： 5M
5. localStorage本质上是对字符串的读取，如果存储内容多的话会消耗内存空间，导致页面变卡顿
6. 受同源策略限制

>  如果两个URL的协议、域名、端口号都相同，就称这两个URL同源

- 缺点
1. 没有Cookie一样设置过期时间
2. 只能存入字符串，无法直接存对象  

- 使用方式
1. 设置
   ```js
   localStorage.setItem('username','sue')
   ```
2. 获取
   ```js
   localStorage.getItem('username')  // 'sue'
   ```
3. 获取键名
   ```js
   localStorage.key(0)  // 'sue'
   ```
4. 删除
   ```js
   localStorage.removeItem('username')
   ```
5. 一次性清除所有存储
    ```js
   localStorage.clear('username')
   ```


### sessionStorage
seseionStorage和localStorage使用方法一致，唯一不同的是生命周期，一旦页面关闭，sessionStorage将会删除数据

### indexedDB
indexedDB是一种低级API，用于客户端存储大量的结构性文件，使用索引来实现对该数据的高性能搜索

- 优点
1. 存储量理论上没有上限
2. 所有操作都是异步，相比LocalStorage，同步操作性能更高，尤其是数据量较大的时候
3. 原生支持存储JS对象
4. 是正经数据库，能做数据库能做的事情

- 缺点
1. 操作非常繁琐
2. 本身有门槛


### 三者区别
cookies、sessionStorage、localStorage三者区别如下

| 定义           | 存储数据大小 | 传递方式           | 数据有效期                           | 作用域                                       |
| -------------- | ------------ | ------------------ | ------------------------------------ | -------------------------------------------- |
| cookies        | 4KB          | 同源http自动携带   | 可以设置过期时间                     | 所有同源窗口中都是共享的                     |
| sessionStorage | 5MB          | 不会携带，本地存储 | 仅当当前浏览器窗口关闭               | 在所有同源窗口中都是共享的                   |
| localStorage   | 5MB          | 不会携带，本地存储 | 始终有效，窗口或浏览器关闭也一直保存 | 不在不同的浏览器窗口中共享，即使是同一个页面 |


### 使用场景
- 标记用户与跟踪用户行为的情况，推荐使用cookie
- 适合长期保存在本地的数据（令牌），推荐使用localStorage
- 敏感账号一次性登录，推荐使用sessionStorage
- 存储大量数据的情况, 在线文档（富文本编辑器）保存编辑历史的情况，推荐使用indexedDB