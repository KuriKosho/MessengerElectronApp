import { useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/auth'
import Messenger from './pages/messenger/messenger'
import VideoRoom from './pages/p2p/VideoRoom'
import store, { RootState } from './stores/store'

export const routes = {
  login: '/',
  chat: '/chat',
  video: '/video'
}
function App() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  useEffect(() => {}, [])
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path={routes.login} element={<Auth />} />
          <Route path={routes.chat} element={<Messenger />} />
          <Route path={routes.video} element={<VideoRoom />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  )
}

export default App
