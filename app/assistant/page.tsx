"use client";

import { useState } from "react";

export default function AssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("madai_token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://YOUR_BACKEND_URL/api/madai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "MADAI engine error");
        setLoading(false);
        return;
      }

      setReply(data.reply);
    } catch (err) {
      console.error(err);
      setError("Server error");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6">MADAI Assistant</h1>

      <form onSubmit={handleSend} className="mb-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-4 bg-neutral-900 border border-neutral-700 rounded-lg"
          rows={5}
          placeholder="Ask MADAI anything..."
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full p-3 bg-teal-500 hover:bg-teal-600 rounded font-semibold"
        >
          {loading ? "Thinking..." : "Send to MADAI"}
        </button>
      </form>

      {error && (
        <div className="p-3 bg-red-600/40 border border-red-700 rounded mb-4">
          {error}
        </div>
      )}

      {reply && (
        <div className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg whitespace-pre-wrap">
          {reply}
        </div>
      )}
    </div>
  );
}
