// "use client"; // Adicione esta linha
// import { useEffect } from 'react';
// import JsSIP from 'jssip';
// import { RTCSessionEvent } from 'jssip/lib/UA';
// import { RTCSession } from 'jssip/lib/RTCSession';
// export default function SipPage() {
//   useEffect(() => {
//     // Verifica se JsSIP está carregado
//     // if (typeof window.JsSIP === 'undefined') {
//     //   console.error('JsSIP is not loaded.');
//     //   return;
//     // }

//     const socket = new JsSIP.WebSocketInterface('wss://talkinvagner.shop/ws');
//     const configuration = {
//       sockets: [socket],
//       uri: 'sip:1000@talkinvagner.shop',
//       password: '1234',
//     };
    
//     const ua = new JsSIP.UA(configuration);
//     ua.start();
    
//     ua.on('connected', () => {
//       console.log('Connected');
//     });

//     ua.on('disconnected', () => {
//       console.log('Disconnected');
//     });

//     const options = {
//         eventHandlers: {
//           progress: () => {
//             console.log('Call is in progress');
//           },
//           failed: (e: any) => {
//           //  console.log('Call failed with cause: ' + (e.data.cause || 'Unknown'));
//           },
//           ended: (e: any) => {
//            // console.log('Call ended with cause: ' + (e.data.cause || 'Unknown'));
//           },
//           confirmed: () => {
//             console.log('Call confirmed');
//           },
//         },
//         mediaConstraints: { audio: true, video: false },
//         rtcConfiguration: {
//           iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//         },
//       };
  

//       ua.on('newRTCSession', (e: RTCSessionEvent) => {
//         const session: RTCSession = e.session;
      
//       if (session.direction === 'incoming') {
//         console.log('Chamada recebida');
        
//         // Exibe os botões de aceitar e recusar chamada
    
//         // Aceitar a chamada
//         //document.getElementById('accept-call').onclick = () => {
//           session.answer(options);
//           //document.getElementById('call-buttons').style.display = 'none';
//      // Use 'track' event instead of 'addstream'
//      session.connection.addEventListener('track', (event: RTCTrackEvent) => {
//         const audioElement = document.createElement('audio');
//         audioElement.srcObject = event.streams[0]; // Access the first stream
//         audioElement.play();
//       });
//         };
//         // Recusar a chamada
//       //  document.getElementById('reject-call').onclick = () => {
//           //session.terminate();
//         //  document.getElementById('call-buttons').style.display = 'none';
//        // };

//         session.on('ended', () => {
//           //document.getElementById('call-buttons').style.display = 'none';
//         });

//         session.on('failed', () => {
//           //document.getElementById('call-buttons').style.display = 'none';
//         });
//       }

//     )
//     ua.call('sip:1002@talkinvagner.shop', options);

// });

//     // Cleanup on component unmount
// //     return () => {
// //       //ua.stop();
// //     };
// //   }, [];

//   return (
//     <div>
//       <h1>Chamadas SIP</h1>
//       <div id="call-buttons" style={{ display: 'none' }}>
//         <button id="accept-call">Aceitar Chamada</button>
//         <button id="reject-call">Recusar Chamada</button>
//       </div>
//     </div>
//   );
// }
