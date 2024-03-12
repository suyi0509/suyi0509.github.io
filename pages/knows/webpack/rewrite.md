## 编写loader和plugin

> loader,文件加载器，能够加载资源文件，并对文件进行一些处理，如编译、压缩等，最后一起打包到指定的文件中


> plugin,插件，赋予了webpack各种灵活的功能，如打包优化、资源管理、环境变量注入。目的是解决loader无法实现的其他事


### 区别
1. loader运行在打包文件之前
2. plugins在整个编译周期都起作用

webpack运行的生命周期会广播很多事件，Plugin可以监听这些事情，在合适的时机通过webpack提供的API改变输出的结果

loder实质上是一个转换器，将A文件进行编译形成B文件，操作的是文件，如将A.scss或A.less转变成B.css，单纯就是文件转换的过程

---

### 编写loader
本质上就是函数，函数中的this作为上下文会被webpack填充，所以我们不能将loader设为箭头函数

函数接收一个参数，为webpack传递给loader的文件源内容
函数中的this是由webpack提供的对象，能够获取当前的loader所需要的各种信息
函数中有异步操作或同步操作，异步通过 this.callback返回，返回值要求为 string 或者 Buffer

```js
// 导出一个函数，source为webpack传递给loader的文件源内容
module.exports = function(source){
    const content = doSomeThing2JsString(source)
    // 如果loader配置options对象，那么this.query将指向options
    const options = this.query;

    // 可以解析其他模块路径的上下文
    this.callback(null,content)

    /**
     * this.callback参数
     * error：Error | null，当loader出错向外抛出一个error
     * content：String | Buffer，经过loader编译后需要导出得内容
     * sourceMap：为方便调试生成的编译后内容的source map
     * ast：编译生成的AST静态语法树，之后执行的loader可以直接使用这个AST
     */
    this.callback(null,content); //异步
    return content // 异步
}
```
一般编写loader功能会保持单一，避免做多功能
如less->css 是通过less-loader、css-loader、style-loader几个loader得链式转换

### 编写plugin
webpack是发布订阅者模式，在运行得生命周期中会广播许多事件，插件能监听到这些事情，就可以在特定得阶段执行自己得插件任务

- 核心1：compiler:包含了webpack环境得所有配置信息，包括options、loader和plugin和webpack整个生命周期相关得钩子
- 核心2：compilation：作为plugin内置事件回调函数的参数，包含当前的模块资源、编译生成资源、变化的文件以及被跟踪依赖的状态信息，当检测到一个文件变化，一次新的Compilation将被创建

- 实现规范1：插件必须是一个函数或者是一个包含apply方法的对象，这样才能访问compiler实例
- 实现规范2：传给每个插件的compiler和compilation对象都是同一个引用，因此不建议修改
- 实现规范3：异步的事件需要在插件处理完任务时调用回调函数通知webpack进入下一个流程，不然会卡住

```js
class MyPlugin{
    // webpack会调用MyPlugin实例的apply方法给插件实例传入 compiler 对象
    apply(compiler){
        // 找到合适的事件钩子,实现自己的插件功能
        compiler.hooks.emit.tap('MyPlugin',compilation) => {
            // compilation: 当前打包构建流程的上下文
            console.log(compilation)
        }
    }
}
```
在emit事件发生时，代表源文件的转换和组装已经完成，已经读取到最终将输出的资源、代码块、模块及依赖，并且修改输出资源的内容