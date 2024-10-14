import React, { useState } from 'react';
import { BasicButton } from './Button';
import Link from "next/link";

type AuthFormProps = {
  onSubmit: (username: string, password: string) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="text-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 space-y-6">
          <h1 className="text-lg text-center font-bold mb-4">Faça o login</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center items-center">
            <BasicButton label="Login"/>
          </div>
          
        </form>
 {/* Texto clicável para redirecionar para a página de cadastro */}
 
 <p className="text-center text-gray-700 text-sm mt-6">
  Não tem uma conta?{' '}
  <span className="bg-transparent hover:bg-blue-300 text-black font-semibold py-1 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ease-in-out">
  <Link href="/auth/register">Cadastre-se aqui</Link>
  </span>
</p>
        
        <p className="text-center text-gray-500 text-xs">
          &copy;2024 Acme Corp. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
