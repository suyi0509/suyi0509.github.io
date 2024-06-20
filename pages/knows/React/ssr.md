## ssr
> ssr：Server-Side Rendering，服务端渲染；就是由服务端完成页面的HTML结构拼接的页面处理技术，发烧到浏览器，然后绑定其状态和事件，成为完全可交互页面的过程

问题的关键点主要在
1. seo, 搜索引擎爬虫抓取工具，可以抓取到该页面
2. 加速首屏加载，解决首屏白屏问题

### SSR两种方式
- 手动搭建一个SSR框架
- 使用成熟的SSR框架，如Next.JS

### 手动搭建一个SSR框架
1. step1：通过express启动一个app.js文件，用于监听3000端口请求，当请求根目录时，返回HTML
```jsx
const express = require('express')
const app = express()
app.get('/',(req,res) => res.send(
    `<html>
        <head>
            <title>ssr demo</title>
        </head>
        <body>
            Hello world
        </body>
    </html>`
    ))
app.listen(3000,()=>console.log('listening on port 3000'))
```

2. step2: 在服务器中编写react代码，在app.js中进行引用
```jsx
import React from 'react'

const Home = () => {
    return <div>home</div>
}
export default Home
```

3. step3: 为了让服务器去识别JSX， 需要使用webpack对项目进行打包转换，创建一个配置文件webpack.server.js
```jsx
const path = require('path') // node的path模块
const nodeExternals = require('webpack-node-externals')

module.exports = {
    target:'node',
    mode:'development', // 开发模式
    entry:'./app.js', // 入口
    output:{
        filename:'bundle.js', // 打包后的文件名
        path: path.resolve(__dirname,'build'), // 存放在根目录的build文件夹
    },
    externals:[nodeExternals()],// 保持node中的require的引用方式
    module:{
        rules:[{
            test: /\.js?$/, // 打包规则，js文件
            loader: 'babel-loader', // 使用babel-loader进行打包
            exclude: /node_modules/, // 不打包node_modules中的js文件
            options:{
                presets: ['react','stage-0',['env',{
                    targets:{
                        browsers:['last 2versions']
                    }
                }]]
            }
        }]
    }
}
```

4. step4: 借助react-dom提供了服务端渲染的renderToString方法，负责把React组件解析成html
```jsx
import express from 'express'
import React from 'react' // 引用React支持JSX语法
import { renderToString } from 'react-dom/server' // 引入renderToString方法
import Home from './home'

const app = express()
const content = renderToString(<Home/>)
app.get('/',(req, res) => res.send(
    `<html>
        <head>
            <title>ssr demo</title>
        </head>
        <body>
            ${content}
        </body>
    </html>`
))

app.listen(3001, () => console.log('Example listening on port 3001'))
```
这时就能将组件渲染到页面上面了
---

> 同构: 一些事件处理是无法在服务器完成的，因此需要将组件代码在浏览器中再执行一遍，这种服务器端和客服端共用一套代码的方式称为————同构（简单来说就是一套React代码在服务器上运行一遍，浏览器上又运行一遍）

- 服务端渲染完成页面结构
- 浏览器端渲染完成事件绑定

5. step5：浏览器实现事件绑定
让浏览器去拉取JS文件执行，让JS代码来控制，因此引入script标签，通过script标签为页面引入客户端执行的react代码，通过express的static中间件为js文件配置路由

```jsx
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import Home from './home'

const app = express()
app.use(express.static('public'))// 通过express的static中间件为js文件配置路由
const content = renderToString(<Home/>)

app.get('/',(req, res) => res.send(
    `<html>
        <head>
            <title>ssr demo</title>
        </head>
        <body>
            ${content}
        </body>
    </html>`
))

app.listen(3001, () => console.log('Example listening on port 3001'))
```
6. step6：配置webpage.client.js作为客户端React代码的webpack配置文件
```jsx
const path = require('path') 
module.exports = {
    mode: 'development', 
    entry: './src/client/index.js', 
    output: { 
        filename: 'index.js', 
        path: path.resolve(__dirname, 'public') 
    },
    module: {
        rules: [{ 
            test: /\.js?$/, 
            loader: 'babel-loader', 
            exclude: /node_modules/, 
            options: {
                presets: ['react', 'stage-0', ['env', {
                    targets: {
                        browsers: ['last 2versions'] //
                    }
                }]]
            }
        }]
    }
}
```

---
## 总结
1. 服务器运行React代码生成html
2. 发送HTML给浏览器
3. 浏览器接到内容显示
4. 浏览器加载JS文件
5. JS代码执行并接管页面的操作

---
初始化渲染
```js
// Routers.js
import React from 'react' // React JSX
import { Route } from 'react-router-dom' //
import Home from './containers/Home' // Home
export default (
 <div>
    <Route path="/" exact component={Home}></Route>
 </div>
)

// index.js
import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Router from '../Routers'
const App = () => {
    return (
        <BrowserRouter>
            {Router}
        </BrowserRouter>
    )
}
ReactDom.hydrate(<App />, document.getElementById('root'))

// 问题：在每个Route组件外面包裹着一层div，但服务端返回的代码并没有div
// 解决方法：只需把路由信息在服务端执行一遍，使用StaticRouter来替代BrowserRouter，通过context进行参数传递

import express from 'express'
import React from 'react'// React JSX
import { renderToString } from 'react-dom/server'// renderToString
import { StaticRouter } from 'react-router-dom'
import Router from '../Routers'
const app = express()
app.use(express.static('public'));
app.get('/', (req, res) => {
    const content = renderToString((
        <StaticRouter location={req.path} context={{}}>
            {Router}
        </StaticRouter>
    ))
    res.send(`
    <html>
        <head>
            <title>ssr demo</title>
        </head>
        <body>
            <div id="root">${content}</div>
            <script src="/index.js"></script>
        </body>
    </html>
    `)
})
app.listen(3001, () => console.log('Exampleapp listening on port 3001!'))
```
这样就完成了一个路由的服务端渲染
---

## 原理
node server接收客户端请求，得到当前的请求url路径，然后在已有的路由表中查找到对应的组件，
拿到需要请求的数据，将数据作为props、context或者store传入组件。基于react内置的服务端渲染方法renderToString()把组件渲染为html字符串在把最终的html进行输出前需要将数据注入到浏览器端。


浏览器开始进行渲染和节点对比，然后执行完成组件内事件绑定和一些交互，浏览器重用了服务端输出的html节点，整个流程结束