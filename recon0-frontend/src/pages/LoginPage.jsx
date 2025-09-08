import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '/src/lib/apiService.js'; // Corrected import path
import { LoaderCircle } from 'lucide-react';

// A simple, reusable Logo component for consistency
function Logo() {
  return (
    <div className="text-center mb-6">
      <Link to="/" className="text-3xl font-bold text-slate-800 tracking-wider">
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
        <div className="min-h-screen bg-slate-200 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <Logo />
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">Welcome Back!</h2>
                <p className="text-center text-slate-500 mb-8">Log in to your account to continue.</p>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Corrected typo here
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-opacity"
                        >
                            {loading ? <LoaderCircle className="animate-spin" /> : 'Log In'}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

