import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Auth from './pages/auth/auth'
import Messenger from './pages/messenger/messenger'
import { RootState } from './stores/store'
function App() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  useEffect(() => {}, [])
  return (
    <div className="flex flex-col h-full">{isLoggedIn ? <Messenger /> : <Auth />}</div>
    // </Provider>
  )
}

export default App
