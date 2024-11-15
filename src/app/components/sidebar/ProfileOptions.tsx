/*****
 @author: KayJayGlobal
 @purpose: Component for rendering the profile options form in th navbar
******/

"use client";
import React, { useEffect, useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdOutlinePassword, MdLogout } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation"; // Next.js hook to handle navigation
import Loader from "../common/Loader";

interface MyJwtPayload {
  name: string; // The user's name
}

interface ProfileOptionsProps {
  handleOpen: () => void;
  getProfileData: MyJwtPayload | null; // Now it's the actual data, not a function
}

const ProfileOptions: React.FC<ProfileOptionsProps> = ({
  handleOpen,
  getProfileData,
}) => {
  const router = useRouter(); // Hook to handle routing within the app
  const optionsRef = useRef<HTMLDivElement>(null); // To track the options block
  const [loaderOpen, setLoaderOpen] = useState(false);
  const pathname = usePathname(); // Gets the current path
  const login =
    typeof window !== "undefined" ? localStorage.getItem("login") : null;

  const openLoader = () => {
    setLoaderOpen(true);
  };

  const closeLoader = () => {
    setLoaderOpen(false);
  };
  const [showOptions, setShowOptions] = useState(false);
  const [count, setCount] = useState(0);

  const handleLogout = () => {
    openLoader();
    localStorage.removeItem("access");
    localStorage.removeItem("login");
    localStorage.removeItem("refresh");
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false); // Close options if clicked outside
        setCount(0); // Reset count to 0
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);

  return (
    <div
      className="flex justify-between w-[100%] items-center gap-2 cursor-pointer relative"
      onClick={() => {
        if (count === 0) {
          setShowOptions(true);
          setCount(1);
        } else {
          setShowOptions(false);
          setCount(0);
        }
      }}
    >
      <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
      <div className="flex justify-center items-center gap-2">
        <div className="flex justify-center items-center w-7 h-7 rounded-full bg-slate-400">
          <span className="font-semibold text-white text-sm">
            {getProfileData?.name[0]}
          </span>
        </div>
        {getProfileData ? (
          <span className=" text-sm text-[#343541] font-semibold">
            {getProfileData?.name}
          </span>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <IoIosArrowDown />
      {showOptions ? (
        <div
          ref={optionsRef}
          className="absolute bottom-[150%] z-50 bg-white p-3 flex flex-col gap-2"
        >
          <p
            className="flex justify-start items-center gap-2 text-[#1B216A] text-sm font-medium"
            onClick={() => {
              if (pathname !== "/finderscope/v1/profile") {
                openLoader();
                router.push("/finderscope/v1/profile");
              }
            }}
          >
            <CgProfile />
            My Profile
          </p>
          <hr className="border-[#E7E7E7] border-[1px]" />
          {login === "google" ? null : (
            <>
              <p
                className="flex justify-start items-center gap-2 text-[#1B216A] text-sm font-medium"
                onClick={() => {
                  handleOpen();
                }}
              >
                <MdOutlinePassword />
                Change Password
              </p>
              <hr className="border-[#E7E7E7] border-[1px]" />{" "}
            </>
          )}

          <p
            className="flex justify-start items-center gap-2 text-[#1B216A] text-sm font-medium"
            onClick={handleLogout}
          >
            <MdLogout />
            Logout
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileOptions;
