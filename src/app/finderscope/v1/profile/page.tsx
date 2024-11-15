"use client";
import Sidebar from "@/app/components/common/Sidebar";
import React, { useCallback, useEffect, useState } from "react";
import { changeProfile, deleteProfile, getProfile } from "./api/profileApi";
import { notify } from "@/utils/notify";
import { useRouter } from "next/navigation";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Loader from "@/app/components/common/Loader";
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

const ProfilePage = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
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

  const handleDeleteProfile = (e: any) => {
    e.preventDefault();
    openLoader();
    deleteProfile(getProfileData?._id)
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        if (data.success) {
          notify(data.message[0], "success");
          router.push("/"); // to redirect to home if success
          closeLoader();
          handleClose();
        } else if (data.success === false) {
          notify(data.message[0], "error");
          closeLoader();
          handleClose();
        }
      }) // Handle the response data
      .catch((error) => console.error("Error:", error));
  };

  const [messageId, setMessageId] = useState<string | null>(null);
  const [newChat, setNewChat] = useState(false);
  const [sessionFlag, setSessionFlag] = useState(false);

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
            />
            {/* Render the sidebar */}
            <div className="relative  w-[100%] overflow-hidden pr-5">
              <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
              <div className="bg-white w-[100%] h-[95vh] p-5 flex justify-start items-start gap-10 pl-[80px] pt-[80px]">
                <div className="flex justify-start items-start w-[100%] gap-10">
                  <h2 className="font-semibold flex justify-center items-center text-5xl h-[80px] w-[80px] bg-purple-400 text-white rounded-[50px]">
                    {getProfileData?.name[0].toUpperCase()}
                  </h2>
                  <div className="flex flex-col justify-end w-[65%]">
                    {/* Form container */}
                    <div className="bg-[#87A1FF] px-5 py-2.5 rounded-md">
                      <h1 className="text-white font-bold">
                        Personal Information
                      </h1>
                    </div>
                    <div className="bg-[#e2e2de] px-5 py-2.5 flex justify-center items-center gap-5 mt-[20px] ">
                      {/* Input fields container */}
                      <div className="w-[80%]">
                        <div className="w-[80%] flex justify-start items-start gap-1 flex-col">
                          <label
                            htmlFor="name"
                            className="font-bold text-[#87A1FF] text-sm"
                          >
                            Name:
                          </label>
                          <p className="text-xl font-medium ml-2.5">
                            {getProfileData?.name}
                          </p>
                        </div>
                      </div>
                      <div className="w-[80%] flex justify-start items-start gap-1 flex-col">
                        <label
                          htmlFor="email"
                          className="font-bold text-[#87A1FF] text-sm"
                        >
                          Email
                        </label>
                        <p className="text-xl font-medium ml-2.5">
                          {getProfileData?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-end gap-5">
                      <button
                        onClick={() => {
                          openLoader();
                          router.push("/finderscope/v1/profile/edit");
                        }}
                        type="submit" // Button to submit the form
                        className="bg-gradient-custom-2 text-white py-1 px-2.5 text-xs font-bold cursor-pointer border-none outline-none rounded-md w-[100px] my-5"
                      >
                        Edit {/* Button text */}
                      </button>
                      {/* <button
                  type="button" // Button to submit the form
                  onClick={handleOpen}
                  className="bg-gradient-to-r from-[#d14920] to-[#ec1b03] text-white py-1 px-2.5 text-xs font-bold cursor-pointer border-none outline-none rounded-md w-[100px] my-5"
                >
                  Delete Profile
                </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white outline-none rounded-lg p-4">
                <h1 className="text-sm font-semibold">
                  Are you sure to delete your profile?
                </h1>
                <div className="flex justify-end items-end gap-5 mt-5">
                  <button
                    type="submit" // Button to submit the form
                    onClick={handleDeleteProfile}
                    className="bg-gradient-to-r from-[#87a1ff] to-[#ffd3ce] text-white py-1 px-1 text-xs font-bold cursor-pointer border-none outline-none rounded-md w-[80px]"
                  >
                    Confirm {/* Button text */}
                  </button>
                  <button
                    type="button" // Button to submit the form
                    onClick={handleClose}
                    className="bg-gradient-to-r from-[#d14920] to-[#ec1b03] text-white py-1 px-1 text-xs font-bold cursor-pointer border-none outline-none rounded-md w-[80px]"
                  >
                    Cancel {/* Button text */}
                  </button>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ProfilePage;
