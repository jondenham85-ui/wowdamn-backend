"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://YOUR_BACKEND_URL/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
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
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 bg-neutral-900 rounded-xl border border-neutral-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">MADAI Login</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-600/40 border border-red-700 rounded">
            {error}
          </div>
        )}

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
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="mt-6 text-center text-sm">
          <a href="/signup" className="text-teal-400 hover:text-teal-300">
            Create an account
          </a>
        </div>

        <div className="mt-2 text-center text-sm">
          <a href="/forgot-password" className="text-teal-400 hover:text-teal-300">
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
}
