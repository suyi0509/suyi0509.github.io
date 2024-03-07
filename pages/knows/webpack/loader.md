## Loader

> loader用于对模块的源代码进行转换，在import或加载模块时预处理文件。

在默认情况下，**webpack**内部中，任意文件都是模块，不仅仅是js。在遇到import或者require加载模块的时候，webpack只支持对js和json文件打包。像css、sass、png等类型的文件，webpack则无能为力，这就需要配置对应的loader进行文件内容的解析


- entry -> loaders -> output

当webpack碰到不识别的模块时，webpack会在配置中查找该文件解析规则

### 配置loader的方式
1. 配置方式：在webpack.config.js中指定 loader
2. 内联方式：在每个import语句中显式指定loader
3. CLI方式：在shell命令中指定它们

#### 配置方式(推荐)
写在**module.rule**属性中，属性介绍如下
1. rules是一个数组的形式，因此我们可以配置很多个loader
2. 每一个loader对应一个对象，对象属性test为匹配的规则，一般情况下为正则表达式
3. 属性use针对匹配到文件类型，调用对应的loader进行处理

```js
module.exports={
    module:{
        rules:[{
            test: /\.css$/,
            use:
            [
                {
                  loader:'style-loader'
                },{
                  loader:'css-loader',
                  options:{
                    modules: true
                  }
                },{
                  loader:'sass-loader'
                }]
        }]
    }
}
```

### 特征
1. loader支持链式调用，链中的每个loader会处理之前已处理过的资源，最终为js代码，顺序是相反执行的，像上述执行顺序：**sass-loader** -> **css-loader** -> **style-loader**
2. loader可以是同步，也可以是异步的
3. loader运行在Nodejs，能够执行任何操作
4. 除了常见的通过package.json的main来将一个npm模块导出loader，还能在module.rules中使用loader字段直接引用一个模块
5. 插件（plugin）可以为loader带来更多特性
6. loader可以产生额外任意文件

通过loader得预处理函数，为js生态系统提供更多能力


### 常见得一些loader
- style-loader：将css添加到DOM的内联样式标签style里
- css-loader：允许将css文件通过require的方式引入，并返回css代码
- less-loader：处理less
- sass-loader：处理sass
- postcss-loader：用postcss来处理css
- autoprefixer-loader：处理css3属性前缀，已被弃用
- file-loader：分发文件到output目录并返回相对路径
- url-loader：和file-loader类似，但是文件小于设定的limit可以返回一个Date Url
- html-minify-loader：压缩HTML
- babel-loader：用babel来转换ES6到ES


### 1.css-loader
```js
npm install --save-dev css-loader

rules:[
    ...,
    {
        test: /\.css$/,
        use:{
            loader:"css-loader",
            options:{
                // 启用、禁用 url() 处理
                url: true,
                // 启用、禁用 import() 处理
                import: true
                // 启用、禁用Sourcemap
                sourceMap:false
            }
        }
    }
]
```
如果只是css-loader加载文件，这时候页面代码设置的样式并没有生效

- css-loader只负责.css文件进行解析，并不会把解析好的css插入到页面中，如果我们希望在完成插入style，则需要添加 style-loader

### style-loader
```js
npm install --save-dev style-loader less-loader

rules:[
    ...,
    {
        test:/\.css$/,
        use:["style-loader","css-loader","less-loader"]
    }
]
// 同一个任务的loader可以挂载多个，处理顺序为：从右到左，从下往上
```

### file-loader
把识别得资源模块，移动到指定的输出目录中，并且返回这个资源在输出目录得地址（字符串）

```js
npm install --save-dev file-loader

rules:[
    ...,
    {
        test:/\.(png|jpe?g|gif)$/,
        use:{
            loader: "file-loader",
            options:{
                // [name]：占位符，代表资源模块名称
                // [ext]：占位符，代表资源模块后缀
                name:"[name]_[hash].[ext]",
                // 打包后的存放位置
                outputPath:"./images",
                // 打包后文件的url
                publicPath:'./images'
            }
        }
    }
]
```

### url-loader
可以处理file-loader的所有东西，但是遇到图片，可以选择性的把图片转成base64格式处理，并打包到js中，对小图片合适，对大图片不合适

```js
npm install --save-dev url-loader

rules:[
    ...,
    {
        test:/\.(png|jpe?g|gif)$/,
        use:{
            loader: "url-loader",
            options:{
                // [name]：占位符，代表资源模块名称
                // [ext]：占位符，代表资源模块后缀
                name:"[name]_[hash].[ext]",
                // 打包后的存放位置
                outputPath:"./images",
                // 打包后文件的url
                publicPath:'./images',
                // 小于100字节转成base64格式
                limit: 100
            }
        }
    }
]
```