## webpack优化

- 优化loader配置
- 合理使用resolve.extensions
- 优化resolve.modules
- 优化resolve.alias
- 使用 DLLPlugin 插件
- 使用 cache-loader
- terser启动多线程
- 合理使用sourceMap

### 1.优化loader配置
在使用loader，可以配置include、exclude、test属性来匹配文件，接触include、exclude、test属性来匹配文件，接触include、exclude规定哪些匹配应用loader

```js
module.exports = {
    module:{
        rules:[
            {
                test: /\.js$/, // 如果项目源码只有js文件就不要写成 /\.jsx?$/,从而提高正则表达式性能
                use:['babel-loader?cacheDirectory'],//babel-loader支持缓存转换出的结果，通过cacheDirectory选项开启
                include:path.resolve(__dirname,'src')//只对项目根目录下的src目录中的文件采用babel-loader
            }
        ]
    }
}
```

### 2.合理使用resolve.extensions
resolve 可以帮助 webpack 从每一个require/import语句中，找到需要引入到合适的模块代码，通过resolve.extensions是解析到文件时自动添加扩展名

```js
module.exports = {
    ...
    extensions:[".warm",".mjs",".js",".json"]
}
```
当我们引入文件时，若没有文件后缀名，则会根据数组内的值依次查找
当我们配置的时候，则不要随便把所有后缀都写在里面，这会调用多次文件的查找，则会减慢打包速度

### 3.优化resolve.modules
resolve.modules用于配置webpack去哪些目录下寻找第三方模块，默认值为['node_modules'],所以默认会从node_modules中查找文件
当安装的第三方模块都会放在项目根目录下 ./node_modules 目录下的，可以指明存放第三方模块的绝对路径，以减少寻找，配置如下
```js
module.exports = {
    resolve:{
        // 使用绝对路径指明第三方模块的存放位置，以减少搜索步骤
        // 其中 __dirname 表示当前工作目录，也就是项目根目录
        modules:[path.resolve(__dirname,'node_modules')]
    }
}
```

### 4.优化resolve.alias
alias给一些常用的路径起一个别名，当我们项目目录结构比较深的时候，就很麻烦 ../../
```js
module.exports = {
    ...
    resolve:{
        alias:{
            "@":path.resolve(__dirname,'@/src')
        }
    }
}
```

### 5.使用DDLPlugin插件
DLL全称 动态链接库，是软件在window中实现共享函数库的一种实现方式，而webpack也内置了DLL功能，为的就是可以共享，不经常改变的代码，抽成一个共享的库。在这个库之后的编译过程中，会被引入到其他项目代码中
- 打包一个DLL库
- 引入DLL库

1. 打包一个DLL库
webpack内置一个DLLPlugin可以帮助我们打包一个DLL的库文件
```js
module.exports = {
    ...
    plugins:[
        new webpack.DllPlugin({
            name:'dll_[name]',
            path:path.resolve(__dirname,"./dll/[name].mainfest.json")
        })
    ]
}
```
2. 引入DLL库
使用webpack自带的DllReferencePlugin插件对mainfest.json映射文件进行分析，获取要使用的DLL库
然后通过AddAssetHtmlPlugin插件，将我们打包的DLL库引入到Html模块中
```js
module.exports = {
    ...
    new webpack.DllReferencePlugin({
        context: path.resolve(__dirname,"./dll/dll_react.js")
        mainfest: path.resolve(__dirname,"./dll/react.mainfest.json")
    }),
    new AddAssetHtmlPlugin({
        outputPath:"./auto",
        filepath: path.resolve(__dirname,"./dll/dll_react.js")
    })
}
```

### 6.使用cache-loader
在性能开销较大 loader 之前添加cache-loader，以结果缓存到磁盘中，显著提升二次建构速度
保存和读取这些缓存文件会有一些时间开销，所以只对性能开销较大loader

```js
module.exports = {
    module:{
        rules:[{
            test:/\.ext$/,
            use:['cache-loader',...loaders],
            include: path.resolve('src')
        }]
    }
}
```

### 7.terser启动多线程
使用多线程并运行来提高构建速度
```js
module.exports={
    optimization:{
        minimizer:[
            new TerserPlugin({
                parallel: true
            })
        ]
    }
}
```

### 8.合理使用sourceMap
打包生成sourceMap的时候，信息越详细，打包的越慢

devtool - none：构建速度和重新构建速度都非常快速，存在生产环境，打包后的代码
devtool - eval: 构建速度和重新构建速度都非常快速，不存在生产环境，生成后的代码
devtool - source-map：构建速度和重新构建速度都慢，存在生产环境，原始源代码

---
## 优化前端的方式
- JS代码压缩
- CSS代码压缩
- Html文件代码压缩
- 文件大小压缩
- 图片压缩
- Tree Shaking
- 代码分离
- 内联chunk

### 1.JS代码压缩
terser是一个JS的解释、绞肉机、压缩机的工具集，可以帮助我们压缩、丑化代码，让bundle更小
在production模式下，webpack默认就是使用 TerserPlugin 来处理我们的代码

```js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
    ...
    optimization:{
        minimize: true,
        minimizer:[
            new TerserPlugin({
                parallel: true // 电脑cpu核数-1
            })
        ]
    }
}
```
- extractComments: 默认值为true，表示会将注释抽取到一个单独的文件中，开发阶段，我们可以设置为false，不保留注释
- parallel: 使用多进程并发运行提高构建速度，默认值为true，并发运行的默认数量：os.cpus().length - 1
- terserOptions：设置我们的terser相关的配置
- compress：设置压缩相关的选项
- mangle：设置丑化相关，可直接设置为true
- toplevel：底层遍历是否进行转换
- keep_classnames: 保留类的名称
- keep_fnames:保留函数的名称

### 2.CSS代码压缩
CSS压缩可以使用另外一个插件：css-minimizer-webpack-plugin

```js
npm install css-minimizer-webpack-plugin -D

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
module.exports = {
    ...
    optimization:{
        minimize:true,
        minimizer: [
            new CssMinimizerPlugin({
                parallel: true
            })
        ]
    }
}
```

### 3.Html文件代码压缩
使用HtmlWebpackPlugin插件来生成HTML模板，通过配置属性minify进行html优化
```js
module.exports = {
    ...
    plugin:[
        new HtmlWebpackPlugin({
            ...
            minify:{
                minifyCSS:false, // 是否压缩css
                collapseWhitespace: false, // 是否折叠空格
                removeComments: true // 是否移除注释
            }
        })
    ]
}
```
设置minify，实际上会使用另外一个插件 html-minifier-terser

### 4.文件大小压缩
对文件大小进行压缩，减少http传输过程中宽带的损耗

```js
npm install compression-webpack-plugin -D

new ComepressionPlugin({
    test:/\.(css|js)$/, //哪些文件需要压缩
    threshold: 500,// 设置文件多大开始压缩
    minRatio:0.7,// 至少压缩的比例
    algorithm:"gzip"// 采用的压缩算法
})
```

### 5.图片压缩

```js
module:{
    rules:[
        {
            test:/\.(png|jpg|gif)$/,
            use:[
                {
                    loader:'file-loader',
                    options:{
                        name:'[name]_[hash].[ext]',
                        outputPath:'images/'
                    }
                },{
                    loader:'image-webpack-loader',
                    options:{
                        // 压缩jpeg的配置
                        mozjpeg:{
                            progressive:true,
                            quality: 65
                        },
                        // 使用imagemin-optipng压缩png，enable:false为关闭
                        optipng:{
                            enabled: false
                        }
                        // 使用imagemin-pngquant 压缩 png
                        pngquant:{
                            quality:'65-90',
                            speed:4
                        }
                        // 压缩git配置
                        gifsicle:{
                            interlaced:false
                        },
                        // 开启webp，会把jpg和png图片压缩为webp格式
                        webp:{
                            quality: 75
                        }
                    }
                }
            ]
        }
    ]
}
```

### 6.Tree Shaking
Tree Shaking是术语，在计算机中代表消除死代码，依赖ES Module的静态语法分析（不执行任何的代码，明确知道模块的依赖关系）
在webpack实现Tree Shaking有两种方案
1. usedExports: 通过标记某些函数是否被使用，之后通过Terser来进行优化
2. sideEffects: 跳过整个模块、文件，直接查看该文件是否有副作用

1. usedExports
```js
module.exports= {
    ...
    optimization:{
        usedExports: true
    }
}
```
使用之后，没被用上的代码在webpack打包中会加入 unused harmony export mul注释，用来告知Terser在优化时，可以删除这段代码
2. sideEffects
sideEffects用于告知 webpack compiler哪些模块有副作用，配置方式是在 package.json中设置sideEffects属性
如果 sideEffects 设置false，就是告知webpack可以安全的删除未用到的exports，需要保留文件，就会设置为数组的形式

```js
"sideEffects":[
    "./src/util/format.js",
    "*.css" // 所有css文件
]
```

3. css tree shaking
css 进行 tree shaking  优化可以安装 PurgeCss 插件
```js
npm install purgecss-plugin-webpack -D

const PurgeCssPlugin = require('purgecss-webpack-plugin')
module.exports = {
    ...
    plugin:[
        new PurgeCssPlugin({
            path: glob.sync(`${path.resolve('./src')}/**/*`),{nodir:true}
            satelist: function(){
                return{
                    standard:['html']
                }
            }
        })
    ]
}
```
paths: 表示要检测哪些目录下的内容需要被分析，配合使用glob
默认情况下，Purgecss会将我们的html标签移除掉，如果我们希望保留，可以添加一个safelist的属性


### 7.代码分离
将代码分离到不同的bundle中，我们可以按需加载，或者并行加载这些文件
默认情况下，所有JS代码(业务代码、第三方依赖、暂时没用到的模块)在首页全部都加载，就会影响首页的加载速度

代码分离可以分出更小的bundle，以及控制资源加载优先级，提高代码的加载性能
通过splitChunksPlugin来实现，该插件webpack默认安装和集成，只需要配置即可默认配置，chunks仅仅针对异步请求，可以设置为initial或者all

```js
module.exports = {
    ...
    optimization:{
        splitChunks:{
            chunks:"all"
        }
    }
}
```
- chunks: 对同步代码 或异步代码的处理
- minSize：拆分包的大小，至少为minSize，如果这个包的大小不超过minSize，这个包不会拆分
- maxSize：将大于maxSize的包，拆分为不小于minSize的包
- minChunks：被引入的次数，默认是1

### 8.内联chunk
可以通过 InlineChunkHtmlPlugin 插件将一些chunk的模块内联到html，如runtime的代码(对模块进行解析、加载、模块信息相关的代码)
```js
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    ...
    plugin:[
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin,[/runtime.+\.js/])
    ]
}
```