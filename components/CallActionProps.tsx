// CallAction.tsx
import React, { useEffect, useState } from 'react';
import { FiPhoneOff, FiPhoneIncoming } from 'react-icons/fi'; // Ícones para finalizar e aceitar chamada


interface CallActionProps {
  onAccept: () => void;   // Função para aceitar a chamada
  onReject: () => void;   // Função para recusar a chamada
  onEndCall: () => void;  // Função para finalizar a chamada
  incomingCall: boolean;  // Estado que indica se há uma chamada recebida
}

const CallAction: React.FC<CallActionProps> = ({ onAccept, onReject, onEndCall, incomingCall }) => {
  const [isOnCall, setIsOnCall] = useState(false); // Estado para verificar se a chamada foi aceita
  const ringtone = new Audio('/assets/sounds/ringtone.mp3');

  // Função para aceitar a chamada
  const handleAccept = () => {
    onAccept();         // Chama a função passada por props
    setIsOnCall(true);  // Atualiza o estado para "em chamada"
    ringtone.pause();   // Para o ringtone
  };

  // Função para recusar a chamada
  const handleReject = () => {
    onReject();         // Chama a função de recusar chamada
    setIsOnCall(false); // Garante que o estado volte ao normal
    ringtone.pause();   // Para o ringtone
  };

  // Função para finalizar a chamada
  const handleEndCall = () => {
    onEndCall();        // Chama a função de finalizar chamada
    setIsOnCall(false); // Reseta o estado de "em chamada"
    ringtone.pause();   // Para o ringtone
  };

  useEffect(() => {
    if (incomingCall && !isOnCall) {
      ringtone.play(); // Toca o som quando a chamada é recebida
    }

    // Limpa o efeito para parar o som quando o componente for desmontado ou a chamada for aceita/rejeitada
    return () => {
      ringtone.pause(); // Para o som ao desmontar
      ringtone.currentTime = 0; // Reseta o tempo do áudio
    };
  }, [incomingCall, isOnCall]); // Executa quando `incomingCall` ou `isOnCall` mudar


  return (
    <div>
      {/* Se houver uma chamada recebida e não estiver em chamada ainda */}
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

      {/* Se a chamada estiver ativa, mostrar o estado de "em chamada" */}
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