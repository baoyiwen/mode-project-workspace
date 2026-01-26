import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ModelDesigner, QueryDesigner, ResultViewer } from './pages'

function App() {
  const [currentPage, setCurrentPage] = useState<'model' | 'query' | 'result'>('model')

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>DDAGS Frontend</h1>
      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setCurrentPage('model')}>Model Designer</button>
          <button onClick={() => setCurrentPage('query')} style={{ marginLeft: '10px' }}>Query Designer</button>
          <button onClick={() => setCurrentPage('result')} style={{ marginLeft: '10px' }}>Result Viewer</button>
        </div>
        {currentPage === 'model' && <ModelDesigner />}
        {currentPage === 'query' && <QueryDesigner />}
        {currentPage === 'result' && <ResultViewer />}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
