import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: (codigo: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const validCodes = ['codigo1', 'codigo2', 'codigo3'];
      if (validCodes.includes(codigo)) {
        setError(null);
        onLogin(codigo);
      } else {
        setError('Código incorrecto');
      }
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] px-4">
      <div 
        className={`w-full max-w-md bg-[#172236] rounded-lg shadow-2xl p-8 border border-blue-400/10 ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } transition-all duration-700 ease-out`}
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Bienvenido</h2>
          <p className="text-blue-100 mt-2">Ingrese el código de acceso de su ASADA</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <input
              type="text"
              placeholder="Código de acceso"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="relative w-full p-4 bg-[#1a2a42] border border-blue-500/30 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
              disabled={isLoading}
            />
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <button 
              type="submit" 
              className={`relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 transition-all duration-200 ease-in-out ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </span>
              ) : (
                <span className="inline-flex items-center justify-center">
                  Acceder
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg animate-pulse">
            <p className="font-medium flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}
        
        <div className="mt-8 text-center text-sm text-blue-200/70">
          <p>Si no tiene un código, por favor contacte al administrador</p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-blue-500/20 flex justify-center">
          <div className="text-xs text-blue-300/50 flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></div>
            Sistema de Administración HSCI
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;