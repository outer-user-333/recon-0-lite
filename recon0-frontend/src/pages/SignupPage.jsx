import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Building2, UploadCloud, LoaderCircle } from "lucide-react";
import {
  register,
  uploadAvatar,
  uploadOrgLogo,
  removeToken,
} from "/src/lib/apiService.js";

// A small component for the logo, consistent with the landing page.
function Logo() {
  return (
    <div className="text-center mb-6">
      <Link to="/" className="text-4xl font-bold text-slate-900 tracking-wider">
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
  const [role, setRole] = useState("hacker");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [fileName, setFileName] = useState("");

  // Logic for handling file changes remains unchanged.
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setFileName(file.name);
    }
  };

  // Logic for form submission remains unchanged.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log(
        " States at register page from frontend =>",
        email,
        username,
        password,
        fullName
      );
      const result = await register({
        email,
        password,
        username,
        fullName,
        role,
      });

      console.log("result from signup => ", result);

      if (result.success && avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadFunction =
          role === "organization" ? uploadOrgLogo : uploadAvatar;
        await uploadFunction(formData);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  return (
    // Clean slate background with colorful accent shapes
    <div className="min-h-screen bg-slate-200 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Distinct colorful floating shapes */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500 rounded-full opacity-80 animate-pulse"></div>
      <div className="absolute top-32 right-32 w-24 h-24 bg-orange-500 rounded-lg rotate-45 opacity-70 animate-bounce"></div>
      <div className="absolute bottom-32 left-32 w-40 h-40 bg-rose-500 rounded-full opacity-60"></div>
      <div className="absolute bottom-20 right-20 w-28 h-28 bg-violet-500 rounded-lg rotate-12 opacity-70"></div>

      {/* Clean white form card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 relative z-10">
        <Logo />
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-1">
          Welcome!
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Create your account to get started.
        </p>

        {error && (
          <div
            className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 mb-6 rounded-lg shadow-sm"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selector with distinct colors */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("hacker")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                  role === "hacker"
                    ? "border-emerald-500 bg-emerald-500 text-white ring-4 ring-emerald-200 shadow-lg transform scale-105"
                    : "border-slate-300 bg-white hover:bg-emerald-50 hover:border-emerald-300"
                }`}
              >
                <User
                  className={`h-8 w-8 mb-2 ${
                    role === "hacker" ? "text-white" : "text-emerald-500"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    role === "hacker" ? "text-white" : "text-emerald-600"
                  }`}
                >
                  Hacker
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("organization")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                  role === "organization"
                    ? "border-orange-500 bg-orange-500 text-white ring-4 ring-orange-200 shadow-lg transform scale-105"
                    : "border-slate-300 bg-white hover:bg-orange-50 hover:border-orange-300"
                }`}
              >
                <Building2
                  className={`h-8 w-8 mb-2 ${
                    role === "organization" ? "text-white" : "text-orange-500"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    role === "organization" ? "text-white" : "text-orange-600"
                  }`}
                >
                  Organization
                </span>
              </button>
            </div>
          </div>

          {/* Form Fields with distinct themed colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-slate-900"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 bg-blue-50 border-2 border-blue-300 rounded-lg shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-900"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 bg-violet-50 border-2 border-violet-300 rounded-lg shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-900"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-emerald-50 border-2 border-emerald-300 rounded-lg shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-900"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-rose-50 border-2 border-rose-300 rounded-lg shadow-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
            />
          </div>

          {/* File Upload with orange theme */}
          <div>
            <label
              htmlFor="avatarFile"
              className="block text-sm font-medium text-slate-900"
            >
              Profile Picture / Logo (Optional)
            </label>
            <label
              htmlFor="avatarFile"
              className="mt-1 flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-dashed border-orange-400 bg-orange-50 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-100 transition-all"
            >
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-orange-500" />
                <div className="flex text-sm text-orange-700">
                  <p className="pl-1">
                    {fileName ? `File: ${fileName}` : "Click to upload a file"}
                  </p>
                </div>
                <p className="text-xs text-orange-600">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                id="avatarFile"
                name="avatarFile"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
