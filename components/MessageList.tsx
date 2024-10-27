// components/MessageList.tsx
import React, { useEffect, useState  } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';

import SockJS from 'sockjs-client';
const apiUrl = process.env.NEXT_PUBLIC_API_KEY;

interface Sender {
  id: number;
  name: string;
  username: string;
}

interface Receiver {
  id: number;
  name: string;
  username: string;
}

interface Message {
  id: number;
  createdAt: string; // Data de criação
  content: string;
  isRead: boolean; // Se a mensagem foi lida
  sender: Sender; // Objeto do remetente
  receiver: Receiver; // Objeto do receptor
}

interface MessageListProps {
  friendId: number;
}

const MessageList: React.FC<MessageListProps> = ({ friendId }) => {
   // Inicializar o cliente SIP ao montar o componente
  // const sipClientRef = useRef<SipClient | null>(null); // Referência da classe SipClient
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>(''); // Estado para nova mensagem
  //const [incomingCall, setIncomingCall] = useState<boolean>(false); // Estado para chamadas recebidas
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    // Função para buscar as mensagens iniciais
    const fetchMessages = async () => {
      try {
        console.log("ID do amigo: "+friendId);
        const response = await axios.get(`${apiUrl}/message/get/${friendId}`, {
          withCredentials: true,
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      }
    };

    fetchMessages();

    console.log("USER ID: "+ userId)
  // Inicializar o cliente SIP ao montar o componente
  // sipClientRef.current = new SipClient(userId || '', '1234', () => {
  //   setIncomingCall(true); // Atualiza o estado para indicar uma chamada recebida
  // });
    // Configurar o WebSocket para ouvir novas mensagens
    const socket = new SockJS(`${apiUrl}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      // Assinar o canal de mensagens específico para o friendId
      stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        //Só adiciona a mensagem na lista se o id de quem envia for igual ao id do chat aberto (friendId)
        if (newMessage.sender.id === friendId || newMessage.receiver.id === friendId) {
          setMessages((prevMessages) => [...prevMessages, newMessage]); 
        }
      });
    };

    stompClient.activate();

    // Limpeza ao desmontar
    return () => {
      stompClient.deactivate();
    };
  }, [friendId]);

  // Função para enviar a nova mensagem
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    if (newMessage.trim() === '') return; // Verifica se a mensagem não está vazia

    try {
      const response = await axios.post(
        `${apiUrl}/message/send/${friendId}`,
        {
          content: newMessage,
        },
        {
          withCredentials: true,
        }
      );

      // A nova mensagem também pode ser tratada aqui localmente
      setMessages([...messages, response.data]); // Adiciona a nova mensagem à lista
      setNewMessage(''); // Limpa o campo de input
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
    }
  };

  // Ordena as mensagens pela data de criação
  const sortedMessages = messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow overflow-y-auto bg-white p-4">
        <h2 className="text-2xl text-black font-bold mb-4">Mensagens</h2>
        <ul className="flex flex-col">
          {sortedMessages.map((message) => (
            <li key={message.id} className={`p-2 text-black ${message.sender.id === friendId ? 'text-left' : 'text-right'}`}>
              <div>
                <strong className="text-black">{message.sender.username}:</strong> {message.content}
                <span className={`ml-2 ${message.isRead ? 'text-green-500' : 'text-red-500'}`}>
                  {message.isRead ? 'Lida' : 'Não lida'}
                </span>
              </div>
              <small className="text-gray-500">{new Date(message.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>

      {/* Formulário para enviar nova mensagem */}
      <form onSubmit={handleSendMessage} className="flex p-2 bg-white  text-black">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="border rounded-l p-2 flex-grow"
        />
  
        <button type="submit" className="bg-blue-500 text-white rounded-r p-2">Enviar</button>
      </form>
    </div>
  );
};





export default MessageList;