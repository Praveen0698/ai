/*****
 @author: KayJayGlobal
 @purpose: Component for rendering the email verification form in the user signup process
******/

"use client";
import React, { useEffect, useState } from "react";
import { CiGlobe } from "react-icons/ci"; // Imports globe icon for language selection
import { IoIosArrowDown } from "react-icons/io"; // Imports down arrow icon
import { ToastContainer } from "react-toastify";
import { IoMdArrowRoundBack } from "react-icons/io";
import { notify } from "@/utils/notify";
import { emailVerify } from "../api/EmailVerifyApi";
import Loader from "@/app/components/common/Loader";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
/*****
 @purpose: Renders an email verification form with a language selector and a button to proceed
******/

/*****
 @object: vailidetion schema
 @description: This schema are vailidet user inputs email
 *****/

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!") // Validates the format of the email
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must include a valid domain (e.g., .com, .in)"
    )
    .min(5, "Email must be at least 5 characters long.") // Ensures minimum length
    .max(50, "Email cannot be longer than 50 characters.") // Ensures maximum length
    .required("Please enter your email!"),
});

const EmailVerifyForm = () => {
  const [loaderOpen, setLoaderOpen] = useState(false);
  const router = useRouter(); // Next.js router hook for navigating pages
  const refresh =
    typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
  useEffect(() => {
    if (refresh) {
      router.push("/finderscope/v1/search");
    }
  }, []);
  const openLoader = () => {
    setLoaderOpen(true);
  };

  const closeLoader = () => {
    setLoaderOpen(false);
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: ({ email }) => {
      openLoader?.();
      emailVerify({ email }) //login api
        .then((response) => response.json()) // Convert the response to JSON
        .then((data) => {
          if (data.success) {
            closeLoader?.();
            notify(data.message[1], "success"); // Display the notification
          } else if (data.success === false) {
            closeLoader?.();
            notify(data.message[0], "error");
          }
        }) // Handle the response data
        .catch((error) => console.error("Error:", error));
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="h-screen w-[45%] relative p-8 flex justify-center items-center">
      {/* Language selection icon and dropdown (static for now) */}
      <div className="absolute top-7 right-7 flex justify-center items-center gap-1">
        <CiGlobe />
        <span>Español</span>
        <IoIosArrowDown />
      </div>
      <div className="absolute top-7 left-7 flex justify-center items-center gap-1">
        <button
          onClick={() => {
            openLoader();
            router.push("/");
          }}
        >
          <IoMdArrowRoundBack className="text-2xl" />
        </button>
      </div>

      {/* Main content wrapper for email verification form */}
      <div className="w-[100%] flex justify-center items-center flex-col text-center">
        <ToastContainer />
        <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
        {/* Title section */}
        <h2 className="text-[46.13px] font-aptos font-semibold">
          ¿Olvidaste tu contraseña?
        </h2>

        {/* Form for email input and submission */}
        <form className="flex flex-col w-[80%]" onSubmit={handleSubmit}>
          {/* Input field for the user to enter their email */}
          <div className="flex justify-center items-center gap-1 flex-col mt-[20px] ">
            <input
              type="text"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange} // Handles password input change
              placeholder="Correo electrónico registrado ingresado"
              className={`w-[80%] h-14 pl-3 text-black outline-[#367DFD] border-2 border-gray-400 rounded-md ${
                errors.email && touched.email && "!border-red-500"
              }`}
            />
            {errors.email && touched.email && (
              <span className="text-red-500 w-[80%] pt-1 text-xs block">
                {errors.email}
              </span>
            )}
          </div>

          {/* Submit button to proceed with email verification */}
          <button
            type="submit"
            className="bg-gradient-custom-2 text-white py-1 px-2.5 text-xl font-[600] cursor-pointer border-none outline-none rounded-md w-[190px] h-[40px] mx-auto my-4"
          >
            Próxima
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerifyForm;
