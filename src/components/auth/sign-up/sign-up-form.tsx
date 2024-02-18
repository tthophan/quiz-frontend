"use client";
import { useAppDispatch } from "@/modules/redux";
import { requestSignUp } from "@/modules/redux/slices/auth.slice";
import { useState } from "react";
import SocialSignIn from "../sign-in/social-sign-in";
import { Router, useRouter } from "next/router";
import { notificationController } from "@/controllers/notification.controller";
const SignUpForm = () => {
  // Vietnamese and Korean phone number regex
  const vietnamesePhoneRegex = /^(0[1-9][0-9]{8}|84[1-9][0-9]{7})$/;
  const koreanPhoneRegex = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
  const dispatch = useAppDispatch();
  const router = useRouter();
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
      await dispatch(
        requestSignUp({
          phone: formData.phone,
          fullName: formData.fullName,
          password: formData.password,
        })
      )
        .unwrap()
        .then(() => {
          notificationController.success({
            message: "Create account successful",
          });
          router.push("/auth/sign-in");
        });
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
          onClick={onSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
        >
          Sign up
        </button>
      </form>
      <SocialSignIn />
    </div>
  );
};
export default SignUpForm;
