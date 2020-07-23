import React, { useState } from 'react'

export default function Counter () {
  const [count, setCount] = useState(0)

  return (
    <span>
      <span>Count: {count}</span>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </span>
  )
}
