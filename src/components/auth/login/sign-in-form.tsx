"use client";
import { notificationController } from "@/controllers/notification.controller";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
const SignInForm = () => {
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

  const onSubmit = (e: any) => {
    e.preventDefault();
    notificationController.info({
      message: "Feature Coming soon",
    });
  };
  return (
    <>
      <form action="#" method="POST">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-600">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            className="text-blue-500"
          />
          <label htmlFor="remember" className="text-gray-600 ml-2">
            Remember Me
          </label>
        </div>
        <div className="mb-6 text-blue-500">
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
        </div>
        <button
          onClick={(e) => onSubmit(e)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
        >
          Login
        </button>
      </form>
      <div className="social-login">
        {providers.map((provider, index) => {
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
    </>
  );
};
export default SignInForm;
