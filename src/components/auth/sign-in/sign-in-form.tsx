"use client";
import { notificationController } from "@/controllers/notification.controller";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import SocialSignIn from "./social-sign-in";
const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    remember: false,
  });

  const [formErrors, setFormErrors] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setFormErrors({
      ...formErrors,
      [name]: "", // Clear error when the field is updated
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newFormErrors = {
      phone: "",
      password: "",
    };

    if (!formData.phone.trim()) {
      newFormErrors.phone = "Phone is required";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newFormErrors.password = "Password is required";
      isValid = false;
    }

    setFormErrors(newFormErrors);
    return isValid;
  };

  const onSubmit = async (e: any) => {
    if (validateForm()) {
      e.preventDefault();
      setIsLoading(true);
      const result = await signIn("credentials-sign-in", {
        redirect: false,
        phone: formData.phone,
        password: formData.password,
      }).finally(() => setIsLoading(false));
      if (result?.error)
        notificationController.error({
          message: result.error,
        });
    }
  };
  return (
    <div className="max-w-md w-full">
      <form>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-quiz-primary">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border text-quiz-primary ${
              formErrors.phone ? "border-red-500" : "border-gray-300"
            } rounded-md py-2 px-3 focus:outline-none focus:border-blue-500`}
            autoComplete="off"
          />
          {formErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-quiz-primary">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border text-quiz-primary ${
              formErrors.password ? "border-red-500" : "border-gray-300"
            } rounded-md py-2 px-3 focus:outline-none focus:border-blue-500`}
            autoComplete="off"
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
          )}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="text-blue-500"
          />
          <label htmlFor="remember" className="text-quiz-primary ml-2">
            Remember Me
          </label>
        </div>
        <div className="mb-6 text-blue-500">
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
        </div>
        <button
          disabled={isLoading}
          onClick={(e) => onSubmit(e)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-0"
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
          <span>Sign in</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            router.push("/auth/sign-up");
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 mt-5 px-4 w-full"
        >
          Sign up
        </button>
      </form>
      <SocialSignIn />
    </div>
  );
};
export default SignInForm;
