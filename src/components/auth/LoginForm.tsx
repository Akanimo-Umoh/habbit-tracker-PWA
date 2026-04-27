"use client";

import { useState } from "react";
import { logIn } from "../../lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);

    const result = logIn(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="login-email">Email</label>
        <input
          type="email"
          id="login-email"
          data-testid="auth-login-email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white"
        />
      </div>

      <div>
        <label htmlFor="login-password">Password</label>
        <input
          type="password"
          id="login-password"
          data-testid="auth-login-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white"
        />
      </div>

      <button
        type="submit"
        data-testid="auth-login-submit"
        className="bg-blue-500 py-1 px-4 rounded-sm"
      >
        Login
      </button>

      <p>
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </form>
  );
}
