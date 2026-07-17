import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const CodeSubmit = () => {
  const [projectName, setProjectName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [review, setReview] = useState(null);

  const handleSubmit = async (e) => {
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
        {
          project_name: projectName,
          code_content: code,
          language,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const projectId = res.data.project.id;
      setMessage("Code submitted! Generating AI review...");
      setLoading(false);
      setReviewLoading(true);

      const reviewRes = await axios.post(
        `http://localhost:5000/api/reviews/${projectId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReview(reviewRes.data.review.full_review);
      setMessage("Review complete!");
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Something went wrong. Try again.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
      setReviewLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[700px] bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl text-white">
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
          disabled={loading || reviewLoading}
          className="w-full p-3.5 bg-white text-black rounded-xl text-base font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : reviewLoading
            ? "AI is reviewing your code..."
            : "Submit Code"}
        </button>
      </form>

      {review && (
        <div className="mt-6 p-6 bg-zinc-800 border border-zinc-700 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-teal-400">AI Review</h3>
          <div
            className="prose prose-invert prose-sm max-w-none
                          prose-headings:text-white prose-headings:font-semibold prose-headings:mb-2 prose-headings:mt-4
                          prose-p:text-zinc-300 prose-p:leading-relaxed
                          prose-strong:text-white prose-strong:font-semibold
                          prose-ul:text-zinc-300 prose-li:text-zinc-300
                          prose-code:text-teal-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
          >
            <ReactMarkdown>{review}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeSubmit;