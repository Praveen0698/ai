/*****
 @author: KayJayGlobal
 @purpose: User login form for email and password-based authentication
 @method: POST
 @Req Param: {
   Email, Password
 }
 @response: JSON
******/

/*****
 @author: Kayglobal
 @purpose: This component handles user login by allowing users to input their email and password.
******/

"use client";
import React, { useEffect, useState } from "react";
import { CiGlobe } from "react-icons/ci"; // Importing globe icon for language selection
import { IoIosArrowDown } from "react-icons/io"; // Importing down arrow icon for dropdown
import { FcGoogle } from "react-icons/fc"; // Google icon for Google login button
import { FaFacebook } from "react-icons/fa6"; // Facebook icon for Facebook login button
import { FaRegCircle } from "react-icons/fa"; // Circle icon for divider section
import { useRouter } from "next/navigation"; // Next.js hook for navigation
import { ToastContainer } from "react-toastify";
import { notify } from "@/utils/notify";
import { login, verifyEmail } from "../api/LoginApi";
import Loader from "@/app/components/common/Loader";
import { baseUrl } from "@/config/BaseUrl";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

/*****
 @purpose: Renders the login form, allowing users to sign in with email and password, or use social logins (Google, Facebook)
 ******/

/*****
 @object: vailidetion schema
 @description: This schema are vailidet user inputs email and password  
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
  password: Yup.string()
    .required("Please enter your password!") // Ensures the password is not empty
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,30}$/,
      "Password must be between 8 and 30 characters, and contain a mix of uppercase, lowercase and numbers."
    ),
});

const LoginForm = () => {
  const [show, setShow] = useState(false); // state for password view and hide
  const [loaderOpen, setLoaderOpen] = useState(false);
  const refresh =
    typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
  useEffect(() => {
    localStorage.removeItem("login");
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

  const router = useRouter(); // Next.js router hook for navigating pages

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: ({ email, password }) => {
      openLoader?.();
      login({ email, password }) //login api
        .then((response) => response.json()) // Convert the response to JSON
        .then((data) => {
          if (data.user.status === true) {
            localStorage.setItem("access", data.token);
            localStorage.setItem("refresh", data.refreshToken);
            router.push("/finderscope/v1/search"); // Redirects to the search page
          } else if (data.success === false) {
            closeLoader?.();
            notify(data.message[0], "error");
            if (data.message[0] === "User exists but not verified") {
              verifyEmail({ email, password }) //verify email api
                .then((response) => response.json())
                .then(() =>
                  notify("Verification Link sent to Email", "success")
                );
            }
          }
        }) // Handle the response data
        .catch((error) => console.error("Error:", error));
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="h-screen w-[45%] relative p-8 flex justify-center items-center">
      {/* Language selector for Spanish (static) */}
      <div className=" text-roboto text-xl absolute top-7 right-7 flex justify-center items-center gap-1">
        <CiGlobe />
        <span>Español</span>
        <IoIosArrowDown />
      </div>

      {/* Main form container */}
      <div className="w-[100%] flex justify-center items-center flex-col">
        <h2 className=" text[46.13px] font-[600] font-aptos text-custom-lg">
          Bienvenido a <span className="text-[#0066FF]">Finderscope</span>
        </h2>
        <ToastContainer />
        <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
        {/* Login form */}
        <form className="flex flex-col w-[80%]" onSubmit={handleSubmit}>
          {/* Email and password input fields */}
          <div className="flex justify-center items-center gap-5 flex-col mt-[30px]">
            <div className="w-[80%] ">
              <input
                type="text"
                name="email"
                id="email"
                value={values.email}
                onChange={handleChange} // Handles email input change
                placeholder="Correo electronico*"
                className={`w-full h-[55px] pl-5 text-[#000] outline-[#367DFD] border-2 border-gray-400 rounded-md ${
                  errors.email && touched.email && "!border-red-500"
                }`}
              />
              {errors.email && touched.email && (
                <span className="text-red-500 w-[80%] pt-1 text-xs block">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="w-[80%] ">
              <div className="w-full relative flex justify-end items-center ">
                <input
                  type={!show ? "password" : "text"}
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange} // Handles password input change
                  placeholder="Contraseña*"
                  className={`w-full h-[55px] pl-5 text-[#000] outline-[#367DFD] border-2 border-gray-400 rounded-md ${
                    errors.password && touched.password && "!border-red-500"
                  }`}
                />
                {!show ? (
                  <AiOutlineEyeInvisible
                    className="absolute text-[#ACACAC] right-3 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setShow(true)}
                  />
                ) : (
                  <AiOutlineEye
                    className="absolute text-[#ACACAC] right-3 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setShow(false)}
                  />
                )}
              </div>
              {errors.password && touched.password && (
                <span className="text-red-500 w-[80%] pt-1 text-xs block">
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          {/* Forgot password link */}
          <p
            onClick={() => {
              openLoader?.();
              router.push("/finderscope/v1/auth/email");
            }} // Redirects to forgot password page
            className="text-[#3c9d87] py-1 px-10 text-sm font-medium cursor-pointer ml-5"
          >
            ¿Olvidó su contraseña?
          </p>

          {/* Login button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#87a1ff] to-[#ced7ff] text-white py-1 px-2.5 text-xl font-[600] cursor-pointer border-none outline-none rounded-md w-[190px] h-[40px] mx-auto my-2 mt-5"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-sm font-medium text-center my-5 ">
          ¿No tienes cuenta?
          <span
            className="text-[#3c9d87] cursor-pointer ml-1"
            onClick={() => {
              openLoader?.();
              router.push("/finderscope/v1/auth/register");
            }} // Redirects to register page
          >
            Regístrate
          </span>
        </p>

        {/* Social login buttons */}
        <div className="flex justify-center items-center gap-5 flex-col mx-0 w-[80%] mb-5">
          {/* Google login button */}
          <a
            href={`${baseUrl}/api/auth/google`}
            onClick={() => localStorage.setItem("login", "google")}
            className="w-[80%] py-2.5 px-0 bg-transparent border-2 border-gray-400 rounded-[50px] flex justify-center items-center gap-5 text-base text-[#736a6a] cursor-pointer"
          >
            <FcGoogle className="text-[16px]" /> Continuar con Google
          </a>
          {/* Facebook login button */}
          <a className="w-[80%] py-2.5 px-0 bg-transparent border-2 border-gray-400 rounded-[50px] flex justify-center items-center gap-5 text-base text-[#736a6a] cursor-pointer">
            <FaFacebook className="text-[16px] text-[#0066FF]" />
            Continuar con Facebook
          </a>
        </div>

        {/* Divider */}
        <div className="flex justify-center items-center g-5 w-[50%] mx-auto my-7">
          <hr className="w-[50%] mx-5 my-auto border-[2px] border-t border-t-[#e2e2e2]" />
          <FaRegCircle className="text-[#E2E2E2] h-5 w-5" />
          <hr className="w-[50%] mx-5 my-auto border-[2px] border-t border-t-[#e2e2e2]" />
        </div>

        {/* Continue as guest link */}
        <div className="text-center mt-3">
          <p
            onClick={() => {
              openLoader?.();
              router.push(`/finderscope/v1/search?guest=${true}`);
            }} // Redirects to search page as guest
            className="text-center text-[20.17px] text-[#1a6fff] text-base font-medium cursor-pointer"
          >
            Continuar como invitado
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
