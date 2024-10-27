import React, { useEffect, useState } from 'react';
import { FiPhone } from 'react-icons/fi';

interface Conference {
  name: string;
  id: number;
}

interface ConferenceListProps {
  onConferenceSelect: (conferenceId: number) => void; // O método para selecionar uma conferência
  onCallConference: (conferenceId: number) => void; // O método para chamada de conferência
}

const ConferenceList: React.FC<ConferenceListProps> = ({ onConferenceSelect, onCallConference }) => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [activeTab, setActiveTab] = useState<'room'>('room');

  

  useEffect(() => {
    // Função para buscar as salas iniciais
    const fetchConferences = () => {
      const response = [
        { name: "Bate Papo", id: 7000 },
        { name: "Jogos", id: 7001 }
      ];
      setConferences(response);
    };

    fetchConferences();
  }, []);

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 font-bold ${activeTab === 'room' ? 'bg-blue-500 text-black' : 'bg-stone-700'}`}
          onClick={() => setActiveTab('room')}
        >
          Salas
        </button>
      </div>

      {activeTab === 'room' && (
        <ul>
          {conferences.map(room => (
            <li key={room.id} className="p-2 hover:bg-gray-200 cursor-pointer">
              <div className="flex font-bold text-black justify-between items-center">
                {/* Clique no nome da sala para abrir */}
                <span onClick={() => onConferenceSelect(room.id)} className="cursor-pointer">
                  {room.name}
                </span>
                {/* Botão de chamada com ícone de telefone */}
                <button
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique no ícone também selecione a sala
                    onCallConference(room.id);
                  }}
                >
                  <FiPhone size={20} className="text-green-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConferenceList;
