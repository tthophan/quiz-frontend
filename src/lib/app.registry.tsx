"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const AppRegistry = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/auth/sign-in`);
  }, [status]);

  return children;
};
export default AppRegistry;
