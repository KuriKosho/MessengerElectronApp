import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { useNavigate } from 'react-router-dom'
function randomID(len) {
  let result = ''
  if (result) return result
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP'
  const maxPos = chars.length
  let i
  len = len || 5
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return result
}

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split('?')[1]
  return new URLSearchParams(urlStr)
}

export default function VideoRoom() {
  const navigate = useNavigate()
  const roomID = getUrlParams().get('roomID') || randomID(5)
  const myMeeting = async (element) => {
    // generate Kit Token
    const appID = 773992538
    const serverSecret = 'cac9b89e06eeb89985102cdef77779e8'
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      randomID(5),
      randomID(5)
    )

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken)
    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Personal link',
          url:
            window.location.protocol +
            '//' +
            window.location.host +
            window.location.pathname +
            '?roomID=' +
            roomID
        }
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
      onReturnToHomeScreenClicked: () => {
        // Điều hướng về trang chat
        navigate('/chat')
      }
    })
  }

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  )
}
