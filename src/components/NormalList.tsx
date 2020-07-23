import React from 'react'

interface IProps<T> {
  data: T[];
  itemHeight: number;
  itemRender: (item: T) => JSX.Element
}

function NormalList <T>({ data, itemHeight, itemRender }: IProps<T>) {

  return (
    <div className="container">
      <div className="visible-list">
        {data.map((d) => (
          <div key={(d as any).id} style={{ height: `${itemHeight}px` }}>{itemRender(d)}</div>
        ))}
      </div>
    </div>
  )
}

export default NormalList
