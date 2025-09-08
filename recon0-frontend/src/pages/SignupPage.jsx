import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Building2, UploadCloud, LoaderCircle } from "lucide-react";
import {
  register,
  uploadAvatar,
  uploadOrgLogo,
  removeToken,
} from "../lib/apiService.js";

// A small component for the logo, consistent with the landing page.
function Logo() {
    return (
        <div className="text-center mb-6">
            <Link to="/" className="text-3xl font-bold text-slate-800 tracking-wider">
                RECON<span className="text-blue-500">_0</span>
            </Link>
        </div>
    );
}

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] =useState("hacker");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await register({ email, password, username, fullName, role });
      if (result.success && avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadFunction = role === "organization" ? uploadOrgLogo : uploadAvatar;
        await uploadFunction(formData);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <Logo />
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">Welcome!</h2>
        <p className="text-center text-slate-500 mb-8">Create your account to get started.</p>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selector */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setRole('hacker')} className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${role === 'hacker' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                        <User className={`h-8 w-8 mb-2 ${role === 'hacker' ? 'text-indigo-600' : 'text-slate-500'}`} />
                        <span className={`font-semibold ${role === 'hacker' ? 'text-indigo-600' : 'text-slate-700'}`}>Hacker</span>
                    </button>
                    <button type="button" onClick={() => setRole('organization')} className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${role === 'organization' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                        <Building2 className={`h-8 w-8 mb-2 ${role === 'organization' ? 'text-indigo-600' : 'text-slate-500'}`} />
                        <span className={`font-semibold ${role === 'organization' ? 'text-indigo-600' : 'text-slate-700'}`}>Organization</span>
                    </button>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Full Name</label>
                    <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
                    <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>

            {/* File Upload */}
            <div>
                 <label htmlFor="avatarFile" className="block text-sm font-medium text-slate-700">Profile Picture / Logo (Optional)</label>
                 <label htmlFor="avatarFile" className="mt-1 flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-indigo-400">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600">
                            <p className="pl-1">{fileName ? `File: ${fileName}` : "Click to upload a file"}</p>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input id="avatarFile" name="avatarFile" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
            </div>

            <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-opacity">
                    {loading ? <LoaderCircle className="animate-spin" /> : "Create Account"}
                </button>
            </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

