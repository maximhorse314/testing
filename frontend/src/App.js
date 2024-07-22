import React, { useCallback, useEffect, useState, useRef } from 'react'
import { FixedSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import "./style.css"
// pLURtkhVrUXr3KG25Gy5IvzziV5OrZGa
const API_KEY = 'pLURtkhVrUXr3KG25Gy5IvzziV5OrZGa' // process.env.API_KEY

const BACKEND = 'http://localhost:5000' // process.env.BACKEND

const PAGE_SIZE = 20

// use react-window to use virtualization to avoid performance issue when rendering hundreds of items
// virtualization renders only visible items in the current scroll view instead of rendering all at once
const ImageThumbnail = (url, title) => ({ index, style }) => (
  <div>
    <img url={url} width="100" height="100" />
    <p>{title}</p>
  </div>
)

const App = () => {
  const [history, setHistory] = useState([])
  const [keyword, setKeyword] = useState()
  const [moreAvailable, setMoreAvailable] = useState(true)

  const page = useRef(0)

  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${BACKEND}/histories`).then(res => res.json()).then(res => setHistory(res.data))
  }, [])

  const fetchData = useCallback(() => {
    return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword}&offset=${PAGE_SIZE * page.current}&limit=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(res => {
        setData(prev => prev.concat(res.data))
        setMoreAvailable(res.count >= PAGE_SIZE)
      })
  }, [keyword, setData, setMoreAvailable])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    setData([])
    page.current = 0
    fetchData()
    fetch(`${BACKEND}/histories`, { method: "POST", body: JSON.stringify({ term: keyword }), headers: { 'Content-Type': 'application/json'} })
      .then(() => setHistory(prev => prev.concat(keyword)))
  }, [keyword])

  const handleHistoryClick = useCallback((term) => {
    setData([])
    setKeyword(term)
    page.current = 0
    fetchData()
  }, [])

  const handleMoreClick = useCallback(() => {
    page.current += 1
    fetchData()
  }, [])

  return (
    <div className="container">
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <button>search</button>
        </form>

        <button onClick={handleMoreClick} disabled={!moreAvailable}>More</button>
        {/* <AutoSize>
          {({ height, width }) => (
            <List
              className="List"
              height={1000}
              itemCount={data.length}
              itemSize={100}
              width={1000}
            >
              {ImageThumbnail}
            </List>
          )}
        </AutoSize> */}
        {data.map((item, key) => (
          <div key={key}>
            <img  src={item.images.original.url} width="100" height="100" />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
      <div>
        History
        <button onClick={() => fetch(`${BACKEND}/histories`, { method: "DELETE"}).then(() => setHistory([]))}>Clear</button>
        {history.map((item, key) => (
          <p key={key} onClick={() => handleHistoryClick(item)}>{item}</p>
        ))}
      </div>
    </div>

  )
}

export default App
