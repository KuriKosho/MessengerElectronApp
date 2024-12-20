import { useEffect } from 'react'
import Messenger from './pages/messenger/messenger'
import { connectWithSocketIOServer } from './services/Socket'

function App() {
  useEffect(() => {
    connectWithSocketIOServer()
  }, [])
  return (
    <div className="flex flex-col h-full">
      <Messenger />
    </div>
  )
}

export default App
