"use client"; 
import React from 'react';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <Header />
            <main className="flex-grow flex flex-col justify-center items-center">
                <h2 className="text-black font-semibold mb-4">Bem-vindo ao TalkConnect!</h2>
                <p className="text-gray-700 mb-8 text-center">
                    Conecte-se com seus amigos e familiares através do nosso chat fácil de usar.
                </p>
                <div className="flex space-x-4">
                    {/* Botão de Cadastro */}
                    <button
                        onClick={() => router.push('/auth/register')} // Altere para a rota correta
                        className="bg-green-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-700 transition duration-300"
                    >
                        Cadastro
                    </button>

                    {/* Botão de Login */}
                    <button
                        onClick={() => router.push('/auth/login')} // Altere para a rota correta
                        className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;