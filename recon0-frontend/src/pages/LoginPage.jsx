import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '/src/lib/apiService.js'; // Corrected import path
import { LoaderCircle, Mail, Lock } from 'lucide-react';

// A simple, reusable Logo component for consistency
function Logo() {
  return (
    <div className="text-center mb-6">
      <Link to="/" className="text-4xl font-bold text-slate-900 tracking-wider">
        RECON<span className="text-blue-500">_0</span>
      </Link>
    </div>
  );
}

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login({ email, password });
            if (result.success && result.user) {
                if (result.user.role === 'admin') {
                    navigate('/admin/users');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Enhanced background with colorful gradient effects and floating shapes
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-violet-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Distinct colorful floating shapes - ensuring high contrast */}
            <div className="absolute top-16 left-16 w-40 h-40 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute top-24 right-24 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl rotate-45 opacity-80 animate-bounce"></div>
            <div className="absolute bottom-24 left-24 w-48 h-48 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full opacity-60"></div>
            <div className="absolute bottom-16 right-16 w-36 h-36 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl rotate-12 opacity-70"></div>
            <div className="absolute top-1/2 left-8 w-24 h-24 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full opacity-50 animate-ping"></div>
            <div className="absolute top-1/3 right-8 w-28 h-28 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl rotate-45 opacity-60"></div>
            
            {/* Enhanced form card with more pronounced styling */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 relative z-10 backdrop-blur-sm">
                <Logo />
                <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Welcome Back!</h2>
                <p className="text-center text-slate-500 mb-8">Log in to your account to continue.</p>

                {error && (
                    <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 mb-6 rounded-lg shadow-sm" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email field with icon and colorful styling */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-emerald-500" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full pl-10 pr-4 py-3 bg-emerald-50 border-2 border-emerald-300 rounded-lg shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Password field with icon and colorful styling */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-violet-500" />
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full pl-10 pr-4 py-3 bg-violet-50 border-2 border-violet-300 rounded-lg shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {/* Enhanced submit button */}
                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? <LoaderCircle className="animate-spin" /> : 'Log In'}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;