import { Toaster } from '@/components/ui/toaster'
import { useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import Auth from './pages/auth/auth'
import Messenger from './pages/messenger/messenger'
import store, { RootState } from './stores/store'

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  useEffect(() => {}, [])
  return (
    <Provider store={store}>
      <div className="flex flex-col h-full">{isLoggedIn ? <Messenger /> : <Auth />}</div>
      <Toaster />
    </Provider>
  )
}

export default App
