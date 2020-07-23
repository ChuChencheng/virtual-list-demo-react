import React, { useCallback, useRef, useState } from 'react'
import usePropHeightVirtualList from '../hooks/usePropHeightVirtualList'

interface IProps<T> {
  data: T[];
  estimatedItemHeight: number
  getItemHeight: (index: number) => number
  itemRender: (item: T) => JSX.Element
}

function PropHeight <T>({ data, estimatedItemHeight, getItemHeight, itemRender }: IProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)

  const { startIndex, positions, totalHeight, visibleData, offset } = usePropHeightVirtualList({
    data,
    estimatedItemHeight,
    getItemHeight,
    scrollTop,
    clientHeight,
  })

  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop)
    }
  }, [])

  const containerRefCallback = useCallback((node: HTMLDivElement) => {
    if (node) {
      containerRef.current = node
      setClientHeight(node.clientHeight)
    } else {
      containerRef.current = null
    }
  }, [])

  return (
    <div
      className="container"
      ref={containerRefCallback}
      onScroll={handleScroll}
    >
      <div
        className="total-list"
        style={{ height: `${totalHeight}px` }}
      ></div>
      <div
        className="visible-list"
        style={{ transform: `translateY(${offset}px)` }}
      >
        {visibleData.map((data, index) => (
          <div key={(data as any).id} style={{ height: `${positions[index + startIndex].height}px` }}>{itemRender(data)}</div>
        ))}
      </div>
    </div>
  )
}

export default PropHeight
