## module
### 含义
1. 能够**单独命名**并**独立的完成一定功能**的**程序语句的集合**(即程序代码和数据结构得集合体)

### 特征(外部特征和内部特征)
1. 外部特征：指模块跟**外部环境联系的接口**(即其他模块或程序调用该模块的方式，包括有输入输出参数
   引用的全局变量)
2. 内部特征：指模块**内部环境具有功能**（即模块的局部数据和程序代码）

### 模块化优点
1. 代码抽象
2. 代码封装
3. 代码复用
4. 依赖管理
  
可以把代码进行抽象和封装，实现代码的复用。更方便做依赖管理

### JavaScript程序中模块化的机制
1. CommonJs(node.js早期,用于服务器) - require
2. AMD(require.js，用于浏览器)
3. CMD(sea.js)

> es6模块的设计思想是尽量静态化，在编译时就能确定模块的依赖关系，以及输出和输入的变量
> 而CommonJS、AMD都是运行时才确定

#### CommonJs
```js
// CommonJS模块 - 导出
module.exports={ foo , bar}
// CommonJS模块 - 导入
let { stat, exists, readfile } = require('fs');

// 过程
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
// 1.先加载_fs
// 2.再分别读取3个方法
// 这种就是运行时加载，没有办法再编译的时候做 静态优化
```
##### 特点
  1. 所有代码都在模块作用域，不会污染全局作用域
  2. 模块是同步加载，只有加载完成，才会执行后续操作
  3. 模块第一次执行后，存在缓存，再次加载只返回缓存结果，再次执行才会清除缓存
  4. require返回的值是被输出得值得拷贝，模板内部变化也不会影响该值



#### AMD(Asynchronous ModuleDefinition)
- 定义
> 异步模块定义，采用异步方式加载模块，所以依赖模块的语句，都定义在一个回调函数中，等到模块加载完成之后，这个回调函数才会运行
```js
require.config({  // config()指定模块路径和引用名
   baseUrl: "js/lib",
   paths: {
      "jquery": "jquery.min", // js/lib/jquery.min.js
      "underscore": "underscore.min",
   }
});
// 执行时
require(["jquery","underscore"],function($,_){
...
});

```

#### ES6模块
ES6是通过export命令显式指定输出代码，再通过import命令输入， 这称为**编译时加载**或者静态加载
- export：用于规定模块的对外接口
- import：用于输入其他模块提供的功能
```js
// fs
export {stat, exists, readFile}
// ES6模块
import { stat, exists, readFile } from 'fs';

// 实质是从fs模块加载 3 个方法，其他方法不加载
// 这种加载称为“编译时加载”或者静态加载
```

##### 复合写法
```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

##### 使用场景
1. 按需加载
```js
button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});
```

2. 条件加载
```js
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}
```

3. 动态的模块路径
```js
import(f()) // 函数f的返回结果，加载不同的模块。
.then(...);
```

### Module加载实现
#### 通过`<script>` 标签加载 JavaScript 脚本
引入type="application/javascript"
```js
<script type="application/javascript" src="path/to/myModule.js"></script> // 同步加载
<script src="path/to/myModule.js" defer></script> // defer 异步加载
<script src="path/to/myModule.js" async></script> // async 异步加载
```
- 同步加载
  要等执行完脚本，再往下渲染，如果脚本体积很大，会造成浏览器拥堵，体验感差

- defer异步加载（**渲染完再执行**）
  - 一遍下载，一边执行后面命令，但要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行
  - 所以，多个defer脚本，是会按顺序加载


- async异步加载(**下载完就执行**)
  - 一遍下载，一边执行后面命令，一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染
   - 所以，多个async脚本，不能保证加载顺序

#### 通过`<script>` 标签加载  ES6 模块
引入type="module", 带有type="module" 默认为 defer异步加载
```js
<script type="module" src="./foo.js"></script>
```

### ES6模块和CommonJS模块的差异
- CommonJS 模块输出的是一个值的拷贝， ES6 模块输出的是值的引用
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段



