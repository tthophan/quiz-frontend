import SignInForm from "@/components/auth/login/sign-in-form";
import { getProviders, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SignInPage = () => {
  const [providers, setProviders] = useState<Array<any>>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push(`/home`);
  }, [session, status]);

  useEffect(() => {
    getProviderList();
  }, []);

  const getProviderList = async () => {
    const providerList: any | null = await getProviders();
    if (providerList) {
      setProviders(Object.values(providerList));
    }
  };

  const onLogout = () => {
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const [cookieName] = cookie.trim().split("=");
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });
    signOut();
  };

  return (
    <>
      {/* <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 shadow-md rounded-md">
          <h1 className="text-2xl font-semibold mb-4">Login</h1>

          {session ? (
            <div>
              <p>Welcome, {session.user?.name}!</p>
            </div>
          ) : (
            providers.map((provider, index) => {
              return (
                <button
                  key={index}
                  onClick={() => signIn(provider.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Sign in with {provider?.name}
                </button>
              );
            })
          )}
          <button onClick={() => onLogout()}>logout</button>
        </div>
      </div>
       */}
      <div className="bg-gray-100 flex justify-center items-center h-screen">
        <div className="w-2/3 h-screen hidden lg:block">
          <img
            // src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat"
            src="/gradient-connection-background.webp"
            alt="Placeholder Image"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/3">
          <h1 className="text-2xl font-semibold mb-4">Login</h1>
          <SignInForm />
        </div>
      </div>
    </>
  );
};
export default SignInPage;
