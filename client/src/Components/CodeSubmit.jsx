import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const CodeSubmit = () => {
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("paste");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [review, setReview] = useState(null);

  const runReview = async (projectId, token) => {
    setReviewLoading(true);
    const reviewRes = await axios.post(
      `http://localhost:5000/api/reviews/${projectId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setReview(reviewRes.data.review.full_review);
    setReviewLoading(false);
  };

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setReview(null);

    const trimmedCode = code.trim();
    if (trimmedCode.length < 20) {
      setMessage("Please paste at least a few lines of actual code.");
      return;
    }
    const codeIndicators = /[{}();=<>[\]]|def |function |class |import |const |let |var |public |private/;
    if (!codeIndicators.test(trimmedCode)) {
      setMessage("This doesn't look like valid code. Please paste real source code.");
      return;
    }
    if (!projectName.trim()) {
      setMessage("Please enter a project name.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/projects",
        { project_name: projectName, code_content: code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Code submitted! Generating AI review...");
      setLoading(false);
      await runReview(res.data.project.id, token);
      setMessage("Review complete!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setReviewLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setReview(null);

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("codeFile", file);
      formData.append("project_name", projectName || file.name);
      formData.append("language", language);

      const res = await axios.post(
        "http://localhost:5000/api/projects/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("File uploaded! Generating AI review...");
      setLoading(false);
      await runReview(res.data.project.id, token);
      setMessage("Review complete!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setReviewLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[700px] bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl text-white">
      <h2 className="text-2xl font-bold mb-6">Submit Code for Review</h2>

      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => setMode("paste")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            mode === "paste" ? "bg-white text-black" : "bg-zinc-800 text-zinc-400"
          }`}
        >
          Paste Code
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            mode === "upload" ? "bg-white text-black" : "bg-zinc-800 text-zinc-400"
          }`}
        >
          Upload File
        </button>
      </div>

      {message && <p className="text-sm text-center mb-4 text-teal-400">{message}</p>}

      {mode === "paste" ? (
        <form className="space-y-4" onSubmit={handlePasteSubmit}>
          <input
            type="text"
            placeholder="Project Name"
            required
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white outline-none"
          >
            <option value="javascript">JavaScript</option>
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
            disabled={loading || reviewLoading}
            className="w-full p-3.5 bg-white text-black rounded-xl text-base font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50"
          >
            {loading ? "Submitting..." : reviewLoading ? "AI is reviewing..." : "Submit Code"}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleFileSubmit}>
          <input
            type="text"
            placeholder="Project Name (optional, defaults to filename)"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 outline-none"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white outline-none"
          >
            <option value="javascript">JavaScript</option>
          </select>
          <input
            type="file"
            accept=".js,.jsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-white"
          />
          <button
            type="submit"
            disabled={loading || reviewLoading}
            className="w-full p-3.5 bg-white text-black rounded-xl text-base font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50"
          >
            {loading ? "Uploading..." : reviewLoading ? "AI is reviewing..." : "Upload & Review"}
          </button>
        </form>
      )}

      {review && (
        <div className="mt-6 p-6 bg-zinc-800 border border-zinc-700 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-teal-400">Review</h3>
          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-strong:text-white prose-code:text-teal-300">
            <ReactMarkdown>{review}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeSubmit;