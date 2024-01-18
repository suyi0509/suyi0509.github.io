## selector
### css选择器

- 属性选择器
1. id选择器（#id）唯一
2. 类选择器（.class）
3. 标签选择器(div)
4. 后代选择器（#id div）
5. 子选择器(.class>class_1)
6. 相邻同胞选择器(.class_1+.class_2)

- 伪类选择器
1. :link = 选择未被访问的链接
2. :visited = 选取已被访问的链接
3. :active = 选择活动链接
4. :hover = 鼠标指针浮动在上面得元素
5. :focus = 选择具有焦点
6. :first-child = 父元素得首个子元素

- 伪元素选择器
1. :first-letter = 用于选取指定选择器得首字母
2. :first-line = 选取指定选择器得首行
3. :before = 选择器在被选元素的内容前面插入内容
4. :after = 选择器在被选元素的内容后面插入内容

- 属性选择器
1. [attribute] = 选择带有attribute属性的元素
2. [attribute=value] = 选择所有使用attribute = value的元素
3. [attribute~=value] = 选择attribute属性包含value的元素
4. [attribute|=value] = 选择attribute属性以value开头的元素

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


### 优先级
> 内联 > ID选择器 > 类选择器 > 标签选择器