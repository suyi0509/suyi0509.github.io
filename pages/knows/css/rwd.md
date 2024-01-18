## 响应式设计（Responsive Web design）
> 响应式设计是网络页面设计布局的一种，页面的设计和开发能按照用户行为以及设备环境进行对应的响应和调整

### 特点
1. 同时适配PC + 平板 + 手机
2. 标签导航在接近手机终端设备时改变为经典的抽屉式导航
3. 网站的布局会根据视口来调整模块的大小和位置

### 实现方式
响应式设计的基本原理是 通过媒体查询检测不同的设备屏幕尺寸做处理，为了处理移动端，页面头部必须meta声明viewport

```js
<meta name="viewport" content="width=device-width,initial-scale=1,maximum
-scale=1,user-scalable=no">
```
- width=device-width: 自适应手机屏幕的尺寸宽度
- initial-scale=1：是缩放的初始值
- maximun-scale：是缩放比例的最大值
- user-scalable：是用户可以缩放的操作

### 实现响应式布局的方式
1. 媒体查询
2. 百分比
3. vw/vh
4. rem

#### 媒体查询
CSS3新增了媒体查询，就像使用if语句一样，满足条件，就会调用对应得样式表

使用@Media查询，针对不同得媒体类型定义不同得样式
```css
@media screen (min-width: 375px) and (max-width: 600px) {
 body {
 font-size: 18px;
 }
}
```
通过媒体查询，可以设置多个不同得样式，来实现响应式布局

#### 百分比
通过百分比单位 "%" 来实现响应式得效果

当浏览器高度和宽度发生变化时，通过百分比可以使得其变化，从而实现响应式的效果

但是一些top/bottom/left/right/padding/margin基本是依赖父元素，如果每个属性都使用百分比，会造成布局的复杂度，所以不建议

#### vw/vh
vw表示相对于视图窗口的宽度，vh表示相对于视图窗口高度，任意层级元素，在使用vw单位情况下，1vw等于视图宽度的百分之一， 与百分比布局相似

#### rem/em
rem是相对根元素HTML,em是相对于父组件的。默认情况浏览器字体为16px，这时1rem = 16px

> 相对长度单位： em、ex、ch、rem、vw、vh、vmin、vmax、%

> 绝对长度单位：cm、mm、in、px、pt、pc 

#### 利用element-ui、antd提供得栅格布局实现响应式


## 总结
- 优点
  1. 面对不同分辨率设备灵活性强
  2. 快捷解决多设备显示适应问题
- 缺点
  1. 仅使用布局、信息、框架并不复杂的部门类型网站
  2. 兼容各种设备工作量大、效率低下
  3. 代码累赘，可能会有隐藏无用的元素，加载时间加长
  4. 折中性质，多因素可能达不到最佳效果
  5. 在一定程度上，改变网站原有网站布局，出现混淆的情况


--- 
Q1： 如果让系统支持小于12px字体
1. zoom = 变焦
   - zoom：50% | 0.5, 缩小到原来的一半
2. -webkit-transform：scale() = 缩放
3. -webkit-text-size-adjust：none = 只对英文和数字生效