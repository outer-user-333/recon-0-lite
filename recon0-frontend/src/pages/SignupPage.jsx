import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../lib/apiService';

const SignupPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('hacker'); // Default role
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const result = await register({ email, password, username, fullName, role });
            if (result.success) {
                setMessage('Registration successful! Please log in.');
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="card shadow-lg" style={{ width: '450px' }}>
                <div className="card-body p-5">
                    <h3 className="card-title text-center mb-4">Create Account</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {message && <div className="alert alert-success">{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        </div>
                         <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                         <div className="mb-3">
                            <label className="form-label">Sign up as:</label>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="role" id="roleHacker" value="hacker" checked={role === 'hacker'} onChange={(e) => setRole(e.target.value)} />
                                <label className="form-check-label" htmlFor="roleHacker">Hacker</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="role" id="roleOrg" value="organization" checked={role === 'organization'} onChange={(e) => setRole(e.target.value)} />
                                <label className="form-check-label" htmlFor="roleOrg">Organization</label>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="mt-3 text-center">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;