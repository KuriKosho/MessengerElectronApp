import { useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/auth'
import GamePage from './pages/game/game-page'
import Messenger from './pages/messenger/messenger'
import MusicPage from './pages/music/music-page'
import VideoRoom from './pages/p2p/VideoRoom'
import ServerPage from './pages/server/server-page'
import StreamPage from './pages/stream/stream-page'
import store, { RootState } from './stores/store'
import OTP_verification from './components/otp-verification'

export const routes = {
  login: '/',
  chat: '/chat',
  video: '/video',
  stream: '/stream',
  server: '/server',
  game: '/game',
  music: '/music',
  otp: '/otp',
}
function App() {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  useEffect(() => { }, [])
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path={routes.login} element={<Auth />} />
          <Route path={routes.chat} element={<Messenger />} />
          <Route path={routes.video} element={<VideoRoom />} />
          <Route path={routes.stream} element={<StreamPage />} />
          <Route path={routes.game} element={<GamePage />} />
          <Route path={routes.music} element={<MusicPage />} />
          <Route path={routes.server} element={<ServerPage />} />
          <Route path={routes.otp} element={< OTP_verification />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  )
}

export default App
