import React, { useCallback } from 'react'
import FixedHeight from './components/FixedHeight'
import PropHeight from './components/PropHeight'
import dataGen from './utils/data-generator'

const data = dataGen()

export default function App () {
  const itemRender = useCallback((item) => {
    return (
      <div style={{
        boxSizing: 'border-box',
        height: '100%',
        lineHeight: '50px',
        textAlign: 'center',
        border: '1px solid black'
      }}>{item.value}</div>
    )
  }, [])

  const getItemHeight = useCallback((index: number) => {
    return 50 + (index % 5) * 10
  }, [])

  return (
    // <FixedHeight
    //   data={data}
    //   itemHeight={50}
    //   itemRender={itemRender}
    // />
    <PropHeight
      data={data}
      estimatedItemHeight={50}
      getItemHeight={getItemHeight}
      itemRender={itemRender}
    />
  )
}
