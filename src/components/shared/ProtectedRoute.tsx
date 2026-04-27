"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "../../lib/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const session = getCurrentSession();

    if (!session) {
      router.replace("/login");
    } else {
      setVerified(true);
    }
  }, [router]);

  if (!verified) return null;

  return <>{children}</>;
}
