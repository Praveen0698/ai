/*****
 @author: KayJayGlobal
 @purpose: User register form
 @method: POST
 @Req Param: {
    Password, Repeat Password
 }
 @response: JSON
******/

/*****
 @author: Kayglobal
 @purpose: This component handles user reset password by allowing users to input their Password, Repeat Password.
******/

"use client"; // Indicate that this component is a client component in Next.js
import React, { useEffect, useState } from "react"; // Import React to use JSX syntax
import { CiGlobe } from "react-icons/ci"; // Import globe icon for language selection
import { IoIosArrowDown } from "react-icons/io"; // Import arrow down icon for dropdown indication
import { useParams, useRouter } from "next/navigation"; // Importing the useRouter hook for navigation
import { notify } from "@/utils/notify";
import { ToastContainer } from "react-toastify";
import { resetPassword, verifyTokenId } from "../api/ResetPasswordApi";
import Loader from "@/app/components/common/Loader";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

/*****
 @object: vailidetion schema
 @description: This schema are vailidet user inputs password  
 *****/
const schema = Yup.object().shape({
  new_password: Yup.string()
    .required("Please enter your password!") // Ensures the password is not empty
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,30}$/,
      "Password must be between 8 and 30 characters, and contain a mix of uppercase, lowercase and numbers"
    ),
  retype_new_password: Yup.string()
    .oneOf(
      [Yup.ref("new_password"), undefined],
      "Passwords must match new password"
    ) // Ensures confirmPassword matches password
    .required("Please confirm your password!"),
});

const ResetPasswordForm = () => {
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

  const router = useRouter(); // Initialize the router for navigation
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false); // state for password view and hide
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // state for confirm password view and hide

  const verifyToken = async (token: string) => {
    verifyTokenId(token) // verify token api
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        if (data.success) {
          notify(data.message[0], "success");
          setUserId(data.user._id);
        } else if (data.success === false) {
          notify(data.message[0], "error");
        }
      }) // Handle the response data
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    // Replace with the actual JWT token you get from params.
    const token = Array.isArray(id) ? id[0] : id; // If it's an array, take the first element

    if (token) {
      verifyToken(token); // call the verify token api
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: { new_password: "", retype_new_password: "" },
    validationSchema: schema,
    onSubmit: ({ new_password, retype_new_password }) => {
      openLoader?.();
      resetPassword({ new_password, retype_new_password, _id: userId }) //login api
        .then((response) => response.json()) // Convert the response to JSON
        .then((data) => {
          if (data.success) {
            closeLoader?.();
            notify(data.message[0], "success");
            setTimeout(() => {
              router.push("/");
            }, 1600);
          } else if (data.success === false) {
            notify(data.message[0], "error");
            closeLoader?.();
          }
        }) // Handle the response data
        .catch((error) => console.error("Error:", error));
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <div className="h-screen w-[45%] relative p-8 flex justify-center items-center">
      {/* Container with full height and specific width */}
      <div className="absolute top-7 right-7 flex justify-center items-center gap-1">
        <CiGlobe />
        <span>Español</span>
        <IoIosArrowDown />
      </div>
      <div className="w-[100%] flex justify-center items-center flex-col text-center">
        {/* Centered content container */}
        <ToastContainer />
        <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
        <h2 className=" text[46.13px] font-[600] font-aptos">
          Crear contraseña
        </h2>{" "}
        {/* Title for the reset password form */}
        <form className="flex flex-col w-[80%]" onSubmit={handleSubmit}>
          {/* Form container */}
          <div className="flex justify-center items-center gap-5 flex-col mt-[20px] ">
            {/* Input fields container */}
            <div className="w-[80%] ">
              <div className="w-full relative flex justify-end items-center">
                <input
                  type={!showPassword ? "password" : "text"} // Input field for the new password
                  placeholder="Contraseña*"
                  name="new_password"
                  id="new_password"
                  value={values.new_password}
                  onChange={handleChange} // Handles password input change
                  className={`w-full h-[55px] pl-5 text-[#000] outline-[#367DFD] border-2 ${
                    errors.new_password && touched.new_password
                      ? "border-red-500"
                      : "border-gray-400"
                  } rounded-md `}
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
              {errors.new_password && touched.new_password && (
                <span className="text-red-500 w-full pt-1 text-xs block">
                  {errors.new_password}
                </span>
              )}
            </div>
            <div className="w-[80%] ">
              <div className="w-full relative flex justify-end items-center">
                <input
                  type={!showConfirmPassword ? "password" : "text"} // Input field for confirming the new password
                  placeholder="Repetir contraseña*"
                  name="retype_new_password"
                  id="retype_new_password"
                  value={values.retype_new_password}
                  onChange={handleChange} // Handles password input change
                  className={`w-full h-[55px] pl-5 text-[#000] outline-[#367DFD] border-2 rounded-md ${
                    (errors.retype_new_password &&
                      touched.retype_new_password) ||
                    (values.retype_new_password != values.new_password &&
                      values.retype_new_password.length > 0)
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
              {errors.retype_new_password && touched.retype_new_password ? (
                <span className="text-red-500 w-[90%] text-xs block">
                  {errors.retype_new_password}
                </span>
              ) : values.retype_new_password !== values.new_password &&
                values.retype_new_password.length > 0 ? (
                <span className="text-red-500 w-[90%] text-xs block">
                  Passwords do not match.
                </span>
              ) : null}
            </div>
          </div>
          <button
            type="submit" // Button to submit the form
            className="bg-gradient-custom-2 text-white py-1 px-2.5 text-xl font-[600] cursor-pointer border-none outline-none rounded-md w-[190px] h-[40px] mx-auto my-4"
          >
            Entregar {/* Button text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm; // Export the component for use in other parts of the application
