import { useMemo } from 'react'

export default function useFixedHeightVirtualList <T> (data: T[], itemHeight: number, scrollTop: number, clientHeight: number) {
  const totalHeight = useMemo(() => data.length * itemHeight, [data.length, itemHeight])
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.floor(clientHeight / itemHeight) + startIndex + 1
  const visibleData = useMemo(() => data.slice(startIndex, endIndex), [data, endIndex, startIndex])
  const offset = useMemo(() => startIndex * itemHeight, [itemHeight, startIndex])

  return {
    totalHeight,
    visibleData,
    offset
  }
}
