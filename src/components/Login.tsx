import { useState } from 'react';
import { LogIn, Lock, User, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (username === 'test123' && password === 'test123') {
        setIsLoading(false);
        onLogin();
      } else {
        setIsLoading(false);
        setError('Invalid username or password');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Starry Night Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950">
        {/* Stars */}
        {Array.from({ length: 200 }).map((_, i) => {
          const size = Math.random() * 2 + 1;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const opacity = Math.random() * 0.8 + 0.2;
          const delay = Math.random() * 3;
          
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                opacity: opacity,
                animationDelay: `${delay}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity})`,
              }}
            />
          );
        })}
        
        {/* Larger stars/twinkles */}
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 3 + 2;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const opacity = Math.random() * 0.6 + 0.4;
          
          return (
            <div
              key={`large-${i}`}
              className="absolute rounded-full bg-white"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                opacity: opacity,
                boxShadow: `0 0 ${size * 3}px rgba(255, 255, 255, ${opacity * 0.8}), 0 0 ${size * 6}px rgba(147, 51, 234, 0.3)`,
                animation: `twinkle ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          );
        })}

        {/* Nebula/Galaxy effect */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
              top: '20%',
              left: '10%',
            }}
          />
          <div 
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
              bottom: '20%',
              right: '10%',
            }}
          />
        </div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div 
          className="w-full max-w-md backdrop-blur-md border rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            borderColor: 'rgba(147, 51, 234, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px rgba(147, 51, 234, 0.2)',
          }}
        >
          {/* Header */}
          <div 
            className="px-8 py-6 border-b text-center"
            style={{
              borderBottomColor: 'rgba(147, 51, 234, 0.2)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Mine Analysis Dashboard</h1>
            </div>
            <p className="text-sm text-gray-400">Access the control center</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  style={{
                    borderColor: 'rgba(147, 51, 234, 0.3)',
                  }}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  style={{
                    borderColor: 'rgba(147, 51, 234, 0.3)',
                  }}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>
              {/* Password Reference/Hint */}
              <p className="mt-2 text-xs text-gray-500 italic flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Reference: Username and password are the same
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>

            {/* Demo Credentials Hint */}
            <div className="pt-4 border-t" style={{ borderTopColor: 'rgba(147, 51, 234, 0.2)' }}>
              <p className="text-xs text-center text-gray-500">
                Demo credentials: <span className="text-purple-400 font-mono">test123 / test123</span>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Add twinkle animation */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
