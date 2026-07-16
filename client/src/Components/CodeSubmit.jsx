import React, { useState } from "react";
import axios from "axios";

const CodeSubmit = () => {
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/projects",
        {
          project_name: projectName,
          code_content: code,
          language,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Code submitted successfully!");
      setProjectName("");
      setCode("");
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Something went wrong. Try again.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[600px] bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl text-white">
      <h2 className="text-2xl font-bold mb-6">Submit Code for Review</h2>

      {message && (
        <p className="text-sm text-center mb-4 text-teal-400">{message}</p>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          required
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-zinc-500"
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <textarea
          placeholder="Paste your code here..."
          required
          rows={12}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none font-mono text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3.5 bg-white text-black rounded-xl text-base font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Code"}
        </button>
      </form>
    </div>
  );
};

export default CodeSubmit;