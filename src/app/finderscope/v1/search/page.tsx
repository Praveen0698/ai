"use client"; // Indicate that this component is a client component

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Hook to access search parameters in the URL
import ChatMain from "./pages/ChatMain"; // Import ChatMain component
import GuestLogin from "./pages/GuestLogin"; // Import GuestLogin component
import { useHandleValidateRefresh } from "@/constant/RefreshValidate";

function SearchPage() {
  const router = useRouter(); // Next.js router hook for navigating pages
  const searchParams = useSearchParams(); // Get search parameters from the URL
  const handleValidateRefresh = useHandleValidateRefresh();

  const [isClient, setIsClient] = useState(false); // Check if running on client
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the login modal
  const [totalMessages, setTotalMessages] = useState(false); // State to track if there are total messages
  const [modelOpen, setModelOpen] = useState(false); // State to control the visibility of the model

  const guest = searchParams.get("guest") === "true"; // Check if the guest parameter is set to true
  const loginType = localStorage.getItem("login") || "";

  useEffect(() => {
    setIsClient(true); // Set to true once on client side
  }, []);

  useEffect(() => {
    if (loginType != "google") {
      handleValidateRefresh();
    }
  }, []);

  useEffect(() => {
    const tokenFromParams = searchParams.get("refreshToken") || ""; // Get Access Token from URL if available
    const tokenAccessParams = searchParams.get("accessToken") || ""; // Get Access Token from URL if available
    if (tokenFromParams && tokenAccessParams) {
      localStorage.setItem("refresh", tokenFromParams);
      localStorage.setItem("access", tokenAccessParams);
    }
  }, [searchParams]);

  // Effect to handle modal visibility based on message count and guest status
  useEffect(() => {
    if (totalMessages && guest) {
      setModelOpen(true); // Open the model if there are messages and the user is a guest
      setShowModal(true); // Show the login modal
    } else if (!totalMessages) {
      const timer = setTimeout(() => {
        setShowModal(true); // Show the login modal after 30 seconds if no messages have been received
      }, 300000);

      return () => clearTimeout(timer); // Clean up the timer on component unmount
    }
  }, [totalMessages, guest]); // Run effect whenever totalMessages or guest changes

  // Avoid rendering until on the client side
  if (!isClient) return null;

  return (
    <div>
      {/* Conditionally render GuestLogin or ChatMain based on state */}
      {modelOpen || (showModal && guest) ? (
        <GuestLogin showModal={showModal} /> // Show login modal for guests
      ) : localStorage.getItem("refresh") || guest ? (
        <ChatMain setTotalMessages={setTotalMessages} />
      ) : null}
    </div>
  );
}

export default SearchPage; // Export the SearchPage component
