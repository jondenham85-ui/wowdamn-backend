"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("https://YOUR_BACKEND_URL/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Reset failed");
        setLoading(false);
        return;
      }

      setSuccess("Password updated successfully");
    } catch (err) {
      console.error(err);
      setError("Server error");
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md p-8 bg-neutral-900 rounded-xl border border-neutral-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-600/40 border border-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-600/40 border border-green-700 rounded">
            {success}
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
          <span className="text-sm">New Password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mt-1 p-3 rounded bg-neutral-800 border border-neutral-700"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-teal-500 hover:bg-teal-600 rounded font-semibold"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <div className="mt-6 text-center text-sm">
          <a href="/login" className="text-teal-400 hover:text-teal-300">
            Back to login
          </a>
        </div>
      </form>
    </div>
  );
}
