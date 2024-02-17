"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import SocialSignIn from "./social-sign-in";
const SignInForm = () => {
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
      console.log("Form submitted:", formData);
      e.preventDefault();
      await signIn("credentials-sign-in", {
        redirect: false,
        phone: formData.phone,
        password: formData.password,
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
          onClick={(e) => onSubmit(e)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
        >
          Sign in
        </button>
      </form>
      <SocialSignIn />
    </div>
  );
};
export default SignInForm;
