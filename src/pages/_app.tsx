import MainLayout from "@/components/layouts/MainLayout";
import AppRegistry from "@/lib/app.registry";
import { Providers } from "@/modules/redux/provider";
import "@/styles/globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

config.autoAddCss = false;

function QuizApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = router.pathname.toString();
  const isGlobal = path.includes("auth") //|| path === "/";

  // Check if the page is under '/auth/'
  return (
    <SessionProvider session={pageProps.session}>
      <Providers>
        <>
          <ToastContainer />
          <AppRegistry>
            {isGlobal ? (
              <Component {...pageProps} />
            ) : (
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            )}
          </AppRegistry>
        </>
      </Providers>
    </SessionProvider>
  );
}

export default QuizApp;
