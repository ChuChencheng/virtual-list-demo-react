# 实现思路

## 1. 目的

首先要明确目的，我们要只渲染部分数据，就要弄清楚要渲染的数据从哪里开始，到哪里结束，也就是寻找数据范围。

## 2. 已知条件

列出要达到目的的已知条件：

1. 数据总条数 `total`
2. 可见容器的高度 `clientHeight`
3. 滚动的距离，也就是 `scrollTop`
4. 每个列表项的高度或者大致高度 `itemHeight`

## 3. 计算方法

### 3.1. 问题转换

要求渲染的数据范围，也就是寻找开始跟结束渲染的列表项索引 `startIndex`, `endIndex`

1. 要求 `startIndex` ，就要计算滚过的距离 `scrollTop` 占用了多少个列表项
2. 求 `endIndex` 则计算可见高度 `clientHeight` 占了多少列表项 `visibleCount` ，然后加上 `startIndex` 即可

### 3.2. 具体实现

#### 3.2.1. 定高

如果每个列表项高度都是一样的，那就非常好算了，只需要简单的加减乘除而无需遍历就能算出想要的数据：

```javascript
// floor 跟 ceil 是为了保证列表项能完全填充可见容器，而不会在上下留空白
const startIndex = Math.floor(scrollTop / itemHeight)
const endIndex = Math.ceil(clientHeight / itemHeight) + startIndex
```

#### 3.2.2. 不定高

如果每个列表项的高度不是一样的，那计算会麻烦一些，会多一些变量，不过大体的思路是一样的。

这边还需要分两种情况考虑

##### 3.2.2.1. 用户传入高度

这种情况其实是一种妥协，还是要求用户传入每个列表项的高度

可以让用户传入一个函数 `getItemHeight` ，接收列表项 index 作为参数，返回这个列表项的实际高度

但也需要一个预估的高度 `estimatedItemHeight` ，来处理列表项没渲染时的高度获取问题

具体的计算方式相应也要做出改变：

1. 维护一个数组 `positions` ，缓存每个列表项的高度与距离顶部的距离，根据 `estimatedItemHeight` 初始化这个数组

```typescript
let positions: Array<{ height: number; offset: number }>
```

2. 从 `positions` 中查找 `offset` 最接近且小于 `scrollTop` 的索引，即 `startIndex`
3. 根据 `clientHeight` 与 `estimatedItemHeight` 算出可视范围占了多少列表项，加上 `startIndex` 得到 `endIndex`
4. 根据传入的 `getItemHeight` 函数，计算出 `startIndex` 到 `endIndex` 范围节点的真实高度，更新 `positions` 数组（包括更新渲染的节点高度以及 `startIndex` 之后每一个列表项的 `offset`）

##### 3.2.2.2. 渲染后再获取实际高度（自适应）

渲染后再获取实际高度，就不需要用户传入 `getItemHeight` 了，而是在上述第 4 步骤中，遍历渲染出来的节点，调用 DOM 方法得到实际高度，再进行更新。

## 4. 优化点

能优化的地方主要是有遍历数据的地方：

1. 查找 `offset` 过程
2. 更新 `positions` 数组过程
3. 多渲染一定个数列表项缓解白屏现象
4. 控制渲染节点变化频率

## 5. 优缺点

优点： 解决长列表问题，可渲染大量数据、减少内存占用
缺点： 滚动时 CPU 占用高，列表项组件无法保留内部状态
