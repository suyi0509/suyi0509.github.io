## 热更新

> HMR(Hot Module Replacement)， 模块热更新，指：应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个应用

使用hmr，就可以只将修改的模块实时替换至应用中，不必完全刷新整个应用

```js
const webpack = require('webpack')
module.exports = {
    devServer:{
        hot: true
    }
}
```

hmr并不是开箱即用，需要有些额外的操作
```js
if(module.hot){
    module.hot.accept('./utils.js',() => {
        console.log("更新utils.js")
    })
}
```

1. 实现原理
[图片](../../../public/webpack1.png)

- Webpack Compile：将JS源码编译成bundle.js
- HMR Server：用于将热更新的文件输出给HMR Runtime
- Bundle Server：静态资源文件服务器，提供文件访问路径
- HMR Runtime：socket服务器，会被注入到浏览器，更新文件的变化
- bundle.js： 构建输出的文件

> 在HMR Runtime 和 HMR Server 之间建立 websocket（4线）用于实时更新文件变化

实现原理可分为两个阶段
1. **启动阶段**
在启动阶段，**线1-2-A-B**，在编写未经过webpack打包的源代码后，**webpack Compile**将源代码和**HMR Runtime**一起编译成bundle文件，传输给**Bundle Server**静态资源服务器

2. **更新阶段**
在更新阶段，**线1-2-3-4**, 当某个文件或者模块发生变化时，webpack监听到文件变化对文件重新编译打包，编译生成唯一的hash值，这个hash值用来作为下次热更新的标识。

根据变化的内容生成两个补丁文件：manifest（包含hash和chundId，用来说明变化的内容）和chunk.js模块

由于socket服务器在**HMR Runtime**和**HMR Server**之间建立websocket链接，当文件改动时，服务端会向浏览器推送一条消息，消息包含文件改动后生成得hash值，如下图的h属性，作为下一次热更新的标识

--- 
1. 浏览器接受这条消息之前，浏览器已经在上一次socket消息中记住了此时的**hash标识**，这时候会创建一个ajax去服务端请求**获取到变化内容的mainfest文件**

2. mainfest文件包含重新build生成的hash值，以及变化的模块，浏览器根据获取的模块变化的内容，从而触发render流程，实现局部模块更新


---

## 总结
- 通过**webpack-dev-server**创建两个服务器：提供静态资源的服务（express）和Socket服务
- express server负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
- socket server 是一个websocket的长连接，双方可以互通信
- 当socket server 监听到对应模块发生变化时，会生成两个文件.json（manifest文件）和 .js文件（update chunk）
- 通过长连接，socket server 可以直接将这两个文件主动发送给客户端（浏览器）
- 浏览器拿到两个新的文件后，通过HMR runtime机制，加载这两个文件，并且针对修改的模块进行更新