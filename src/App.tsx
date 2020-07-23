import React, { useCallback } from 'react'
import { Switch, Route, useHistory, useLocation, Redirect } from 'react-router-dom'
import Counter from './components/Counter'
import FixedHeight from './components/FixedHeight'
import PropHeight from './components/PropHeight'
import ReactiveHeight from './components/ReactiveHeight'
import OptimizedReactiveHeight from './components/OptimizedReactiveHeight'
import NormalList from './components/NormalList'
import dataGen from './utils/data-generator'

const data = dataGen()

const normalListData = dataGen(50000)

const radioButtons = [
  {
    path: '/fixed-height',
    text: '定高',
  },
  {
    path: '/prop-height',
    text: '不定高（二分）,'
  },
  {
    path: '/reactive-height',
    text: '自适应（二分）',
  },
  {
    path: '/optimized-reactive-height',
    text: '自适应（树状数组）',
  },
  {
    path: '/normal-list',
    text: '普通列表',
  },
  {
    path: '/fixed-height-with-counter',
    text: '带计数器',
  },
]

export default function App () {
  const history = useHistory()
  const location = useLocation()

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

  const itemRenderWithCounter = useCallback((item) => {
    return (
      <div style={{
        boxSizing: 'border-box',
        height: '100%',
        lineHeight: '50px',
        textAlign: 'center',
        border: '1px solid black'
      }}>{item.value} | <Counter/></div>
    )
  }, [])

  const reactiveHeightItemRender = useCallback((item) => {
    return (
      <div style={{
        boxSizing: 'border-box',
        height: `${50 + (item.index % 5) * 10}px`,
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
    <>
      <div>
        {
          radioButtons.map((radio) => {
            return (
              <label key={radio.path}>
                <input
                  type="radio"
                  checked={location.pathname === radio.path}
                  onChange={() => history.push(radio.path)}
                />
                {radio.text}
              </label>
            )
          })
        }
      </div>
      <div style={{ border: '5px solid azure' }}>
        <Switch>
          <Route exact path="/">
            <Redirect to={radioButtons[0].path} />
          </Route>
          <Route path="/fixed-height">
            <FixedHeight
              data={data}
              itemHeight={50}
              itemRender={itemRender}
            />
          </Route>
          <Route path="/prop-height">
            <PropHeight
              data={data}
              estimatedItemHeight={50}
              getItemHeight={getItemHeight}
              itemRender={itemRender}
            />
          </Route>
          <Route path="/reactive-height">
            <ReactiveHeight
              data={data}
              estimatedItemHeight={50}
              itemRender={reactiveHeightItemRender}
            />
          </Route>
          <Route path="/optimized-reactive-height">
            <OptimizedReactiveHeight
              data={data}
              estimatedItemHeight={50}
              itemRender={reactiveHeightItemRender}
            />
          </Route>
          <Route path="/normal-list">
            <NormalList
              data={normalListData}
              itemHeight={50}
              itemRender={itemRender}
            />
          </Route>
          <Route path="/fixed-height-with-counter">
            <FixedHeight
              data={data}
              itemHeight={50}
              itemRender={itemRenderWithCounter}
            />
          </Route>
        </Switch>
      </div>
    </>
  )
}
