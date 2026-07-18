import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ onLoginSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoginMode && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (isLoginMode) {
        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          password,
        });
        localStorage.setItem("token", res.data.token);
        onLoginSuccess();
      } else {
        const res = await axios.post(`${API_URL}/api/auth/register`, {
          name,
          email,
          password,
        });
        alert("Account created! Please login.");
        setIsLoginMode(true);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[430px] bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl text-white">
      <div className="text-center mb-7">
        <h2 className="text-3xl font-bold tracking-tight">
          {isLoginMode ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-zinc-500 mt-2 text-sm">
          {isLoginMode ? "Sign in to continue reviewing your code" : "Create an account to get started"}
        </p>
      </div>

      <div className="relative flex h-12 mb-7 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
        <div className={`absolute top-0 h-full w-1/2 bg-zinc-700 rounded-lg transition-all duration-300 ${isLoginMode ? "left-0" : "left-1/2"}`} />
        <button type="button" onClick={() => setIsLoginMode(true)} className={`relative z-10 w-1/2 font-medium transition-colors ${isLoginMode ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
          Login
        </button>
        <button type="button" onClick={() => setIsLoginMode(false)} className={`relative z-10 w-1/2 font-medium transition-colors ${!isLoginMode ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
          Sign Up
        </button>
      </div>

      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLoginMode && (
          <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)}
            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700/50 transition" />
        )}

        <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700/50 transition" />

        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700/50 transition" />

        {!isLoginMode && (
          <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700/50 transition" />
        )}

        <button type="submit" disabled={loading}
          className="w-full p-3.5 bg-white text-black rounded-xl text-base font-semibold hover:bg-zinc-200 active:scale-[0.99] transition-all disabled:opacity-50">
          {loading ? "Please wait..." : isLoginMode ? "Login" : "Create Account"}
        </button>

        <p className="text-center text-sm text-zinc-500 pt-2">
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="text-white font-medium hover:underline">
            {isLoginMode ? "Sign up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;