import React, { useState } from 'react';
import { FiBell, FiSettings, FiUsers } from 'react-icons/fi'; // Ícone para o botão de amigos
import {IoIosLogOut} from 'react-icons/io';
import FriendList from './FriendList'; // Importa o FriendList
import PedingFriends from './PendingFriends';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_KEY;

interface FriendListToggleProps {
  onFriendSelect: (friendId: number) => void;
  onCallFriend: (friendId: number) => void;
}

const FriendListToggle: React.FC<FriendListToggleProps> = ({ onFriendSelect, onCallFriend }) => {
  const router = useRouter();
    const [isFriendListOpen, setIsFriendListOpen] = useState(false); // Controla se a lista de amigos está aberta ou fechada
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Controla se o painel de configurações está aberto
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // Controla se a barra de notificações está aberta
  
    // Alternar visibilidade da lista de amigos
    const toggleFriendList = () => {
      setIsFriendListOpen(!isFriendListOpen);
      setIsSettingsOpen(false); // Fechar outros painéis ao abrir este
      setIsNotificationsOpen(false);
    };
  
    // Alternar visibilidade do painel de configurações
    const toggleSettingsPanel = () => {
      setIsSettingsOpen(!isSettingsOpen);
      setIsFriendListOpen(false);
      setIsNotificationsOpen(false);
    };
  
    // Alternar visibilidade do painel de notificações
    const toggleNotificationsPanel = () => {
      setIsNotificationsOpen(!isNotificationsOpen);
      setIsFriendListOpen(false);
      setIsSettingsOpen(false);
    };

    const handleLogout = async () => {
      try {
        await axios.post(`${apiUrl}/logout`, {}, {
          withCredentials: true, // Certifique-se de que os cookies estão sendo enviados corretamente
        });
    
        // Redirecionar para a página de login após o logout
        router.push('/auth/login');
      } catch (error) {
        console.error('Falha ao fazer logout:', error);
      }
    };

    return (
        <div className="flex items-start space-x-4"> {/* Flexbox horizontal com espaçamento entre ícones */}
          {/* Botão de ícone para expandir/colapsar a lista de amigos */}
          <div className="flex flex-col space-y-4"> {/* Flexbox vertical com espaçamento entre os ícones */}
            {/* Botão de ícone para expandir/colapsar a lista de amigos */}
            <button
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
              onClick={toggleFriendList}
            >
              <FiUsers size={24} /> {/* Ícone de usuários */}
            </button>
      
            {/* Botão de ícone para expandir/colapsar as configurações */}
            <button
              className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 focus:outline-none"
              onClick={toggleSettingsPanel}
            >
              <FiSettings size={24} /> {/* Ícone de configurações */}
            </button>
      
            {/* Botão de ícone para expandir/colapsar notificações */}
            <button
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none"
              onClick={toggleNotificationsPanel}
            >
              <FiBell size={24} /> {/* Ícone de notificações */}
            </button>

              {/* Botão de ícone para expandir/colapsar notificações */}
              <button
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
              onClick={handleLogout}
            >
              <IoIosLogOut size={24} /> {/* Ícone de notificações */}
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
             {isNotificationsOpen && (
            <div className="ml-4">
              <PedingFriends 
                onFriendSelect={onFriendSelect} 
                //onCallFriend={onCallFriend}
              />
            </div>
          )}
        </div>
      );
    };
export default FriendListToggle;
