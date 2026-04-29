"use client";

import { useRouter } from "next/navigation";
import { signUp } from "../../lib/auth";
import { useState } from "react";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);

    const result = signUp(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="container w-1/2">
      <h1 className="title">Sign up</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="signup-email">Email</label>

          <input
            type="email"
            id="signup-email"
            data-testid="auth-signup-email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white"
          />
        </div>

        <div>
          <label htmlFor="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            data-testid="auth-signup-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white"
          />
        </div>

        <div className="flex items-end gap-4">
          <button
            type="submit"
            data-testid="auth-signup-submit"
            className="btn-primary"
          >
            Sign up
          </button>

          <Link href="/login" className="text-link">
            or login here
          </Link>
        </div>
      </form>
    </div>
  );
}
