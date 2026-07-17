import React, { useState, useEffect } from "react";
import axios from "axios";
import CodeSubmit from "./CodeSubmit";

const Dashboard = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const totalSubmissions = projects.length;
  const languageCounts = projects.reduce((acc, p) => {
    acc[p.language] = (acc[p.language] || 0) + 1;
    return acc;
  }, {});

  const goToDashboard = () => {
    setView("dashboard");
    fetchProjects();
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      <nav className="w-full flex justify-between items-center px-6 py-4 bg-zinc-900 border-b border-zinc-800 fixed top-0 left-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={goToDashboard}>
          <span className="text-white font-bold text-lg">
            AI Code Review <span className="text-zinc-400">Assistant</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={goToDashboard}
            className={`text-sm transition ${
              view === "dashboard" ? "text-white font-medium" : "text-zinc-500 hover:text-white"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView("submit")}
            className={`text-sm transition ${
              view === "submit" ? "text-white font-medium" : "text-zinc-500 hover:text-white"
            }`}
          >
            Submit Code
          </button>
          <button
            onClick={() => {
              setView("history");
              fetchProjects();
            }}
            className={`text-sm transition ${
              view === "history" ? "text-white font-medium" : "text-zinc-500 hover:text-white"
            }`}
          >
            History
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg hover:bg-zinc-700 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="pt-24 px-4 flex flex-col items-center pb-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            AI Code Review <span className="text-zinc-400">Assistant</span>
          </h1>
          <p className="mt-3 text-zinc-500">Review smarter. Ship better code.</p>
        </div>
        {view === "submit" && <CodeSubmit />}

        {view === "dashboard" && (
          <div className="w-full max-w-[800px]">
            <h2 className="text-2xl font-bold text-white mb-6">Your Dashboard</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-zinc-500 text-sm">Total Submissions</p>
                <p className="text-3xl font-bold text-white mt-1">{totalSubmissions}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-zinc-500 text-sm">Reviews Generated</p>
                <p className="text-3xl font-bold text-teal-400 mt-1">{totalSubmissions}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-zinc-500 text-sm">Languages Used</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {Object.keys(languageCounts).length}
                </p>
              </div>
            </div>

            <button
              onClick={() => setView("submit")}
              className="w-full mb-8 p-3.5 bg-white text-black rounded-xl text-base font-semibold hover:bg-zinc-200 transition-all"
            >
              + Submit New Code
            </button>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Submissions</h3>

              {loading ? (
                <p className="text-zinc-500 text-sm">Loading...</p>
              ) : projects.length === 0 ? (
                <p className="text-zinc-500 text-sm">
                  No submissions yet. Click "Submit New Code" above to get started!
                </p>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-white font-medium">{project.project_name}</p>
                        <p className="text-zinc-500 text-xs mt-1">
                          {project.language} •{" "}
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === "history" && (
          <div className="w-full max-w-[800px]">
            <h2 className="text-2xl font-bold text-white mb-6">Submission History</h2>

            {loading ? (
              <p className="text-zinc-500 text-sm">Loading...</p>
            ) : projects.length === 0 ? (
              <p className="text-zinc-500 text-sm">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-medium">{project.project_name}</p>
                      <p className="text-zinc-500 text-xs mt-1">
                        {project.language} •{" "}
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;