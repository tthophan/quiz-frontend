import Introduce from "@/components/introduce";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-m-screen py-2">
      <Head>
        <title>Vani Coins Quiz</title>
        <meta
          name="description"
          content="Take the quiz of Vani Coins and get instantly 10000 coins."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
        <Introduce />
      </main>
    </div>
  );
}
