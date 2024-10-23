import JsSIP from 'jssip';
import { RTCSessionEvent, UA } from 'jssip/lib/UA';
import { RTCSession } from 'jssip/lib/RTCSession';
const wss = process.env.NEXT_PUBLIC_ASTERISK_WSS;
const domain = process.env.NEXT_PUBLIC_API_KEY;

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
            // Adiciona o listener de áudio ao confirmar a chamada
            this.currentSession.connection.addEventListener('track', (event: RTCTrackEvent) => {
              const audioElement = document.createElement('audio');
              audioElement.srcObject = event.streams[0]; // Access the first stream
              audioElement.play();
            });
          }
        },
      },
      mediaConstraints: { audio: true, video: false },
      rtcConfiguration: {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      },
    };

    this.ua.call(`sip:${targetUri}@${domain}`, options);
  }

  // Método público para aceitar chamadas
  public answerCall() {
    if (this.currentSession) {
      const options = {
        mediaConstraints: { audio: true, video: false },
        rtcConfiguration: {
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        },
      };

      this.currentSession.answer(options);

      // Adicionar o listener de áudio para chamadas recebidas
      this.currentSession.connection.addEventListener('track', (event: RTCTrackEvent) => {
        const audioElement = document.createElement('audio');
        audioElement.srcObject = event.streams[0]; // Acessa o primeiro stream
        audioElement.play();
      });

      this.currentSession.on('ended', () => {
        console.log('Call ended');
        this.currentSession = null; // Limpa a sessão quando a chamada terminar
      });

      this.currentSession.on('failed', () => {
        console.log('Call failed');
        this.currentSession = null; // Limpa a sessão se a chamada falhar
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
