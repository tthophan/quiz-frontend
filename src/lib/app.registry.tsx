"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRouter as nextRouter } from "next/router";
import { ReactNode, useEffect } from "react";

const AppRegistry = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const route = nextRouter();
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      const isGlobal =
        route.pathname.includes("auth") || route.pathname === "/";
      if (isGlobal) return;
      router.push(`/auth/sign-in`);
    }
  }, [status, session]);

  return children;
};
export default AppRegistry;
