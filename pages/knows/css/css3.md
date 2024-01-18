## css3新特性
- CSS3新增的选择器
1. 层次选择器(p ~ ul)
2. 伪类选择器
   - :first-of-type = 表示一组同级元素中其类型的第一个元素
   - :last-of-type = 表示一组同级元素中其类型的最后一个元素
   - :only-of-type = 表示没有同类型兄弟元素的元素
   - :only-child = 表示没有任何兄弟的元素
   - :nth-child(n) = 根据元素在一组同级中的位置匹配元素
   - :nth-last-of-type(n) = 匹配给定类型的元素，基于他们在一组兄弟元素中的位置，从末尾开始计数
   - :last-child = 表示一组兄弟元素中的最后一个元素
   - :root = 设置html文档
   - :empty = 指定空的元素
   - :enabled = 选择可用元素
   - :disabled = 选择被禁用元素
   - :checked = 选择选中的元素
   - :not(selector) = 选择与 <selector> 不匹配的所有元素
3. 属性选择器
   - [attribute*=value] = 选择attribute属性值包含value的所有元素
   - [attribute^=value] = 选择attribute属性开头为value的所有元素
   - [attribute$=value] = 选择attribute属性结尾为value的所有元素

---
- CSS3新样式
1. 边框
   - border-radius = 圆形边框
   - box-shadow = 元素添加阴影
   - border-image = 图片绘制边框
2. 背景
   - background-clip = 确定背景画区
   - background-origin = 对齐方式
   - background-size = 调整背景图片大小
   - background-break = 多盒展示
3. 文字
   - word-wrap = 换行
   - text-overflow = 超出显示
   - text-shadow = 文本阴影
   - text-decoration = 文字渲染
   - rgba / hsla = 颜色表达方式
4. 渲染
    - transition = 过渡效果、持续时间
    - transform = 旋转、缩放、倾斜、平移给定的元素
    - animation = 动画
5. 渐变
    - linear-gradient = 线性渐变
    - radial-gradient = 泾向渐变
6. 其他
   - flex弹性布局
   - Grid栅格布局
   - 多列布局
   - 媒体查询
   - 混合模式

---
## Grid栅格布局
---
## flex弹性布局
### 属性
- flex-direction = 决定主轴得排列方向
  1. row： 默认，从左到右
  2. row-reverse：从右到左
  3. column：从上到下
  4. column-reverse：从下到上
- flex-wrap = 是否可换行
  1. nowrap：默认，不换行
  2. wrap：换行，第一行在上方
  3. wrap-reverse：换行，第一行在下方
- flex-flow = flex-direction 和 flex-wrap 简写
- justify-content = 决定主轴得对齐方式
  1. flex-start：默认，左对齐
  2. flex-end：右对齐
  3. center：居中
  4. space-between：两端对齐，项目之间得间隔都相等
  5. space-around：两个项目两侧间隔相等
- align-items = 决定项目在交叉轴上如果对齐
  1. flex-start：交叉轴得起点对齐
  2. flex-end：交叉轴得终点对齐
  3. center：交叉轴的中点对齐
  4. baseline：项目第一行文字的基线对齐
  5. stretch：默认，如果项目未设置高度或auto，将占满整个容器的高度
- align-content = 决定多根轴线的对齐方式，如果项目只有一根轴线，则不生效
  1. flex-start：交叉轴得起点对齐
  2. flex-end：交叉轴得终点对齐
  3. center：交叉轴的中点对齐
  4. space-between：两端对齐，项目之间得间隔都相等
  5. space-around：两个项目两侧间隔相等
  6. stretch：默认，占满整个交叉轴

### 容器成员属性
- order = 定义项目的排列顺序，数值越小，越靠前
- flex-grow = 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大
- flex-shrink = 定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
- flex-basis = 初始尺寸，平时用不到
- flex = flex-grow flex-shrink flex-basis 的简写，默认0 1 auto
  1. flex：1 = flex： 1 1 0% // 绝对弹性元素，不需要考虑尺寸
  2. flex：2 = flex： 2 1 0%
  3. flex：auto = flex： 1 1 auto // 相对弹性元素，需要考虑尺寸
  4. flex: none = flex: 0 0 auto, 常用于固定尺寸不伸缩
- align-self = 允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性
