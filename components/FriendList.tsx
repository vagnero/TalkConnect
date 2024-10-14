import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiPhone } from 'react-icons/fi'; // Ícone de telefone
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
  onCallFriend: (friendId: number) => void; // Função para ligar para um amigo
}

const FriendList: React.FC<FriendListProps> = ({ onFriendSelect, onCallFriend }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'users'>('friends');

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/myfriends`, {
          withCredentials: true,
        });
        setFriends(response.data);
      } catch (error) {
        console.error("Erro ao buscar amigos:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/allusers`, {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchFriends();
    fetchUsers();
  }, []);

  const sendFriendRequest = async (userId: number) => {
    try {
      await axios.post(
        `${apiUrl}/friendship/create/${userId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      alert("Pedido de amizade enviado!");
    } catch (error) {
      console.error("Erro ao enviar pedido de amizade:", error);
    }
  };

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 font-bold ${activeTab === 'friends' ? 'bg-blue-500 text-black' : 'bg-stone-700'}`}
          onClick={() => setActiveTab('friends')}
        >
          Amigos
        </button>
        <button
          className={`flex-1 py-2 font-bold ${activeTab === 'users' ? 'bg-blue-500 text-black' : 'bg-stone-700'}`}
          onClick={() => setActiveTab('users')}
        >
          Todos os Usuários
        </button>
      </div>

      {activeTab === 'friends' ? (
        <ul>
          {friends.map(friend => (
            <li key={friend.id} className="p-2 hover:bg-gray-200 cursor-pointer">
              <div className="flex font-bold text-black justify-between items-center">
                {/* Clique no nome do amigo para abrir o chat */}
                <span onClick={() => onFriendSelect(friend.id)} className="cursor-pointer">{friend.username}</span>

                {/* Botão de chamada com ícone de telefone */}
                <button 
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique no ícone também selecione o amigo
                    onCallFriend(friend.id);
                  }}
                >
                  <FiPhone size={20} className="text-green-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id} className="p-2 hover:bg-gray-200 cursor-pointer">
              <div className="flex font-bold text-black justify-between items-center">
                {user.username}
                <button
                  className="bg-green-500 text-white px-2 py-1 text-sm rounded"
                  onClick={() => sendFriendRequest(user.id)}
                >
                  Adicionar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendList;