import { useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/auth'
import Callback from './pages/callback/call-back'
import GamePage from './pages/game/game-page'
import Messenger from './pages/messenger/messenger'
import MusicFeedPage from './pages/music/music-feed-page'
import MusicLibraryPage from './pages/music/music-library-page'
import MusicPlayerPage from './pages/music/music-player-page'
import MusicTrendingPage from './pages/music/music-trending-page'
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
  feed: '/music/feed',
  library: '/music/library',
  trending: '/music/trending',
  player: '/music/player/:type/:id',
  otp: '/otp',
  callback: '/callback'
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
          <Route path={routes.server} element={<ServerPage />} />
          <Route path={routes.feed} element={<MusicFeedPage />} />
          <Route path={routes.library} element={<MusicLibraryPage />} />
          <Route path={routes.player} element={<MusicPlayerPage />} />
          <Route path={routes.trending} element={<MusicTrendingPage />} />
          <Route path={routes.callback} element={<Callback />} />
          <Route path={routes.otp} element={< OTP_verification />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  )
}

export default App
