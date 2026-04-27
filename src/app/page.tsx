"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import { getCurrentSession } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getCurrentSession();

      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }

      setReady(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
