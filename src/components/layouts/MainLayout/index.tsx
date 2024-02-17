import Head from "next/head";
import React, { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Quiz App</title>
        <meta name="description" content="Your quiz description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="flex-grow  flex flex-col items-center px-2 py-8">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
