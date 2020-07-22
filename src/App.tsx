import React, { useCallback } from 'react'
import FixedHeight from './components/FixedHeight'
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

  return (
    <FixedHeight
      data={data}
      itemHeight={50}
      itemRender={itemRender}
    />
  )
}
