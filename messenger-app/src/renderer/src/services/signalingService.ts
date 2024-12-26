const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun.l.google.com:5349' },
    { urls: 'stun:stun1.l.google.com:3478' },
    { urls: 'stun:stun1.l.google.com:5349' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:5349' },
    { urls: 'stun:stun3.l.google.com:3478' },
    { urls: 'stun:stun3.l.google.com:5349' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:5349' },
    { urls: 'stun:stun5.l.google.com:19302' },
    { urls: 'stun:stun5.l.google.com:5349' },
    {
      urls: 'turn:relay1.expressturn.com:3478',
      username: 'efW6L6DFWVSZPJXIQY',
      credential: 'hcyxASnlf91Dxla9'
    }
  ]
}

let localPeer: RTCPeerConnection
let remotePeer: RTCPeerConnection

// localPeer = new RTCPeerConnection(iceServers)
// remotePeer = new RTCPeerConnection(iceServers)
