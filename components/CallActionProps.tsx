import React, { useEffect, useState, useRef } from 'react';
import { FiPhoneOff, FiPhoneIncoming } from 'react-icons/fi'; // Ícones para finalizar e aceitar chamada

interface CallActionProps {
  onAccept: () => void;   // Função para aceitar a chamada
  onReject: () => void;   // Função para recusar a chamada
  onEndCall: () => void;  // Função para finalizar a chamada
  incomingCall: boolean;  // Estado que indica se há uma chamada recebida
}

const CallAction: React.FC<CallActionProps> = ({ onAccept, onReject, onEndCall, incomingCall }) => {
  const [isOnCall, setIsOnCall] = useState(false);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Instantiate the Audio object only on the client side
      ringtoneRef.current = new Audio('/assets/sounds/ringtone.mp3');
    }
  }, []);

  const handleAccept = () => {
    onAccept();
    setIsOnCall(true);
    ringtoneRef.current?.pause();
  };

  const handleReject = () => {
    onReject();
    setIsOnCall(false);
    ringtoneRef.current?.pause();
  };

  const handleEndCall = () => {
    onEndCall();
    setIsOnCall(false);
    ringtoneRef.current?.pause();
  };

  useEffect(() => {
    if (incomingCall && !isOnCall) {
      ringtoneRef.current?.play();
    }

    return () => {
      ringtoneRef.current?.pause();
      if (ringtoneRef.current) {
        ringtoneRef.current.currentTime = 0;
      }
    };
  }, [incomingCall, isOnCall]);

  return (
    <div>
      {incomingCall && !isOnCall && (
        <div className="bg-gray-200 p-2 flex justify-between items-center">
          <span className="text-black">Chamada recebida...</span>
          <div className="flex">
            <button onClick={handleAccept} className="bg-green-500 text-white p-2 rounded-l">
              <FiPhoneIncoming size={20} /> Aceitar
            </button>
            <button onClick={handleReject} className="bg-red-500 text-white p-2 rounded-r">
              Recusar
            </button>
          </div>
        </div>
      )}

      {isOnCall && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Em chamada...</h2>
            <button onClick={handleEndCall} className="bg-red-500 text-white p-2 rounded">
              <FiPhoneOff size={20} /> Finalizar Chamada
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallAction;