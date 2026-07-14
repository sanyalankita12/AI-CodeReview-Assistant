import React, { useState } from "react";

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="w-full max-w-[430px] bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl text-white">
      
      {/* Header */}
      <div className="text-center mb-7">
        <h2 className="text-3xl font-bold tracking-tight">
          {isLoginMode ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-zinc-500 mt-2 text-sm">
          {isLoginMode
            ? "Sign in to continue reviewing your code"
            : "Create an account to get started"}
        </p>
      </div>

      {/* Tab Controls */}
      <div className="relative flex h-12 mb-7 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
        {/* Sliding Background */}
        <div
          className={`absolute top-0 h-full w-1/2 bg-zinc-700 rounded-lg transition-all duration-300 ${
            isLoginMode ? "left-0" : "left-1/2"
          }`}
        />

        <button
          type="button"
          onClick={() => setIsLoginMode(true)}
          className={`relative z-10 w-1/2 font-medium transition-colors ${
            isLoginMode ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => setIsLoginMode(false)}
          className={`relative z-10 w-1/2 font-medium transition-colors ${
            !isLoginMode ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form className="space-y-4">
        {/* Name - Signup Only */}
        {!isLoginMode && (
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl
                       text-white placeholder-zinc-500 outline-none
                       focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700/50
                       transition"
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          required
          className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl
                     text-white placeholder-zinc-500 outline-none
                     focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700/50
                     transition"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl
                     text-white placeholder-zinc-500 outline-none
                     focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700/50
                     transition"
        />

        {/* Confirm Password - Signup Only */}
        {!isLoginMode && (
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl
                       text-white placeholder-zinc-500 outline-none
                       focus:border-zinc-500 focus:ring-2 focus:ring-zinc-700/50
                       transition"
          />
        )}

        {/* Forgot Password */}
        {isLoginMode && (
          <div className="text-right">
            <a
              href="#"
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              Forgot password?
            </a>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3.5 bg-white text-black rounded-xl
                     text-base font-semibold hover:bg-zinc-200
                     active:scale-[0.99] transition-all"
        >
          {isLoginMode ? "Login" : "Create Account"}
        </button>

        {/* Switch Mode */}
        <p className="text-center text-sm text-zinc-500 pt-2">
          {isLoginMode
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-white font-medium hover:underline"
          >
            {isLoginMode ? "Sign up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;