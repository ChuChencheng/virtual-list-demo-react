import React, { useCallback, useRef, useState } from 'react'
import useFixedHeightVirtualList from '../hooks/useFixedHeightVirtualList'

interface IProps<T> {
  data: T[];
  itemHeight: number;
  itemRender: (item: T) => JSX.Element
}

function FixedHeight <T>({ data, itemHeight, itemRender }: IProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)

  const { totalHeight, visibleData, offset } = useFixedHeightVirtualList(data, itemHeight, scrollTop, clientHeight)

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
        {visibleData.map((data) => (
          <div key={Math.random()} style={{ height: `${itemHeight}px` }}>{itemRender(data)}</div>
        ))}
      </div>
    </div>
  )
}

export default FixedHeight
