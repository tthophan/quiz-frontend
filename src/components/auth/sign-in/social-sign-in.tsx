import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

const SocialSignIn: React.FC = () => {
  const [providers, setProviders] = useState<Array<any>>([]);

  useEffect(() => {
    getProviderList();
  }, []);
  const getProviderList = async () => {
    const providerList: any | null = await getProviders();
    if (providerList) {
      setProviders(Object.values(providerList));
    }
  };
  return (
    <div className="social-sign-in">
      {providers
        .filter((x) => x.id !== "credentials-sign-in")
        .map((provider, index) => {
          return (
            <button
              key={index}
              onClick={() => signIn(provider.id)}
              className="bg-blue-500 mt-6 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              Sign in with {provider?.name}
            </button>
          );
        })}
    </div>
  );
};
export default SocialSignIn;
