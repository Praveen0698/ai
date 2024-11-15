/*****
 @author: KayJayGlobal
 @purpose: Guest user login alert pop
******/
"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Import Google icon
import { FaFacebook } from "react-icons/fa6"; // Import Facebook icon
import { useRouter } from "next/navigation"; // Hook for routing
import Loader from "@/app/components/common/Loader";
import { baseUrl } from "@/config/BaseUrl";
// Define props for the GuestLogin component
type GuestLoginProps = {
  showModal: boolean; // Boolean to control modal visibility
};

// Main GuestLogin component
const GuestLogin: React.FC<GuestLoginProps> = ({ showModal }) => {
  const router = useRouter(); // Initialize router for navigation
  const [loaderOpen, setLoaderOpen] = useState(false);

  const openLoader = () => {
    setLoaderOpen(true);
  };

  const closeLoader = () => {
    setLoaderOpen(false);
  };

  return (
    <div className="h-screen flex absolute right-0 items-center justify-center">
      <Loader closeLoader={closeLoader} loaderOpen={loaderOpen} />
      {showModal && ( // Render modal if showModal is true
        <div className="fixed inset-0 bg-[#322e2e] flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Por favor, inicie sesión para continuar
            </h2>
            {/* Button to navigate to login page */}
            <button
              type="button"
              onClick={() => {
                openLoader?.();
                router.push("/");
              }} // Navigate to home
              className="bg-gradient-to-r from-[#87a1ff] to-[#ced7ff] text-white py-1 px-2.5 text-xs font-bold cursor-pointer border-none outline-none rounded-md w-[100px] mx-auto my-2 mt-5"
            >
              Iniciar sesión
            </button>
            {/* Text prompting user to register if they don’t have an account */}
            <p className="text-xs font-medium text-center my-5">
              ¿No tienes cuenta?
              <span
                className="text-[#3c9d87] cursor-pointer ml-1"
                onClick={() => {
                  openLoader?.();
                  router.push("/finderscope/v1/auth/register");
                }} // Navigate to registration page
              >
                Regístrate
              </span>
            </p>
            {/* Social login buttons */}
            <div className="flex justify-center items-center gap-5 flex-col mx-0 w-[100%] mb-5">
              {/* Button for Google login */}
              <a
                href={`${baseUrl}/api/auth/google`}
                className="w-[80%] py-2.5 px-0 bg-transparent border-2 border-gray-400 rounded-[50px] flex justify-center items-center gap-5 text-[14px] text-[#736a6a] cursor-pointer"
              >
                <FcGoogle className="text-[16px]" /> Continuar con Google
              </a>
              {/* Button for Facebook login */}
              <a className="w-[80%] py-2.5 px-0 bg-transparent border-2 border-gray-400 rounded-[50px] flex justify-center items-center gap-5 text-[14px] text-[#736a6a] cursor-pointer">
                <FaFacebook className="text-[16px] text-[#0066FF]" />
                Continuar con Facebook
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestLogin; // Export the GuestLogin component
