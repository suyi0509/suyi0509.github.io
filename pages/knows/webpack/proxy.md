## proxy工作原理

> **webpack proxy**,即webpack提供的代理服务

基本行为就是接收客户端发送的请求后转发给其他服务器
其目的就是为了开发者在开发模式下的解决跨域问题(浏览器安全策略限制)
实现代理首先需要一个中间服务器，webpack中提供服务器的工具为webpack-dev-server

### 1.webpack-dev-server
webpack-dev-server是自动编译和自动刷新浏览器等一系列对开发友好的功能全部集成在一起

目的： 为了提高开发者日常的开发效率，只用于开发阶段

```js
// webpack.config.js
const path = require('path')

module.exports = {
    // ...
    devServer:{
        contentBase: path.join(__dirname,'dist'),
        compress: true,
        port: 9000,
        proxy: {
            '/api':{
                target: 'https://api.github.com'
            }
        }
    }
}
```
devServer的配置是对象形式，对象中每一个属性就是一个代理的规则匹配
- target：表示的是代理的目标地址
- pathRewrite：默认情况下，我们/api-hy也会被写入URL中，希望删除，可以使用pathRewrite
- secure：默认情况下不接收转发到https的服务器上，如果希望支持，可以设置为false
- changeOrigin：表示是否更新代理后请求的 header 中host地址


### 2. 工作原理
原理：利用**http-proxy-middleware**，这个http代理中间件，实现请求转发给其他服务器

```js
const express = require('express')
const proxy = require('http-proxy-middleware')

const app = express()
app.use('/api',proxy({target: 'http://www.xxx.org', changeOrigin: true}))
app.listen(3000)
```
> 开发阶段，本地地址为**http://localhost:3000**，该浏览器发送一个前缀带有 /api 标识的请求到服务端获取数据，但响应这个请求的服务器只是将请求转发到另一台服务器中


### 跨域
在开发阶段，**webpack-dev-server**会启动一个本地开发服务器，所以我们的应用是在开发阶段是独立运行在localhost的一个端口，后端服务又是运行在另外一个地址上

所以开发阶段，由于浏览器的同源策略，本地访问就会出现跨域的请求问题

通过设置webpack proxy实现代理请求后，相当于浏览器与服务端中添加一个代理者。当本地发送请求的时候，代理服务器应该请求，并将请求转发到目标服务器，目标服务器响应数据后，再将数据返回给代理服务器，最终代理服务器将数据响应给本地。 

- 在代理服务器传递数据传递给本地浏览器得过程中，两者同源，并不存在跨域行为，这时浏览器就能正常接受数据。 因为服务器和服务器之间请求数据并不会出现跨域情况，跨域行为是浏览器安全策略限制