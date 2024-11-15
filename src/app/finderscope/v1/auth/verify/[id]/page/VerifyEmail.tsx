/*****
 @author: Kayglobal
 @purpose: This component handles verification sent message.
******/
"use client"; // This component is a client component in Next.js
import React, { useEffect, useState } from "react"; // Import React and useEffect for lifecycle methods
import { CiGlobe } from "react-icons/ci"; // Importing a globe icon for language selection
import { IoIosArrowDown } from "react-icons/io"; // Importing an arrow-down icon for dropdown indication
import { useParams, useRouter } from "next/navigation"; // Importing the useRouter hook for navigation
import { verifyTokenId } from "../api/verify";
import Loader from "@/app/components/common/Loader";
import { notify } from "@/utils/notify";

const VerifyEmail = () => {
  const [loaderOpen, setLoaderOpen] = useState(false);

  const refresh =
    typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
  useEffect(() => {
    if (refresh) {
      router.push("/finderscope/v1/search");
    }
  }, []);

  const closeLoader = () => {
    setLoaderOpen(false);
  };
  const router = useRouter(); // Initialize the router for navigation
  const { id } = useParams();

  const verifyToken = async (token: string) => {
    notify("Redirecting to login page", "success");
    verifyTokenId(token)
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        if (data.success && data.message[0] === "User verified successfully") {
          setTimeout(() => {
            router.push("/"); // Redirect to the login page after 2 seconds
          }, 2000);
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
  }, []);

  return (
    <div className="h-screen w-[45%] relative p-8 flex justify-center items-center">
      <div className="absolute top-7 right-7 flex justify-center items-center gap-1">
        <CiGlobe />
        <span>Español</span>
        <IoIosArrowDown />
      </div>
      <div className="w-[100%] flex justify-center items-center flex-col text-center">
        <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
        <h2 className="text[46.13px] font-[600]">Verificación exitosa</h2>{" "}
        {/* Title for verification message */}
        <p className="text-[#ACACAC] text-sm mt-2.5">
          Redirigir a la página de inicio de sesión
          {/* Informational message */}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail; // Export the VerifyEmail component for use in other parts of the application
