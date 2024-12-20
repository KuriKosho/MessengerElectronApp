// import store from "../redux/stores/store";
// import { addRemoteStream, setLocalStream, setLocalStreamOneOne, setRemoteStreamOneOne, setRemoteStreams } from "../redux/features/videoRoomsSlice";
// import {Peer} from 'peerjs'


// let peer;
// let peerId

// export const getPeerId = () => {
//     return peerId;
// };

// export const getAccessToLocalStream = async () => {
//     const localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//     });


//     if(localStream) {

//         store.dispatch(setLocalStream(localStream));
//     }

//     return Boolean(localStream);
// };
// export const getAccessToLocalStreamForOneOne = async () => {
//   const localStream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//   });


//   if(localStream) {

//       store.dispatch(setLocalStreamOneOne(localStream));
//   }

//   return Boolean(localStream);
// };

// export const connectWithPeerServer = () => {
//     peer = new Peer(undefined, {
//         host: "localhost",
//         port: 9000,
//         path: '/peer',
//     });

//     peer.on("open", (id)=> {
//         console.log("My peer Id is:" +id);
//         peerId = id;
//     });

//     peer.on('call', async(call) => {
//         const localStream = store.getState().videoRooms.localStream
//         call.answer(localStream) // answer the call with A/V stream
//         call.on('stream', (remoteStream) => {
//             console.log('remote stream came');
//             store.dispatch(addRemoteStream(remoteStream));

//         });
//     });
// };

// export const call = (data) => {
//     const {newParticipantPeerId} = data;
//     const localStream = store.getState().videoRooms.localStream;

//     const peerCall = peer.call(newParticipantPeerId, localStream);

//     peerCall.on('stream', (remoteStream) => {
//         console.log("remote stream came");
//         store.dispatch(addRemoteStream(remoteStream))
//     })
// };

// export const callOneToOne = (data) => {
//   const {newParticipantPeerId} = data;
//   const localStream = store.getState().videoRooms.localStream;

//   const peerCall = peer.call(newParticipantPeerId, localStream);

//   peerCall.on('stream', (remoteStream) => {
//       console.log("remote stream came");
//       store.dispatch(setRemoteStreamOneOne(remoteStream))
//   })
// };

// export  const disconnect = () => {
//     // close all peer connecttions
//     for ( let conns in peer.connections){
//         peer.connections[conns].forEach((c)=> {
//             console.log('closing connections')

//             c.peerConnection.close();

//             if(c.close) {
//                 c.close()
//             }
//         });
//     }
//     store.dispatch(setRemoteStreams([]));
//     store.dispatch(setRemoteStreamOneOne(null))
// }
