"use client"; // Adicione esta linha

import RegisterForm from '../../../../components/RegisterForm';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_KEY;

const RegisterPage = () => {
  const router = useRouter();

  const handleRegister = async (name: string, username: string, password: string, role: string) => {
  
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, {
        name,
        username,
        password,
        role,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Verifica se a resposta é bem-sucedida
      if (response.status === 201) {
        router.push('/auth/login'); // Redireciona após cadastro bem-sucedido
      } else {
        console.error('Cadastro falhou');
      }
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
    }
  };
  return (
   
        <div>
          <RegisterForm onSubmit={handleRegister} />
        </div>
  );
};

export default RegisterPage;