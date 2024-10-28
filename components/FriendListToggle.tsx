import React, { useState } from 'react';
import { FiBell, FiUsers } from 'react-icons/fi'; 
import { PiUsersThreeFill } from "react-icons/pi";
import { IoIosLogOut } from 'react-icons/io';
import FriendList from './FriendList'; 
import PendingFriends from './PendingFriends';
import ConferenceList from './ConferenceList';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_KEY;

interface FriendListToggleProps {
  onFriendSelect: (friendId: number) => void;
  onCallFriend: (friendId: number) => void;
  onConferenceSelect: (conferenceId: number) => void; 
  onCallConference: (conferenceId: number) => void; 
}

const FriendListToggle: React.FC<FriendListToggleProps> = ({ onFriendSelect, onCallFriend, onConferenceSelect, onCallConference }) => {
  const router = useRouter();
  const [isFriendListOpen, setIsFriendListOpen] = useState(false); 
  const [isConferenceOpen, setIsConferenceOpen] = useState(false); 
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); 

  const toggleFriendList = () => {
    setIsFriendListOpen(!isFriendListOpen);
    setIsConferenceOpen(false);
    setIsNotificationsOpen(false);
  };

  const toggleConferencePanel = () => {
    setIsConferenceOpen(!isConferenceOpen);
    setIsFriendListOpen(false);
    setIsNotificationsOpen(false);
  };

  const toggleNotificationsPanel = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsFriendListOpen(false);
    setIsConferenceOpen(false);
  };


  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/logout`, {}, {
        withCredentials: true,
      });
      router.push('/auth/login');
    } catch (error) {
      console.error('Falha ao fazer logout:', error);
    }
  };

  return (
    <div className="flex items-start space-x-4"> 
      <div className="flex flex-col space-y-4"> 
        <button
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
          onClick={toggleFriendList}
        >
          <FiUsers size={24} />
        </button>
      
        <button
          className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none"
          onClick={toggleConferencePanel}
        >
          <PiUsersThreeFill size={24} />
        </button>
      
        <button
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none"
          onClick={toggleNotificationsPanel}
        >
          <FiBell size={24} />
        </button>

        <button
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
          onClick={handleLogout}
        >
          <IoIosLogOut size={24} />
        </button>
      </div>

      {/* Mostrar o FriendList se estiver aberto */}
      {isFriendListOpen && (
        <div className="ml-4">
          <FriendList 
            onFriendSelect={onFriendSelect} 
            onCallFriend={onCallFriend}
          />
        </div>
      )}

      {/* Mostrar PendingFriends se estiver aberto */}
      {isNotificationsOpen && (
        <div className="ml-4">
          <PendingFriends 
            onFriendSelect={onFriendSelect} 
          />
        </div>
      )}

      {/* Mostrar ConferenceList se estiver aberto */}
      {isConferenceOpen && (
        <div className="ml-4">
          <ConferenceList 
            onConferenceSelect={onConferenceSelect} // Passa a nova função para seleção
            onCallConference={onCallConference}
          />
        </div>
      )}

     
    </div>
  );
};

export default FriendListToggle;
