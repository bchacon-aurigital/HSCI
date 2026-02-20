import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (codigo: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const validCodes = ['codigo1', 'asroa2537', 'codigo2', 'alajuela2025', 'coyol2025', 'catsa2025', 'AQG2025', 'zapotal2025', 'sanmarcanda2025', 'belen2025', 'ACP2026', 'villasol2026'];
      if (validCodes.includes(codigo)) {
        setError(null);
        onLogin(codigo);
      } else {
        setError('Código incorrecto');
      }
      setIsLoading(false);
    }, 700);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Componente del logo WATA usando la imagen
  const WataLogo = () => (
    <div className="w-full h-32 flex items-center justify-center">
      <img 
        src="/assets/wata-logo.png"
        alt="WATA Logo"
        className="w-full h-full object-contain filter drop-shadow-lg"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))',
          minHeight: '120px'
        }}
      />
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] px-4">
      <div 
        className={`w-full max-w-md bg-[#172236] rounded-lg shadow-2xl p-8 border border-blue-400/10 ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } transition-all duration-700 ease-out`}
      >
        {/* Logo WATA */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-sm">
            {/* Efecto de resplandor */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-[#1a2a42] to-[#0f1829] p-8 rounded-2xl border border-blue-500/20">
              <WataLogo />
            </div>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Control de Sistemas Hídricos
          </h2>
          <p className="text-blue-100 mt-2">Acceso seguro a su sistema de monitoreo</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Código de acceso"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="relative w-full p-4 pr-12 bg-[#1a2a42] border border-blue-500/30 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100 transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
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
            Centro de Control HCSI CR • Gestión Responsable del Agua
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;