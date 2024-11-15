"use client";
import Sidebar from "@/app/components/common/Sidebar";
import React, { useEffect, useState } from "react";
import { changeProfile, getProfile } from "../api/profileApi";
import { notify } from "@/utils/notify";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/common/Loader";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useHandleValidateRefresh } from "@/constant/RefreshValidate";
import SidebarWrapper from "@/app/components/layout/SidebarWrapper";

interface MyJwtPayload {
  _id: string; // The user's id
  name: string; // The user's name
  email: string; // The user email
}

/*****
 @object: vailidetion schema
 @description: This schema are vailidet user inputs email and password  
 *****/
const schema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required") // Ensures the name is not empty
    .min(1, "Name must be at least 1 characters long") // Minimum length check
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
});

const ProfilePage = () => {
  const router = useRouter();
  const [getProfileData, setGetProfileData] = useState<MyJwtPayload | null>(
    null
  ); // Single object or null

  const refresh =
    typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
  const handleValidateRefresh = useHandleValidateRefresh();
  useEffect(() => {
    handleValidateRefresh();
    closeLoader();
  }, []);

  const [loaderOpen, setLoaderOpen] = useState(false);

  const openLoader = () => {
    setLoaderOpen(true);
  };

  const closeLoader = () => {
    setLoaderOpen(false);
  };

  const handleGetProfile = () => {
    openLoader();
    getProfile() // change password api call
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        if (data.success) {
          setGetProfileData(data.user);
          handleChange({
            target: {
              name: "name",
              value: data.user.name, // Value for name
            },
          });
          handleChange({
            target: {
              name: "email",
              value: data.user.email, // Value for email
            },
          });
          closeLoader();
        } else if (
          data.success === false &&
          data.message[0] === "Token expired"
        ) {
          localStorage.removeItem("access");
          router.push("/");
          closeLoader();
        }
      }) // Handle the response data
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    handleGetProfile();
  }, []);

  const [formProfileData, setFormProfileData] = useState({
    _id: "",
    name: getProfileData?.name,
    email: getProfileData?.email,
  });

  const formik = useFormik({
    initialValues: { name: formProfileData.name, email: formProfileData.email },
    validationSchema: schema,
    onSubmit: ({ name, email }) => {
      openLoader();
      changeProfile({ name, email, _id: getProfileData?._id })
        .then((response) => response.json()) // Convert the response to JSON
        .then((data) => {
          if (data.success) {
            notify(data.message[0], "success");
            router.push("/finderscope/v1/search");
            closeLoader();
          } else if (data.success === false) {
            notify(data.message[0], "error");
            closeLoader();
          }
        }) // Handle the response data
        .catch((error) => console.error("Error:", error));
    },
  });

  const [messageId, setMessageId] = useState<string | null>(null);
  const [newChat, setNewChat] = useState(false);
  const [sessionFlag, setSessionFlag] = useState(false);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <>
      {refresh ? (
        <div className="w-[100%] h-screen bg-gradient-to-r from-[#C7DEF8] to-[#b3dbe4]">
          {/* <ChatNavbar /> Render the chat navbar */}
          <div className="flex justify-between items-start gap-5 pt-5 ">
            <SidebarWrapper
              setMessageId={setMessageId}
              setNewChat={setNewChat}
              setSessionFlag={setSessionFlag}
              sessionFlag={sessionFlag}
            />{" "}
            {/* Render the sidebar */}
            <div className="relative  w-[100%] overflow-hidden pr-5">
              <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
              <div className="bg-white w-[100%] h-[95vh] p-5 flex justify-start items-start gap-10 pl-[80px] pt-[80px]">
                <h2 className="font-semibold flex justify-center items-center text-5xl h-[80px] w-[80px] bg-purple-400 text-white rounded-[50px]">
                  {getProfileData?.name[0].toUpperCase()}
                </h2>
                <form
                  className="flex flex-col justify-end w-[65%]"
                  onSubmit={handleSubmit}
                >
                  {/* Form container */}
                  <div className="flex justify-center items-center gap-5 mt-[20px] ">
                    {/* Input fields container */}
                    <div className="w-[80%]">
                      <input
                        type="text" // Input field for confirming the name
                        placeholder="Nombre"
                        name="name"
                        id="name"
                        value={values.name}
                        onChange={handleChange} // Handles input change
                        className={`w-full h-12 pl-5 text-[#000] outline-[#367DFD] border-2 border-gray-400 rounded-md ${
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
                        type="email" // Input field for email
                        placeholder="Correo electrónico"
                        name="email"
                        id="email"
                        disabled
                        value={values.email}
                        onChange={handleChange} // Handles input change
                        className={`w-full h-12 pl-5 text-[#000] outline-[#367DFD] border-2 border-gray-400 rounded-md ${
                          errors.email && touched.email && "!border-red-500"
                        }`}
                      />
                      {errors.email && touched.email && (
                        <span className="text-red-500 w-[80%] pt-1 text-xs block">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end items-end gap-5">
                    <button
                      type="submit" // Button to submit the form
                      className="bg-gradient-custom-2 text-white py-1 px-2.5 text-xs font-bold cursor-pointer border-none outline-none rounded-md w-[100px] my-5"
                    >
                      Confirm {/* Button text */}
                    </button>
                    <button
                      type="button" // Button to submit the form
                      onClick={() => {
                        openLoader();
                        router.push("/finderscope/v1/profile");
                      }}
                      className="bg-gradient-to-r from-[#d14920] to-[#ec1b03] text-white py-1 px-2.5 text-xs font-bold cursor-pointer border-none outline-none rounded-md w-[100px] my-5"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ProfilePage;
