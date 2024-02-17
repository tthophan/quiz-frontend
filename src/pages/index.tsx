import Quizzes from "@/components/quizzes";
import { signOut, useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/auth/sign-in`);
  }, [status]);

  if (session)
    return (
      <>
      Signed in as {session.user?.name} <br />
      <button onClick={() => signOut()}>Sign out</button>

      </>
    );
  return <>ok</>;
}
