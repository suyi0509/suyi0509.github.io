## webpack基础知识

> webpack最初目标是实现前端项目的模块化，为了更高效的维护项目。

### 模块化
一、
最初，我们会通过文件划分去实现模块化，就是把每个功能和数据单独放在不同的JS文件中，约定每个文件都是独立的模块，再将其通过 <script></script> 引入到页面中

```js
<script src="module1.js"></script>
<script src="index.css"></script>
```
缺点：模块在全局工作，大量模块成员污染了环境，模块和模块之间没有依赖关系，维护成本比较大，没有私有空间


二、
命名空间方式，规定每个模块只暴露一个全局对象，模块内容都挂载到这个对象当中

```js
window.moduleA = {
    method1:function(){
        console.log('moduleA')
    }
}
```
仍然未解决第一种方式的依赖等问题

三、
使用立即执行函数为模块提供私有空间，通过参数的形式为依赖声明

```js
(function($){
    var name = 'module-a'

    function method1(){
        console.log(name + '#method1')
    }

    window.module = {
        method1: method1
    }
})(jQuery)
```
以上都是早期解决模块的方式，多多少少都存在一些没有解决的问题

理想解决方式：在页面引入js入口文件，其余用到的模块可以通过 按需加载的方法进行。

> 除了模块加载的问题，还规定流行的一些模块化的规范：CommonJS、ES Modules

---
### 本质
> webpack是一个用于现代JS应用的静态模块打包工具

- 静态模块 指开发阶段，可以被webpack直接引用的资源（可以直接被获取打包进bundle.js的资源）

当webpack处理应用程序时，他会在内部构建一个依赖图，此依赖图对应反应映射到项目所需的每个模块（不再局限js文件），并生成一个或多个bundle

### 功能
开发阶段 => 编译 => 生产阶段

1. 编译代码能力: 提高效率，解决浏览器兼容问题
- ES6 =>编译=> ES5

2. 模块整合能力：提高性能，可维护性，解决浏览器频繁请求文件的问题
- ES6 =>打包=> Bundle.js

3. 万物可模块化：项目维护性增强，支持不同的前端模块类型，所有的加载都通过代码控制
- js/css/ts/png =>打包=>Bundle.js/.css/.png

