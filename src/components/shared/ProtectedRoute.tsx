"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "../../lib/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = getCurrentSession();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  if (!session) {
    return <p>Redirecting...</p>;
  }

  return <>{children}</>;
}
