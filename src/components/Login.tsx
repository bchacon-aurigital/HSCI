import React, { useState } from 'react';

interface LoginProps {
  onLogin: (codigo: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validCodes = ['codigo1', 'codigo2', 'codigo3'];
    if (validCodes.includes(codigo)) {
      setError(null);
      onLogin(codigo); 
    } else {
      setError('Código incorrecto');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[90vh]">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ingrese el código de la ASADA"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="p-2 border border-gray-300 rounded text-black"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Entrar</button>
      </form>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default Login;
