## CSS隐藏元素
### 实现方法
1. display：none(推荐)
   - 特点：元素不可见，不占据空间，无法响应点击事件，会导致浏览器重排和重绘
2. visibility：hidden(推荐)
   - 特点：元素被隐藏，占据空间，无法响应点击事件，会导致浏览器重绘，不重排
3. opacity：0(推荐)
   - 特点：元素透明度为0，占据空间，可以响应点击事件，会导致浏览器重绘，不重排
4. 设置height、width属性为0
   - 特点：长度宽度为0，不占据空间，无法响应点击事件，会导致浏览器重排和重绘
5. position：absolute
   - 特点：移出可视区域，不占据空间，无法响应点击事件，会导致浏览器重排和重绘
6. clip-path
   - 特点：裁剪，占据空间，无法响应点击事件，会导致浏览器重排和重绘

### 实现三角形
```html
<style>
	.border {
		width: 0px;
		height: 0px;
        border-style: solid;
		border-width: 0 50px 50px;
		border-color: transparent transparent #d9534f;
	}
</style>
<div class="border"></div>
```
- 中空三角形
```html
<style>
	.border {
		width: 0px;
		height: 0px;
		border-style: solid;
		border-width: 0 50px 50px;
		border-color: transparent transparent #d9534f;
		display: relative;
	}

	.border:after {
		content: '';
		width: 0px;
		height: 0px;
		border-style: solid;
		border-width: 0 40px 40px;
		border-color: transparent transparent #fff;
		position: absolute;
		top: 13px;
		left: 17px;
	}
</style>
<div class="border"></div>
```

### 视觉差滚动
> 指多层背景以不同速度移动，形成立体的运动效果，带来非常出色的视觉体验，
> 一般会有3层，背景层、内容层、悬浮层。滚动鼠标时，每个图层以不同的速度移动，形成视觉差的效果

- 方式
  1. background-attachment
  2. transform：translate3D