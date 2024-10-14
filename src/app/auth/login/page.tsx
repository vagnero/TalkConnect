"use client"; // Adicione esta linha

import AuthForm from '../../../../components/AuthForm';
import { useRouter } from 'next/navigation';
import { BasicButton } from '../../../../components/Button';
const apiUrl = process.env.NEXT_PUBLIC_API_KEY;

import axios from 'axios';
const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async (username: string, password: string) => {
  
    try {
      const response = await axios.post(`${apiUrl}/auth/authenticate`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Permite que cookies sejam enviados e recebidos

      });
  
      // Verifica se a resposta é bem-sucedida
      if (response.status === 200) {
          try {
            const response = await axios.get(`${apiUrl}/user/getid`, {
              withCredentials: true,
            });
            console.log("TESTEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE: " +response.data)
            localStorage.setItem('userId', response.data);
          } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
          }
        
            router.push('/chat'); // Redireciona após login bem-sucedido
      } else {
        console.error('Login falhou');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
   
        <div>
          <AuthForm onSubmit={handleLogin} />
        </div>
  );
};

export default LoginPage;