"use client";

import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://YOUR_BACKEND_URL/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("madai_token", data.token);

      // Redirect
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Server error");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-8 bg-neutral-900 rounded-xl border border-neutral-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Create MADAI Account</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-600/40 border border-red-700 rounded">
            {error}
          </div>
        )}

        <label className="block mb-4">
          <span className="text-sm">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-3 rounded bg-neutral-800 border border-neutral-700"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-3 rounded bg-neutral-800 border border-neutral-700"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-3 rounded bg-neutral-800 border border-neutral-700"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-teal-500 hover:bg-teal-600 rounded font-semibold"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className="mt-6 text-center text-sm">
          <a href="/login" className="text-teal-400 hover:text-teal-300">
            Already have an account?
          </a>
        </div>
      </form>
    </div>
  );
}
