"use client"; 
import React, { useEffect, useRef, useState } from 'react';
import MessageList from '../../../components/MessageList';
import SipClient from '../jssip/SipCliente';
import Header from '../../../components/Header';
import CallAction from '../../../components/CallActionProps';
import FriendListToggle from '../../../components/FriendListToggle';
import ConferenceMessages from '../../../components/ConferenceMessages';

const Home: React.FC = () => {
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const [selectedConferenceId, setselectedConferenceId] = useState<number | null>(null);
  const [incomingCall, setIncomingCall] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isOnCall, setIsOnCall] = useState<boolean>(false);
  const [isConferenceCall, setIsConferenceCall] = useState<boolean>(false);



  const sipClientRef = useRef<SipClient | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
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
    console.log('Amigo selecionado:', friendId); // Log para verificar a seleção
    setSelectedFriendId(friendId);
    setselectedConferenceId(null); // Limpa a conferência ao selecionar um amigo
};

const handleConferenceSelect = (conferenceId: number) => {
    console.log('Conferência selecionada:', conferenceId); // Log para verificar a seleção
    setselectedConferenceId(conferenceId);
    setSelectedFriendId(null); // Limpa o amigo ao selecionar uma conferência
};

const handleCallFriend = (friendId: number) => {
  if (sipClientRef.current) {
    sipClientRef.current.makeCall(friendId.toString());
    setIsOnCall(true);
    setIsConferenceCall(false); // Chamadas para amigos são chamadas normais
  }
};



  const handleCallConference = (conferenceId: number) => {
    if (sipClientRef.current) {
      sipClientRef.current.makeCall(conferenceId.toString()); // Chame a conferência
      setIsOnCall(true);
      setIsConferenceCall(true); // Define que é uma chamada de conferência
    }
  };

  const handleAcceptCall = () => {
    sipClientRef.current?.answerCall();
    setIncomingCall(false);
    setIsOnCall(true);
  };

  const handleRejectCall = () => {
    sipClientRef.current?.rejectCall();
    setIncomingCall(false);
  };

  const handleEndCall = () => {
    sipClientRef.current?.endCall();
    setIsOnCall(false);
    setIsConferenceCall(false); // Reseta o estado após terminar a chamada
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow pt-16">
        <FriendListToggle 
          onFriendSelect={handleFriendSelect} 
          onCallFriend={handleCallFriend}
          onConferenceSelect={handleConferenceSelect}
          onCallConference={handleCallConference}
        />
        
        {/* Renderiza MessageList ou ConferenceMessages baseado na seleção */}
        {selectedFriendId ? (
  <MessageList friendId={selectedFriendId} />
) : selectedConferenceId ? (
  <ConferenceMessages conferenceId={selectedConferenceId} />
) : (
  <div className="flex-grow bg-gray-200 flex items-center justify-center">
    <p className="text-xl text-gray-600">Selecione um amigo ou conferência para ver as mensagens</p>
  </div>
)}
      </div>

      <CallAction
  incomingCall={incomingCall}
  onAccept={handleAcceptCall}
  onReject={handleRejectCall}
  onEndCall={handleEndCall}
  isOnCall={isOnCall}
  isConferenceCall={isConferenceCall}
/>

     
    </div>
  );
};

export default Home;
