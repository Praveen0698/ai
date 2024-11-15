/*****
 @author: KayJayGlobal
 @purpose: User register form
 @method: POST
 @Req Param: {
   Name, Email, Password, Repeat Password
 }
 @response: JSON
******/

/*****
 @author: Kayglobal
 @purpose: This component handles user signup by allowing users to input their  Name, Email, Password, Repeat Password.
******/

"use client";

import React, { useEffect, useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaRegCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { register } from "../api/RegisterApi";
import { notify } from "@/utils/notify";
import Loader from "@/app/components/common/Loader";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { baseUrl } from "@/config/BaseUrl";

/*****
 @object: vailidetion schema
 @description: This schema are vailidet user inputs email and password  
 *****/
const schema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required") // Ensures the name is not empty
    .min(1, "Name must be at least 10 characters long") // Minimum length check
    .max(30, "Name cannot be longer than 30 characters"), // Maximum length check
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
  retype_password: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match") // Ensures confirmPassword matches password
    .required("Please confirm your password!"),
});

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false); // state for password view and hide
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // state for confirm password view and hide
  const [loaderOpen, setLoaderOpen] = useState(false);
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

  const router = useRouter();

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", retype_password: "" },
    validationSchema: schema,
    onSubmit: ({ name, email, password, retype_password }) => {
      openLoader?.();
      register({ name, email, password, retype_password }) //register api call
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            closeLoader?.();
            notify(data.message[1], "success");
            setTimeout(() => {
              router.push("/");
            }, 1600);
          } else if (data.success === false) {
            closeLoader?.();
            notify(data.message[0], "error");
          }
        })
        .catch((error) => console.error("Error:", error));
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="h-screen w-[45%] relative p-8 flex justify-center items-center">
      <div className="absolute top-7 right-7 flex justify-center items-center gap-1">
        <CiGlobe />
        <span>Español</span>
        <IoIosArrowDown />
      </div>

      <div className="w-[100%] flex justify-center items-center flex-col">
        <ToastContainer />
        <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
        <h2 className="text-custom-lg font-[600] text[46.13px]">
          Crear una cuenta
        </h2>
        <form className="flex flex-col w-[80%]" onSubmit={handleSubmit}>
          <div className="flex justify-center items-center gap-5 flex-col mt-[30px] ">
            <div className="w-[80%]">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Nombre completo"
                value={values.name}
                onChange={handleChange}
                className={`w-full h-[55px] pl-5 text-[#000] outline-[#367DFD] border-2 border-gray-400 rounded-md ${
                  errors.name && touched.name && "!border-red-500"
                }`}
              />
              {errors.name && touched.name && (
                <span className="text-red-500 w-[80%] pt-1 text-xs block">
                  {errors.name}
                </span>
              )}
            </div>
            <div className="w-[80%]">
              <input
                type="text"
                name="email"
                id="email"
                value={values.email}
                placeholder="Correo electronico*"
                onChange={handleChange}
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
            <div className="w-[80%]">
              <div className="w-full relative flex justify-end items-center ">
                <input
                  name="password"
                  type={!showPassword ? "password" : "text"} // Input field for the new password
                  id="password"
                  value={values.password}
                  placeholder="Contraseña*"
                  onChange={handleChange}
                  className={`w-full h-[55px] pl-5 text-[#000] outline-[#367DFD] border-2 border-gray-400 rounded-md ${
                    errors.password && touched.password && "!border-red-500"
                  }`}
                />
                {!showPassword ? (
                  <AiOutlineEyeInvisible
                    className="absolute text-[#ACACAC] right-3 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setShowPassword(true)}
                  />
                ) : (
                  <AiOutlineEye
                    className="absolute text-[#ACACAC] right-3 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setShowPassword(false)}
                  />
                )}
              </div>
              {errors.password && touched.password && (
                <span className="text-red-500 w-[80%] pt-1 text-xs block">
                  {errors.password}
                </span>
              )}
            </div>
            <div className="w-[80%]">
              <div className="w-full relative flex justify-end items-center ">
                <input
                  name="retype_password"
                  type={!showConfirmPassword ? "password" : "text"}
                  id="retype_password"
                  value={values.retype_password}
                  placeholder="Repetir contraseña"
                  onChange={handleChange}
                  className={`w-full h-[55px] pl-5 text-[#000] outline-[#367DFD] border-2 rounded-md ${
                    (errors.retype_password && touched.retype_password) ||
                    (values.retype_password != values.password &&
                      values.retype_password.length > 0)
                      ? "border-red-500"
                      : "border-gray-400"
                  }`}
                />
                {!showConfirmPassword ? (
                  <AiOutlineEyeInvisible
                    className="absolute text-[#ACACAC] right-3 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setShowConfirmPassword(true)}
                  />
                ) : (
                  <AiOutlineEye
                    className="absolute text-[#ACACAC] right-3 z-1 cursor-pointer"
                    size={20}
                    onClick={() => setShowConfirmPassword(false)}
                  />
                )}
              </div>
              {errors.retype_password && touched.retype_password ? (
                <span className="text-red-500 w-[90%] text-xs block">
                  {errors.retype_password}
                </span>
              ) : values.retype_password !== values.password &&
                values.retype_password.length > 0 ? (
                <span className="text-red-500 w-[90%] text-xs block">
                  Passwords do not match.
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#87a1ff] to-[#ced7ff] text-white py-1 px-2.5 text-xl font-[600] cursor-pointer border-none outline-none rounded-md w-[190px] h-[40px] mx-auto my-6"
          >
            Registrarse
          </button>
        </form>
        <p className="text-[16px] font-medium mt-2.5 text-center">
          ¿Ya tiene una cuenta?
          <span
            className="text-[#3c9d87] cursor-pointer ml-1"
            onClick={() => {
              openLoader?.();
              router.push("/");
            }}
          >
            Iniciar Sesión
          </span>
        </p>
        <div className="flex justify-center items-center g-5 w-[50%] mx-auto my-7">
          <hr className="w-[50%] mx-5 my-auto border-[2px] border-t border-t-[#e2e2e2]" />
          <FaRegCircle className="text-[#E2E2E2] h-5 w-5" />
          <hr className="w-[50%] mx-5 my-auto border-[2px] border-t border-t-[#e2e2e2]" />
        </div>
        <div className="flex justify-center items-center gap-5 flex-col mx-0 w-[80%]">
          <a
            href={`${baseUrl}/api/auth/google`}
            className="w-[80%] py-2.5 px-0 bg-transparent border-2 border-gray-400 rounded-[50px] flex justify-center items-center gap-5 text-[14px] text-[#736a6a] cursor-pointer"
          >
            <FcGoogle className="text-[16px]" /> Continuar con Google
          </a>
          <a className="w-[80%] py-2.5 px-0 bg-transparent border-2 border-gray-400 rounded-[50px] flex justify-center items-center gap-5 text-[14px] text-[#736a6a] cursor-pointer">
            <FaFacebook className="text-[16px] text-[#0066FF]" />
            Continuar con Facebook
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
