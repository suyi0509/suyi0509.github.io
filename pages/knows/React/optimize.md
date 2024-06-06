## react渲染优化
1. 父组件渲染导致子组件渲染，子组件并无发生改变，这种无谓的渲染
- shouldComponentUpdate
- PureComponent
- React.memo

### shouldComponentUpdate
通过shouldComponentUpdate生命周期函数，来对比 state 和 props，确定是否需要重新渲染，如果一致不需要渲染则返回 false

### PureComponent
和shouldComponentUpdate原理一样，通过对 props 和 state 做浅比较来实现shouldComponentUpdate

```jsx
if (this._compositeType === CompositeTypes.PureClass) {
 shouldUpdate = !shallowEqual(prevProps, nextProps) || ! shallowEqual(inst.state, nextState);
}
```


### React.memo
React.memo用来缓存组件的渲染，避免不必要的更新，其实也是一个高阶组件，与PureComponent十分类似，不同的是，React.memo只能用于函数组件

```jsx
import { memo } from 'react';
function Button(props) {
 // Component code
}

export default memo(Button);
```
