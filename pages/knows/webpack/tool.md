## 其他打包工具

> 模块化工具，是处理复杂系统分解为更好的可管理模块的方式，用来分隔、组织、打包应用，每个模块都完成一个特定的子功能，所有模块都按某种方法组装起来，成为一个整体（bundle）


> Rollup、Parcel、snowpack、vite

### 1.Rollup
Rollup是一款ESModules打包器,特点：小巧
示例： Vue、React、three.js 都是使用Rollup进行打包

```js
// ./src/message.js
export default{
    hi:'hey, my name is sue'
}

// ./src/logger.js
export const log = msg => {
    console.log('---------------------log------------------')
    console.log(msg)
    console.log('__________________________________________')
}

export const error = msg => {
    console.log('-------------------error------------------')
    console.log(msg)
    console.log('__________________________________________')
}


// ./src/index.js
import {log} from './logger'
import message from './message'

log(message.hi)
```
- 通过rollup打包
```js
npx rollup ./src/index.js --file ./dist/bundle.js


const log = msg => {
    console.log('---------------------log------------------')
    console.log(msg)
    console.log('__________________________________________')
}

var message = {
    hi:'hey, my name is sue'
}

// 导入模块成员
// 使用模块成员
log(message.hi)
```
特点：
1. 默认Tree-shaking优化输出结果
2. 代码效率会更简洁、更高效
3. 加载其他类型的资源文件或者支持导入CommonJS模块，或又编译ES新特性，都需要使用其他插件去完成

总结：Rollup并不适合开发应用使用，因为需要第三方模块，目前第三方模块大多使用CommonJS方式导出，而rollup不支持HMR，开发效率降低。在打包JS库时，rollup比webpack更有优势，因为打包出来的代码更小、更快

---
### 2.Parcel
Parcel，是零配置的前端打包器，构建速度会比Webpack快，输出文件也会被压缩，样式代码会被单独提取到一个文件中

```js
npx parcel src/index.html
```
特点:
1. 不仅打包应用，同时启动一个开发服务器
2. 支持模块热替换
3. 自动安装依赖，零配置加载其他类型的资源文件
---

### 3.Snowpack
Snowpack,是一种闪电快速的前端构建工具，开发阶段，每保存单文件时，Webpack和Parcel都需要重新构建和打包整个bundle。而Snowpack为应用程序每个文件构建一次，就永久缓存，文件更新时，Snowpack会重新构建单文件

特点
1. 应用程序每个文件构建一次，就永久缓存，文件更新时，Snowpack会重新构建单文件
2. 重新构建变更时，没有任何时间浪费，只需要在浏览器中进行HMR更新

---
### 4.Vite
vite，新型前端构建工具，显著提升前端开发体验

由两部分组成
1. 一个开发服务器，基于原生ES模块提供丰富得内建功能，如:速度快到惊人的[模块热更新HMR]
2. 一套构建指令，使用Rollup打包你的代码，是预配置的，输出用于生产环境的优化过的静态资源

作用类似于 webpack + webpack-dev-server

特点:
1. 快速的冷启动
2. 即时的模块热更新
3. 真正的按需编译

vite会直接启动开发服务器，不需要进行打包操作，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快

利用现代浏览器支持ES Module的特性，当浏览器请求某个模块的时候，再根据需要对模块的内容进行编译，这种方式大大缩短了编译时间

[图片](../../../public/webpack4.png)

---
### webpack
webpack 两大核心特点： 一切皆模块和按需加载

优势
1. 智能解析: 对commonJS、AMD、ES6的语法做了兼容
2. 万物模块：对JS、css、图片等资源文件都支持打包
3. 开箱即用：HRM、Tree-shaking等功能
4. 代码分割：可以将代码切割成不同的chunk，实现按需加载、降低初始化时间
5. 插件系统：具有强大的Plugin接口，具备更好的灵活性和扩展性
6. 易于调试：支持SourceUrls和SourceMaps
7. 快速运行：webpack使用异步IO并具有多级缓存，这使得webpack在增量编译上更加快
8. 生态环境好：社区丰富，出现问题更容易解决