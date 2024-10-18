// pages/index.tsx
"use client"; 
import React, { useEffect, useRef, useState } from 'react';
import MessageList from '../../../components/MessageList';
import SipClient from '../jssip/SipCliente';
import Header from '../../../components/Header';
import CallAction from '../../../components/CallActionProps';
import FriendListToggle from '../../../components/FriendListToggle';

const Home: React.FC = () => {
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [incomingCall, setIncomingCall] = useState<boolean>(false); // Estado para chamadas recebidas
  const [userId, setUserId] = useState<string | null>(null); // Estado para armazenar o userId
  const [isOnCall, setIsOnCall] = useState<boolean>(false); // Adiciona o estado de "em chamada"

  const sipClientRef = useRef<SipClient | null>(null); // Referência da classe SipClient

  // useEffect para garantir que o código é executado no lado do cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId); // Armazena o userId no estado
    }
  }, []);

  useEffect(() => {
    if (userId) {
      sipClientRef.current = new SipClient(userId, '1234', () => {
        setIncomingCall(true); // Configura o estado quando há uma chamada recebida
      });
    }
  }, [userId]);

  const handleFriendSelect = (friendId: number) => {
    setSelectedFriendId(friendId);
  };

  const handleCallFriend = (friendId: number) => {
    if (sipClientRef.current) {
      sipClientRef.current.makeCall(friendId.toString()); // Faz uma chamada SIP para o ID do amigo
      setIsOnCall(true); // Configura o estado para "em chamada"
    }
  };

  const handleAcceptCall = () => {
    sipClientRef.current?.answerCall();
    setIncomingCall(false); // Reseta o estado da chamada recebida
    setIsOnCall(true); // Configura o estado para "em chamada"
  };

  const handleRejectCall = () => {
    sipClientRef.current?.rejectCall();
    setIncomingCall(false); // Reseta o estado da chamada recebida
  };

  const handleEndCall = () => {
    sipClientRef.current?.endCall();
    setIsOnCall(false); // Reseta o estado quando a chamada terminar
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow pt-16">
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

      <CallAction
        incomingCall={incomingCall}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
        onEndCall={handleEndCall}
      />

      {isOnCall && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white">
          <div className="text-center">
            <h2 className="text-2xl mb-4">Em chamada...</h2>
            <button onClick={handleEndCall} className="bg-red-500 text-white p-2 rounded">
              Finalizar Chamada
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
