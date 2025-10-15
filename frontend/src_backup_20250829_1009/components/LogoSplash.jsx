// src/components/LogoSplash.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoSplash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate('/app/dashboard', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSkip = () => {
    navigate('/app/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
      {/* Racing stripes animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-2 bg-gradient-to-b from-red-500 to-blue-500 transform -skew-x-12 animate-pulse"
              style={{
                left: `${i * 12}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main logo container */}
      <div className="relative z-10 text-center">
        {/* Animated logo */}
        <div className="mb-8 animate-bounce">
          <div className="bg-red-600 p-8 rounded-full shadow-2xl border-4 border-white/20 mx-auto w-32 h-32 flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-white animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
          </div>
        </div>

        {/* Company name with gradient text */}
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter">
          <span className="bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent animate-pulse">
            Eddie's
          </span>
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
          <span className="text-red-500">Automotive</span>
        </h2>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-blue-300 italic mb-2 animate-fade-in">
          "Fast Eddie" Professional Auto Service
        </p>
        <p className="text-lg text-red-300 mb-8 animate-fade-in">
          🏁 Racing Speed, Professional Results
        </p>

        {/* Loading animation */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="text-white text-lg">Loading Dashboard...</p>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="text-blue-300 hover:text-white transition-colors text-sm underline underline-offset-2"
        >
          Skip to Dashboard →
        </button>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LogoSplash;
