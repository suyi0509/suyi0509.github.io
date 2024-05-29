## React Refs

> Refs在计算机中称为 弹性文件系统 （Resilient File System）,
> React 中的Refs提供一种方式，允许访问DOM节点或者render方法中创建的React元素,
> 本质上 **ReactDOM.render()** 返回的组件实例，如果是渲染组件则返回的是组件实例，如果渲染dom则返回具体的dom节点


### 使用方式
- 1. 传入字符串，使用时通过this.refs传入字符串的格式获取对应的元素
- 2. 传入对象，对象是通过React.createRef()方式创建出来，使用时获取到创建对象中存在current属性就是对应的元素
- 3. 传入函数，该函数会在DOM被挂载时进行回调，这个函数会传入一个元素对象，可以自己保存，使用时，直接拿到之前保存的元素对象即可
- 4. 传入hook,hook是通过useRef()方式创建，使用时通过生成hook对象的current属性就是对应的元素