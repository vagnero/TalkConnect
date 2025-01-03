import JsSIP from 'jssip';
import { RTCSessionEvent, UA } from 'jssip/lib/UA';
import { RTCSession } from 'jssip/lib/RTCSession';
const wss = process.env.NEXT_PUBLIC_ASTERISK_WSS;
const domain = process.env.NEXT_PUBLIC_DOMAIN_URL;

class SipClient {
  private ua: UA;
  private currentSession: RTCSession | null = null; // Armazena a sessão atual
  private onIncomingCall: () => void; // Função chamada quando há uma chamada recebida


  constructor(uri: string, password: string, onIncomingCall: () => void) {
    this.onIncomingCall = onIncomingCall;
    if (!wss) {
      throw new Error('WebSocket URL is not defined');
    }
    const socket = new JsSIP.WebSocketInterface(wss);
    const configuration = {
      sockets: [socket],
      uri: `sip:${uri}@${domain}`,
      password,
    };

    this.ua = new JsSIP.UA(configuration);
    this.ua.start();

    this.ua.on('connected', () => {
      console.log('Connected to SIP server');
    });

    this.ua.on('disconnected', () => {
      console.log('Disconnected from SIP server');
    });

    this.ua.on('newRTCSession', (e: RTCSessionEvent) => {
      const session: RTCSession = e.session;

      if (session.direction === 'incoming') {
        console.log('Incoming call');
        this.currentSession = session; // Armazena a sessão da chamada recebida

        // Chama o callback para notificar o componente sobre a chamada recebida
        this.onIncomingCall(); // <<< ADICIONE ESSA LINHA
      }

      // Configura o evento de áudio para sessões de saída
      if (session.direction === 'outgoing') {
        session.connection.addEventListener('track', (event: RTCTrackEvent) => {
          const audioElement = document.createElement('audio');
          audioElement.srcObject = event.streams[0]; // Acessa o primeiro stream
          audioElement.play();
        });
      }
    });
  }

  // Método para fazer chamadas
  public makeCall(targetUri: string) {
    // Captura mídia local (áudio e vídeo)
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        // Exiba o vídeo local
        const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
        if (localVideo) {
          localVideo.srcObject = stream;
          localVideo.play();
        }
  
        // Configure as opções para a chamada
        const options = {
          eventHandlers: {
            progress: () => {
              console.log('Call is in progress');
            },
            failed: (e: { cause: string }) => {
              console.log('Call failed with cause: ' + (e.cause || 'Unknown'));
            },
            ended: () => {
              console.log('Call ended');
              this.currentSession = null; // Limpa a sessão ao final
            },
            confirmed: () => {
              console.log('Call confirmed');
              if (this.currentSession) {
                // Adicione o listener para o vídeo remoto
                this.currentSession.connection.addEventListener('track', (event: RTCTrackEvent) => {
                  const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
                  if (remoteVideo) {
                    remoteVideo.srcObject = event.streams[0];
                    remoteVideo.play();
                  }
                });
              }
            },
          },
          mediaStream: stream, // Certifique-se de passar o fluxo de mídia local
          mediaConstraints: { audio: true, video: true },
          rtcConfiguration: {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
          },
        };
        this.ua.call(`sip:${targetUri}@${domain}`, options);
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
      });
  }
  

  // Método público para aceitar chamadas
  public answerCall() {
    if (this.currentSession) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then((stream) => {
          const options = {
            mediaStream: stream, // Envia o fluxo local na resposta
            mediaConstraints: { audio: true, video: true },
            rtcConfiguration: {
              iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            },
          };
  
          if (this.currentSession) {
            this.currentSession.answer(options);
          }
  
          // Adicionar o listener para vídeo remoto, verificando se `connection` não é nulo
          const connection = this.currentSession ? this.currentSession.connection : null;
          if (connection) {
            connection.addEventListener('track', (event: RTCTrackEvent) => {
              const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement | null;
              if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0];
                remoteVideo.play();
              }
            });
          }
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });
    }
  }
  
  

  // Método público para rejeitar chamadas
  public rejectCall() {
    if (this.currentSession) {
      this.currentSession.terminate(); // Encerra a chamada
      this.currentSession = null; // Limpa a sessão após a rejeição
      console.log('Call rejected');
    }
  }

  public endCall() {
    if (this.currentSession) {
      this.currentSession.terminate(); // Encerra a chamada em andamento
      console.log('Call terminated');
      this.currentSession = null; // Limpa a sessão após a chamada ser finalizada
    }
  }
}

export default SipClient;
