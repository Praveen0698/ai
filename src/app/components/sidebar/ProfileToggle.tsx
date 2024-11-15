"use client";

import React, { useEffect, useState } from "react";
import { changePassword, getProfile } from "../sidebar/api/SidebarApi";
import { IoIosArrowDown } from "react-icons/io";
import { CiGlobe } from "react-icons/ci";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ProfileOptions from "./ProfileOptions";
import { notify } from "@/utils/notify";
import { useRouter, useSearchParams } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface MyJwtPayload {
  _id: string; // The user's id
  name: string; // The user's name
  email: string; // The user's email
}

/*****
 @object: vailidetion schema
 @description: This schema are vailidet user inputs password  
 *****/
const schema = Yup.object().shape({
  current_password: Yup.string()
    .required("Please enter your password!") // Ensures the password is not empty
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,30}$/,
      "Password must be between 8 and 30 characters, and contain a mix of uppercase, lowercase and numbers."
    ),
  new_password: Yup.string()
    .required("Please enter your password!") // Ensures the password is not empty
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,30}$/,
      "Password must be between 8 and 30 characters, and contain a mix of uppercase, lowercase and numbers."
    ),
  retype_new_password: Yup.string()
    .oneOf(
      [Yup.ref("new_password"), undefined],
      "Passwords must match new password"
    ) // Ensures confirmPassword matches password
    .required("Please confirm your password!"),
});

const ProfileToggle = () => {
  const searchParams = useSearchParams();
  const guest = searchParams.get("guest") === "true"; // Check if the guest parameter is set to true
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const [getProfileData, setGetProfileData] = useState<MyJwtPayload | null>(
    null
  ); // Single object or null
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // state for current password view and hide
  const [showPassword, setShowPassword] = useState(false); // state for password view and hide
  const [tokenFlag, setTokenFlag] = useState(false); // state for password view and hide
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // state for confirm password view and hide
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  const handleGetProfile = () => {
    getProfile() // change password api call
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        if (data.success) {
          setGetProfileData(data.user);
        } else if (
          data.success === false &&
          data.message[0] === "Token expired"
        ) {
          localStorage.removeItem("access");
          router.push("/");
        } else if (data.success === false) {
        }
      }) // Handle the response data
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    if (accessToken && tokenFlag === false) {
      handleGetProfile();
      setTokenFlag(true);
    }
  }, [accessToken]);

  const formik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      retype_new_password: "",
    },
    validationSchema: schema,
    onSubmit: (
      { current_password, new_password, retype_new_password },
      { resetForm }
    ) => {
      changePassword({
        current_password,
        new_password,
        retype_new_password,
        _id: getProfileData?._id || "",
      }) // change password api call
        .then((response) => response.json()) // Convert the response to JSON
        .then((data) => {
          if (data.success) {
            notify(data.message[0], "success");
            resetForm(); // Reset the form fields after successful submission
            handleClose();
          } else if (data.success === false) {
            notify(data.message[0], "error");
            resetForm(); // Reset the form fields after successful submission
            handleClose?.();
          }
        }) // Handle the response data
        .catch((error) => console.error("Error:", error));
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;
  const handleClose = () => {
    values.current_password = "";
    values.new_password = "";
    values.retype_new_password = "";
    errors.current_password = "";
    errors.new_password = "";
    errors.retype_new_password = "";
    setOpen(false);
  };

  return (
    <>
      <div>
        <div className="flex justify-center items-center flex-col gap-4 mb-2.5">
          <hr className="border-[#8E8E8E26] border-[1px] w-[100%]" />

          <div className="w-[100%] flex justify-between items-center">
            <div className="flex justify-center items-center gap-2">
              <CiGlobe className="w-7 h-7" />
              <span className="font-semibold text-[#343541]">Español</span>
            </div>
            <IoIosArrowDown />
          </div>
          {!guest ? (
            <>
              <hr className="border-[#8E8E8E26] border-[1px] w-[100%]" />
              <ProfileOptions
                handleOpen={handleOpen}
                getProfileData={getProfileData}
              />
              <hr className="border-[#8E8E8E26] border-[1px] w-[100%]" />
            </>
          ) : null}
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white outline-none rounded-lg p-4">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            {/* Form container */}
            <div className="flex justify-center items-center gap-5 flex-col mt-[20px] ">
              <h2 className="font-semibold text-lg">Cambiar la contraseña</h2>
              {/* Input fields container */}
              <div className="w-[90%]">
                <div className="w-full relative flex justify-end items-center">
                  <input
                    type={!showCurrentPassword ? "password" : "text"} // Input field for old password
                    placeholder="Contraseña anterior"
                    name="current_password"
                    id="current_password"
                    value={values.current_password}
                    onChange={handleChange} // Handles input change
                    className={`w-full h-12 pl-5 text-[#000] outline-[#367DFD] border-2 ${
                      errors.current_password && touched.current_password
                        ? "border-red-500"
                        : "border-gray-400"
                    } rounded-md`}
                  />
                  {!showCurrentPassword ? (
                    <AiOutlineEyeInvisible
                      className="absolute  right-3 z-1 cursor-pointer"
                      size={20}
                      onClick={() => setShowCurrentPassword(true)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute right-3 z-1 cursor-pointer"
                      size={20}
                      onClick={() => setShowCurrentPassword(false)}
                    />
                  )}
                </div>
                {errors.current_password && touched.current_password && (
                  <span className="text-red-500 w-[90%] pt-1 text-xs block">
                    {errors.current_password}
                  </span>
                )}
              </div>
              <div className="w-[90%] ">
                <div className="w-full relative flex justify-end items-center">
                  <input
                    type={!showPassword ? "password" : "text"} // Input field for the new password
                    placeholder="Contraseña*"
                    onChange={handleChange} // Handles input change
                    name="new_password"
                    id="new_password"
                    value={values.new_password}
                    className={`w-full h-12 pl-5 text-[#000] outline-[#367DFD] border-2 ${
                      errors.new_password && touched.new_password
                        ? "border-red-500"
                        : "border-gray-400"
                    } rounded-md`}
                  />
                  {!showPassword ? (
                    <AiOutlineEyeInvisible
                      className="absolute  right-3 z-1 cursor-pointer"
                      size={20}
                      onClick={() => setShowPassword(true)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute right-3 z-1 cursor-pointer"
                      size={20}
                      onClick={() => setShowPassword(false)}
                    />
                  )}
                </div>
                {errors.new_password && touched.new_password && (
                  <span className="text-red-500 w-[90%] text-xs block">
                    {errors.new_password}
                  </span>
                )}
              </div>
              <div className="w-[90%]">
                <div className="w-full relative flex justify-end items-center">
                  <input
                    type={!showConfirmPassword ? "password" : "text"} // Input field for confirming the new password
                    placeholder="Repetir contraseña"
                    name="retype_new_password"
                    id="retype_new_password"
                    value={values.retype_new_password}
                    onChange={handleChange} // Handles input change
                    className={`w-full h-12 pl-5 text-[#000] outline-[#367DFD] border-2 ${
                      (errors.retype_new_password &&
                        touched.retype_new_password) ||
                      (values.retype_new_password != values.new_password &&
                        values.retype_new_password.length > 0)
                        ? "border-red-500"
                        : "border-gray-400"
                    } rounded-md`}
                  />
                  {!showConfirmPassword ? (
                    <AiOutlineEyeInvisible
                      className="absolute  right-3 z-1 cursor-pointer"
                      size={20}
                      onClick={() => setShowConfirmPassword(true)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute right-3 z-1 cursor-pointer"
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
              className="bg-gradient-custom-2 text-white py-1 px-2.5 text-xl font-[600] cursor-pointer border-none outline-none rounded-md w-[190px] h-[40px] mx-auto my-5"
            >
              Cambiar {/* Button text */}
            </button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileToggle;
