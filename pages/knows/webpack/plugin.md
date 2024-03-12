## plugin插件

> plugin赋予了各种功能，如打包优化、资源管理、环境变量等等，他们会运行在webpack的不同阶段（钩子/生命周期），目的就是解决loader无法实现的事情，plugin贯穿整个webpack编译

[图片](../../../public/webpack3.png)


### 配置方式
一般通过配置文件导出对象中的plugins属性传入new实例对象
```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    ...
    plugin:[
        new webpack.ProgressPlugin()
        new HtmlWebpackPlugin({template: "./src/index.html"})
    ]
}
```

### 特征
- 本质: 具有apply方法的js对象

apply方法会被webpack compiler调用，并且整个编译生命周期都可以访问compiler对象
```js
const pluginName = 'ConsoleLogOnBuildWebpackPlugin'

class ConsoleLogOnBuildWebpackPlugin {
    apply(compiler){
        compiler.hooks.run.tap(pluginName,(compilation) => {
            console.log('webpack 构建过程开始')
        })
    }
}

module.exports = ConsoleLogOnBuildWebpackPlugin
```
compiler hook的tap方法的第一个参数，整个编译生命周期钩子
1. entry-option: 初始化option
2. run
3. compile：真正的编译，在创建compilation对象之前
4. compilation：生成好了compilation对象之前
5. make 从entry开始递归分析依赖，准备对每个模块进行build
6. after-compile：编译build过程结束
7. emit: 将内存中assets内容写到磁盘文件夹之前
8. after-emit:将内容中assets内容写在磁盘文件夹之后
9. done: 完成所有的编译过程
10. failed: 编译失败的时候


### 常见的plugin
- AggressiveSplittingPlugin: 将原来得chunk分成更小的chunk
- BabelMinifyWebpackPlugin：使用babel-minify进行压缩
- BannerPlugin：在每个生成得chunk顶部添加banner
- CommonsChunkPlugin：提取chunks之间共享的通用模块
- CompressionWebpackPlugin：预先准备的资源压缩版本，使用Content-Encoding提供访问服务
- ContextReplacementPlugin：重写require表达式的推断上下文
- CopyWebpackPlugin:将单个文件或整个目录复制到构建目录
- DefinePlugin：允许在编译时（compile time）配置全局常量
- DllPlugin：为了极大减少构建时间，进行分离打包
- ...
- HotModuleReplacementPlugin：启用模块热替换（Enable Hot Module Replacement - HMR）
- HtmlWebpackPlugin：简单创建HTML文件，用于服务器访问


### HtmlWebpackPlugin
打包结束后，自动生成一个html文件，并把打包生成的js模块引入到该 html 中
```js
npm install --save-dev html-webpack-plugin

const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
    ...
    plugins:[
        new HtmlWebpackPlugin({
            title:"my_app",
            filename:"app.html",
            template:"./src/html/index.html"
        })
    ]
}
```

### clean-webpack-plugin
删除构建目录
```js
npm install --save-dev clean-webpack-plugin

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    ...
    plugins:[
        ...,
        new CleanWebpackPlugin()
    ]
}
```

### mini-css-extract-plugin
提取CSS到一个单独的文件中
```js
npm install --save-dev mini-css-extract-plugin

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    modules:{
        rules:[
        {
            test:/\.s[ac]ss$/,
            use:[
                {loader: MiniCssExtractPlugin.loader},
                'css-loader',
                'sass-loader'
            ]
        }
        ]
    },
    plugins:[
        ...,
        new MiniCssExtractPlugin({
            filename:'[name].css'
        }),
        ...
    ]
}
```

### DefinePlugin
允许在编译时创建配置的全局对象，是一个webpack内置的插件，不需要安装

```js
const { DefinePlugin } = require('webpack')

module.exports = {
    ...plugins:[
        new DefinePlugin({
            BASE_URL:'"./"'
        })
    ]
}

编译template模块，就能获取全局对象
<link rel="icon" href="<%= BASE_URL%>favicon.ico>"
```

### copy-webpack-plugin
复制文件或目录到执行区域，如vue打包过程，将一些文件放到public的目录下，这些目录会被复制到dist文件夹中

```js
npm install copy-webpack-plugin

new CopyWebpackPlugin({
    parrerns:[
        {
            from: 'public',
            globOptions:{
                ignore:['**/index.html']
            }
        }
    ]
})
```
- from:设置从哪个源开始复制
- to:复制到的位置，可以省略，会默认复制到打包的目录上
- globOptions:设置一些额外的选项，编写需要忽略的文件
