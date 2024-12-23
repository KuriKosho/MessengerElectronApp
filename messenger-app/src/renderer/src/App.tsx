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
    // <Provider store={store}>
    //   {/* <div className="flex flex-col h-full">{isLoggedIn ? <Messenger /> : <Auth />}</div>
    //   <Toaster /> */}
    //   {/* Configue route */}
    // </Provider>
  )
}

export default App
// import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

// function randomID(len) {
//   let result = ''
//   if (result) return result
//   const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP'
//   const maxPos = chars.length
//   let i
//   len = len || 5
//   for (i = 0; i < len; i++) {
//     result += chars.charAt(Math.floor(Math.random() * maxPos))
//   }
//   return result
// }

// export function getUrlParams(url = window.location.href) {
//   const urlStr = url.split('?')[1]
//   return new URLSearchParams(urlStr)
// }

// export default function App() {
//   const roomID = getUrlParams().get('roomID') || randomID(5)
//   const myMeeting = async (element) => {
//     // generate Kit Token
//     const appID = 773992538
//     const serverSecret = 'cac9b89e06eeb89985102cdef77779e8'
//     const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//       appID,
//       serverSecret,
//       roomID,
//       randomID(5),
//       randomID(5)
//     )

//     // Create instance object from Kit Token.
//     const zp = ZegoUIKitPrebuilt.create(kitToken)
//     // start the call
//     zp.joinRoom({
//       container: element,
//       sharedLinks: [
//         {
//           name: 'Personal link',
//           url:
//             window.location.protocol +
//             '//' +
//             window.location.host +
//             window.location.pathname +
//             '?roomID=' +
//             roomID
//         }
//       ],
//       scenario: {
//         mode: ZegoUIKitPrebuilt.GroupCall // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
//       }
//     })
//   }

//   return (
//     <div
//       className="myCallContainer"
//       ref={myMeeting}
//       style={{ width: '100vw', height: '100vh' }}
//     ></div>
//   )
// }
