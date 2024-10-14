import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GiConfirmed } from 'react-icons/gi'; // Ícone de telefone
import { FiX } from 'react-icons/fi'; // Ícone de rejeição
const apiUrl = process.env.NEXT_PUBLIC_API_KEY;

interface Friend {
  id: number;
  username: string;
}

interface User {
  id: number;
  username: string;
}

interface FriendListProps {
  onFriendSelect: (friendId: number) => void;
}

const PedingFriends: React.FC<FriendListProps> = ({ onFriendSelect }) => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchFriendsRequests = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/friendsrequests`, {
          withCredentials: true,
        });
        setFriends(response.data);
      } catch (error) {
        console.error("Erro ao buscar pedidos de amizade:", error);
      }
    };

    fetchFriendsRequests();
  }, []);

  // Função para aceitar pedido de amizade
  const acceptFriendRequest = async (userId: number) => {
    try {
      await axios.patch(
        `${apiUrl}/friendship/accept/${userId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      alert("Pedido de amizade aceito!");
      
      // Remover o amigo aceito da lista de pedidos pendentes
      setFriends(prevFriends => prevFriends.filter(friend => friend.id !== userId));
    } catch (error) {
      console.error("Erro ao aceitar pedido de amizade:", error);
    }
  };

  // Função para recusar pedido de amizade
  const declineFriendRequest = async (userId: number) => {
    try {
      await axios.patch(
        `${apiUrl}/friendship/decline/${userId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      alert("Pedido de amizade recusado!");
      // Remover o amigo recusado da lista de pedidos pendentes
      setFriends(prevFriends => prevFriends.filter(friend => friend.id !== userId));
    } catch (error) {
      console.error("Erro ao recusar pedido de amizade:", error);
    }
  };

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <ul>
        {friends.map(friend => (
          <li key={friend.id} className="p-2 hover:bg-gray-200 cursor-pointer">
            <div className="flex font-bold text-black justify-between items-center">
              {/* Clique no nome do amigo para abrir o chat */}
              <span onClick={() => onFriendSelect(friend.id)} className="cursor-pointer">
                {friend.username}
              </span>

              <div className="flex items-center space-x-2">
                {/* Botão para aceitar o pedido de amizade */}
                <button
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique no ícone também selecione o amigo
                    acceptFriendRequest(friend.id);
                  }}
                >
                  <GiConfirmed size={20} className="text-green-500" />
                </button>

                {/* Botão para recusar o pedido de amizade */}
                <button
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique no ícone também selecione o amigo
                    declineFriendRequest(friend.id);
                  }}
                >
                  <FiX size={20} className="text-red-500" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PedingFriends;