import React, { useEffect, useState, useRef } from 'react';
import { FiPhoneOff, FiPhoneIncoming } from 'react-icons/fi';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FaExclamation } from "react-icons/fa";

interface CallActionProps {
  onAccept: () => void;
  onReject: () => void;
  onEndCall: () => void;
  incomingCall: boolean;
  isOnCall: boolean; // Adiciona isOnCall como prop
  isConferenceCall: boolean; // Nova prop para indicar se é uma chamada de conferência
}



const CallAction: React.FC<CallActionProps> = ({ 
  onAccept, 
  onReject, 
  onEndCall, 
  incomingCall, 
  isOnCall, 
  isConferenceCall 
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  console.log(isConferenceCall);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ringtoneRef.current = new Audio('/app/assets/sounds/sound.mp3');
    }
  }, []);

  useEffect(() => {
    if (incomingCall && !isOnCall && !isModalOpen) {
      if (ringtoneRef.current) {
        ringtoneRef.current.loop = true;
      }
      ringtoneRef.current?.play();
      setModalOpen(true);
    }
  }, [incomingCall, isOnCall, isModalOpen]);

  const handleAccept = () => {
    onAccept();
    setModalOpen(false);
    ringtoneRef.current?.pause();
  };

  const handleReject = () => {
    onReject();
    setModalOpen(false);
    ringtoneRef.current?.pause();
  };

  

  return (
    <div>
     {isOnCall && !isConferenceCall && (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white">
    <div className="text-center">
      <h2 className="text-2xl mb-4">Em chamada...</h2>
       {/* Vídeos Local e Remoto */}
       <div className="video-container mb-4">
        <video id="localVideo" autoPlay muted className="local-video w-40 h-40 border border-gray-300 rounded"></video>
        <video id="remoteVideo" autoPlay className="remote-video w-80 h-80 border border-gray-300 rounded"></video>
      </div>
      {/* O botão "Finalizar Chamada" só será exibido se não for uma chamada de conferência */}
      <button onClick={onEndCall} className="bg-red-500 text-white p-2 rounded">
        <FiPhoneOff size={20} /> Finalizar Chamada
      </button>
    </div>
  </div>
)}

      <Dialog open={isModalOpen} onClose={() => setModalOpen(false)} className="relative z-10">
        <DialogBackdrop transition className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaExclamation aria-hidden="true" className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Chamada recebida
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Você tem uma chamada de entrada. Deseja aceitá-la?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="mt-3 inline-flex flex-col items-center justify-center rounded-md bg-green-600 p-4 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:mt-0 sm:ml-40 sm:mr-10"
                >
                  <FiPhoneIncoming className="h-8 w-8" />
                  <span className="mt-1 text-sm">Aceitar</span>
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="mt-3 inline-flex flex-col items-center justify-center rounded-md bg-red-600 p-4 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:mt-0"
                >
                  <FiPhoneOff className="h-8 w-8" />
                  <span className="mt-1 text-sm">Recusar</span>
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CallAction;
