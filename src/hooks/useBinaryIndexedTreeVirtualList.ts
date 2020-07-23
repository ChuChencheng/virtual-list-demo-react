import { useEffect, useMemo, useCallback, useRef } from 'react'
import BinaryIndexedTree from '../utils/BinaryIndexedTree'

interface IParams<T> {
  data: T[]
  estimatedItemHeight: number
  scrollTop: number
  clientHeight: number
  itemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}

export default function useBinaryIndexedTreeVirtualList <T> ({
  data,
  estimatedItemHeight,
  scrollTop,
  clientHeight,
  itemRefs,
}: IParams<T>) {
  const treeRef = useRef<BinaryIndexedTree>()

  // 初始化树状数组
  useEffect(() => {
    const initPositions: number[] = []
    const length = data.length
    for (let i = 0; i < length; i++) {
      initPositions[i] = estimatedItemHeight
    }
    treeRef.current = new BinaryIndexedTree(initPositions)
  }, [data.length, estimatedItemHeight])

  // 查找 `startIndex`
  const t1 = performance.now()
  const startIndex = (treeRef.current?.findGe(scrollTop) || 1) - 1
  const t2 = performance.now()
  console.log('查找 startIndex 耗时： ', t2 - t1)
  const endIndex = Math.ceil(clientHeight / estimatedItemHeight) + startIndex + 1
  const visibleData = useMemo(() => data.slice(startIndex, endIndex), [data, endIndex, startIndex])

  // 根据渲染的列表项，获取实际高度并更新树状数组
  const updatePositions = useCallback(() => {
    if (!itemRefs.current.length) return
    if (!data.length || startIndex === -1) return
    const t1 = performance.now()
    itemRefs.current.forEach((node, index) => {
      if (node) {
        const i = index + startIndex
        const realHeight = node.getBoundingClientRect().height
        const currentHeight = treeRef.current?.getValue(i + 1) || 0
        if (realHeight !== currentHeight) {
          treeRef.current?.update(i + 1, realHeight - currentHeight)
        }
      }
    })
    const t2 = performance.now()
    console.log('更新缓存耗时： ', t2 - t1)
  }, [data.length, itemRefs, startIndex])

  return {
    totalHeight: treeRef.current?.prefixSum(data.length) || 0,
    visibleData,
    offset: treeRef.current?.prefixSum(startIndex) || 0,
    updatePositions,
  }
}
