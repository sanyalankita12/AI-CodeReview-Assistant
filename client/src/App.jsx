import React, { useState } from "react";
import Login from "./Components/Login";
import CodeSubmit from "./Components/CodeSubmit";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 pt-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          AI Code Review <span className="text-zinc-400">Assistant</span>
        </h1>
        <p className="mt-3 text-zinc-500">
          Review smarter. Ship better code.
        </p>
      </div>

      {isLoggedIn ? (
        <div className="w-full flex flex-col items-center">
          <button
            onClick={handleLogout}
            className="mb-4 text-sm text-zinc-500 hover:text-white transition"
          >
            Logout
          </button>
          <CodeSubmit />
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;