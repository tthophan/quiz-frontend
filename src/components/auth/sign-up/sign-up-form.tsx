"use client";
import { notificationController } from "@/controllers/notification.controller";
import { useAppDispatch } from "@/modules/redux";
import { requestSignUp } from "@/modules/redux/slices/auth.slice";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import SocialSignIn from "../sign-in/social-sign-in";
const SignUpForm = () => {
  // Vietnamese and Korean phone number regex
  const vietnamesePhoneRegex = /^(0[1-9][0-9]{8}|84[1-9][0-9]{7})$/;
  const koreanPhoneRegex = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phone: "",
    password: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newFormErrors = { fullName: "", phone: "", password: "" };

    if (!formData.fullName.trim()) {
      newFormErrors.fullName = "Full Name is required";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newFormErrors.phone = "Phone is required";
      isValid = false;
    } else if (
      !vietnamesePhoneRegex.test(formData.phone) &&
      !koreanPhoneRegex.test(formData.phone)
    ) {
      newFormErrors.phone = "Invalid phone number";
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
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      await dispatch(
        requestSignUp({
          phone: formData.phone,
          fullName: formData.fullName,
          password: formData.password,
        })
      )
        .unwrap()
        .then(async () => {
          notificationController.success({
            message: "Create account successful",
          });
          await signIn("credentials-sign-in", {
            redirect: false,
            phone: formData.phone,
            password: formData.password,
          });
          router.push("/");
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
  };

  return (
    <div className="max-w-md w-full">
      <form>
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-quiz-primary">
            Full name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full border text-quiz-primary ${
              formErrors.fullName ? "border-red-500" : "border-gray-300"
            } rounded-md py-2 px-3 focus:outline-none focus:border-blue-500`}
            autoComplete="off"
          />
          {formErrors.fullName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-quiz-primary">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            maxLength={10}
            pattern="^(0[1-9][0-9]{8}|84[1-9][0-9]{7}|01[0-9]-?[0-9]{3,4}-?[0-9]{4})$"
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
        <button
          disabled={isLoading}
          onClick={onSubmit}
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
          <span>Sign up</span>
        </button>
      </form>
      <SocialSignIn />
    </div>
  );
};
export default SignUpForm;
