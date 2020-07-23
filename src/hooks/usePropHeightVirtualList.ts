import { useState, useEffect, useMemo, useRef } from 'react'
import binarySearch from '../utils/binary-search'

interface IParams<T> {
  data: T[]
  getItemHeight: (index: number) => number
  estimatedItemHeight: number
  scrollTop: number
  clientHeight: number
}

interface IPosition {
  height: number
  offset: number
}

export default function usePropHeightVirtualList <T> ({
  data,
  getItemHeight,
  estimatedItemHeight,
  scrollTop,
  clientHeight,
}: IParams<T>) {
  const [positions, setPositions] = useState<IPosition[]>([])

  // 以 `estimatedItemHeight` 初始化 `positions` 数组
  useEffect(() => {
    const initPositions: IPosition[] = []
    const length = data.length
    for (let i = 0; i < length; i++) {
      initPositions[i] = {
        height: estimatedItemHeight,
        offset: estimatedItemHeight + (initPositions[i - 1]?.offset || 0)
      }
    }
    setPositions(initPositions)
  }, [data.length, estimatedItemHeight])

  // 二分查找 `startIndex`
  const t1 = performance.now()
  const startIndex = binarySearch(positions.slice(0, Math.ceil(scrollTop / estimatedItemHeight) + 1).map((p) => p.offset), scrollTop)
  const t2 = performance.now()
  console.log('查找 startIndex 耗时： ', t2 - t1)
  const endIndex = Math.ceil(clientHeight / estimatedItemHeight) + startIndex + 1
  const visibleData = useMemo(() => data.slice(startIndex, endIndex), [data, endIndex, startIndex])

  const positionsRef = useRef<IPosition[]>()
  positionsRef.current = positions
  // 根据渲染的列表项，获取实际高度并更新 `positions` 数组
  useEffect(() => {
    if (!positionsRef.current || !positionsRef.current.length || startIndex === -1) return
    const positions = positionsRef.current
    const newPositions: IPosition[] = []
    let firstUpdatedIndex = -1
    const limit = Math.min(positions.length - 1, endIndex)
    const t1 = performance.now()
    for (let i = startIndex; i <= limit; i++) {
      const realHeight = getItemHeight(i)
      if (realHeight !== positions[i].height) {
        if (firstUpdatedIndex === -1) firstUpdatedIndex = i
        newPositions[i] = {
          height: realHeight,
          // 先随便赋个值，后面再统一更新
          offset: 0
        }
      }
    }
    if (firstUpdatedIndex !== -1) {
      // 有更新的节点
      positions.forEach((p, i) => {
        if (!newPositions[i]) newPositions[i] = p
      })
      // 从 `firstUpdatedIndex` 开始，更新后面的 `offset`
      const length = positions.length
      for (let i = firstUpdatedIndex; i < length; i++) {
        newPositions[i].offset = newPositions[i].height + (newPositions[i - 1]?.offset || 0)
      }
      const t2 = performance.now()
      console.log('更新缓存耗时： ', t2 - t1)
      setPositions(newPositions)
    }
  }, [endIndex, getItemHeight, startIndex])

  return {
    startIndex,
    positions,
    totalHeight: positions[positions.length - 1]?.offset || 0,
    visibleData,
    offset: (positions[startIndex]?.offset || 0) - (positions[startIndex]?.height || 0),
  }
}
