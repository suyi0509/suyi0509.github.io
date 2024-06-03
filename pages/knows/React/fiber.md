## Fiber架构

### 前言
JavaScript引擎和GUI页面渲染引擎两个线程是互斥的，当其中一个线程执行时，另一个线程只能挂起等待，如果JavaScript线程长时间地占用了主线程，那么渲染层面的更新就不得不长时间地等待，界面长时间不更新，导致页面响应度变差，用户可能感觉到卡顿。

这就是React15的Stack Reconciler所面临的问题，当react在渲染组件时，从开始到渲染完成整个过程是一气呵成，无法中断

- 网页卡顿的主要问题：
- CPU瓶颈
- IO的瓶颈

#### 解决CPU瓶颈
> 掉帧：当下主流浏览器的刷新频率为60HZ（1000ms/60HZ），即每16.6ms浏览器刷新一次。在GUI渲染进程和JS线程互斥，如果一帧内js脚本执行占用过长时间(超过16.6ms)，那么就没有时间去执行渲染进程，就是所谓的“掉帧”

- 因此，要解决CPU瓶颈，就是需要再每一帧的时间里，限定一些时间给JS线程，然后让浏览器有剩余的时间去执行渲染进程。其中react一开始预留的初始时间为5ms。当预留时间不够时，React会将线程控制权交给浏览器让他继续渲染UI，React则在下一帧时间到来继续被中断的工作

- CPU 瓶颈关键是要实现时间切片，时间切片的关键是将同步更新变为可中断的异步更新

> 时间切片：这种将长任务拆分到每一帧中去执行每一段微小任务的操作被称为时间切片（time slice）

#### 解决IO瓶颈
IO的瓶颈主要来源于网络延迟，大多数时候开发者是无法解决的。在无法解决的情况下减少网络延迟对用户的感知，React实现了Suspense功能及配套的hook-useDeferredValue。这个特征同样需要将 同步更新 变成 可中断的异步更新

### 介绍
React Fiber是Facebook花费2年时间对React核心算法的一次重新实现，发布于react 16版本上。

- 在react中，主要做了以下操作
- 为每个任务增加了优先级，优先级高的任务可以中断低优先级任务，然后再**重新**执行优先级低的任务
- 增加了异步任务， 调用requestIdleCallback api，浏览器空闲的时候执行
- dom diff树变成链表，一个dom对应两个fiber（一个链表），对应两个队列，这都是为找到被中断的任务，重新执行


- 在架构层面，Fiber是对React核心算法（即调和过程）的重写
- 在编程层面，Fiber是React内部所定义的一种数据结构，它是Fiber树结构的节点单位，也就是React 16新架构下的虚拟Dom

一个fiber就是一个js对象，React Fiber可以理解为一个执行单元(work unit) ，也可以说是一种新的数据结构。包含元素信息、元素更新操作队列、类型、其数据结构如下
```jsx
type Fiber = {
    tag:WorkTag,
    key:null| string,
    elementType:any,
    type:any,
    stateNode: any,
    return: Fiber | null,
    child:Fiber | null,
    sibling: Fiber | null,
    index: number,
    ref: null | (((handle: mixed) => void) & { _stringRef: ?string }) | RefObject,
    pendingProps: any,
    memoizedProps: any,
    updateQueue: UpdateQueue<any> | null,
    memoizedState: any,
    firstContextDependency: ContextDependency<mixed> | null,
    mode: TypeOfMode,
    effectTag: SideEffectTag,
    nextEffect: Fiber | null,
    firstEffect: Fiber | null,
    lastEffect: Fiber | null,
    expirationTime: ExpirationTime,
    childExpirationTime: ExpirationTime,
    alternate: Fiber | null,
}
// 在V16版中 Reconciler是基于 Fiber 节点实现的，被称为 Fiber Reconciler，支持可中断异步更新，任务支持时间切片
```

### fiber工作原理
> React Fiber 通过分片（slicing）和优先级调度（priority scheduling）来实现高效组件更新和异步渲染

1. 构建Fiber树
    > React Fiber会创建一颗Fiber树，用于表示React组件树的结构和状态。Fiber树是一个轻量级的树形结构，与React组件树一一对应。React Fiber采用链表结构对树进行行分片拆分，实现递增渲染的效果

2. 确定调度优先级
    > Fiber树构建完成后，React Fiber会根据组件的更新状态和优先级，确定优先更新的组件，即"调度更新"。

3. 执行调度更新
   > 确定更新的组件后，React Fiber会将这些组件标记为 脏"dirty",并将他们放入更新队列中，等待处理。在Fiber中并不是立即执行更新操作，而是等待时间片到来时才开始执行，让React fiber执行更新时具有更高的优先级，提高应用的响应性和性能
   
4. 中断和恢复
   > 在执行更新中，如果需要中断当前任务，Fiber会根据当前优先级、执行时间等因素，中断当前任务，并将现场保存在堆栈中，当下次处理到该任务的时候，React Fiber 可以通过恢复堆栈中保存的现场信息，继续执行任务，从而实现中断和恢复的效果
   
5. 渲染和提交
   > React Fiber 会将更新结果渲染在页面上，并设置下一次更新的时间和优先级。React Fiber利用WebGL和canvas等原生绘制API，实现CPU加速


### 双缓存
> 在canvas绘制时，每一帧绘制前都会调用ctx.clearRect清理上一帧的画面，如果这时候计算量比较大，则清理完成到下一帧画面间隙太长，就会出现白屏现象。这时候可以在内存中进行绘制当前画面，绘制完成时直接替换，就不会出现白屏情况。这种在内存中构建并直接替换的技术叫**做双缓存技术**。 React使用“双缓存”来完成Fiber树的构建与替换——对应着DOM树的创建与更新

### 过程
1. Fiber把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务，如果没有则挂起当前任务，把时间控制权交给主线程，等主线程不忙的时候再继续执行。即可中断与恢复，恢复后也可以复用之前的中间状态，并给不同的任务赋予不同的优先级，其中每个任务更新单元为React Element对应的Fiber节点
2. 实现的上述方式的是 requestIdleCallback 方法，window.requestIdleCallback()方法将在浏览器的空闲时段内调用的函数排队，使得开发者能在主事件循环上执行后台和低优先级工作
3. React中任务切割为多个步骤，分批完成。在完成一部分任务之后