import React from "react";
import Login from "./Components/Login";

const App = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 pt-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          AI Code Review{" "}
          <span className="text-zinc-400">Assistant</span>
        </h1>

        <p className="mt-3 text-zinc-500">
          Review smarter. Ship better code.
        </p>
      </div>

      <Login />
    </div>
  );
};

export default App;