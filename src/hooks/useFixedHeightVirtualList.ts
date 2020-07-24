import { useMemo } from 'react'

interface IParams<T> {
  data: T[]
  itemHeight: number
  scrollTop: number
  clientHeight: number
}

export default function useFixedHeightVirtualList <T> ({
  data,
  itemHeight,
  scrollTop,
  clientHeight,
}: IParams<T>) {
  const totalHeight = useMemo(() => data.length * itemHeight, [data.length, itemHeight])
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.ceil(clientHeight / itemHeight) + startIndex + 1
  const visibleData = useMemo(() => data.slice(startIndex, endIndex), [data, endIndex, startIndex])
  const offset = useMemo(() => startIndex * itemHeight, [itemHeight, startIndex])

  return {
    totalHeight,
    visibleData,
    offset,
  }
}
