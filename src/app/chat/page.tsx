'use client';
// pages/index.tsx
import React, { useEffect, useRef, useState } from 'react';
import MessageList from '../../../components/MessageList';
import SipClient from '../jssip/SipCliente';
import Header from '../../../components/Header';
import CallAction from '../../../components/CallActionProps';
import FriendListToggle from '../../../components/FriendListToggle';


const userId = localStorage.getItem('userId');
console.log("ID DO USUARIOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO: "+userId);
const Home: React.FC = () => {
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [incomingCall, setIncomingCall] = useState<boolean>(false); // Estado para chamadas recebidas
  const [userId, setUserId] = useState<string | null>(null); // Estado para armazenar o userId

  const sipClientRef = useRef<SipClient | null>(null); // Referência da classe SipClient

   // useEffect para garantir que o código é executado no lado do cliente
   useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      console.log("ID DO USUARIOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO: " + storedUserId);
      setUserId(storedUserId); // Armazena o userId no estado
    }
  }, []);

  useEffect(() => {
    if (userId) {
      sipClientRef.current = new SipClient(userId, '1234', () => {
        setIncomingCall(true);
      });
    }
  }, [userId]);
  const handleFriendSelect = (friendId: number) => {

    setSelectedFriendId(friendId);
  };
  

  // Função para ligar para um amigo
  const handleCallFriend = (friendId: number) => {
    if (sipClientRef.current) {
      sipClientRef.current.makeCall(friendId.toString()); // Faz uma chamada SIP para o ID do amigo
    }
  };

  // Função para aceitar a chamada
  const handleAcceptCall = () => {
    sipClientRef.current?.answerCall();
    setIncomingCall(false); // Reseta o estado da chamada recebida
  };

  // Função para recusar a chamada
  const handleRejectCall = () => {
    sipClientRef.current?.rejectCall();
    setIncomingCall(false); // Reseta o estado da chamada recebida
  };

  const handleEndCall = () => {
    sipClientRef.current?.endCall();
  };
  


  return (
    <div className="flex flex-col h-screen">
      {/* Certifique-se de que o Header tenha altura fixa */}
      <Header />
      {/* Adiciona padding no topo igual à altura do Header */}
      <div className="flex flex-grow pt-16"> {/* pt-16 ajusta o conteúdo abaixo do header */}
      <FriendListToggle 
          onFriendSelect={handleFriendSelect} 
          onCallFriend={handleCallFriend}
        />
        {selectedFriendId ? (
          <MessageList friendId={selectedFriendId} />
        ) : (
          <div className="flex-grow bg-gray-200 flex items-center justify-center">
            <p className="text-xl text-gray-600">Selecione um amigo para ver as mensagens</p>
          </div>
        )}
   
      </div>
               {/* Se houver uma chamada recebida, exibir os botões */}
         {/* Componente CallAction para gerenciar chamadas */}
         <CallAction
        incomingCall={incomingCall}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
        onEndCall={handleEndCall}
      />
    </div>
  );
};
export default Home;
