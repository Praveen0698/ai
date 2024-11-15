/*****
 @author: KayJayGlobal
 @purpose: This component handles email verification form and design text display
******/
import EmailVerifyForm from "./forms/EmailVerifyForm"; // Imports the form for email verification
import TextAuth from "@/app/components/common/TextAuth"; // Imports the TextAuth component for additional design text
import React from "react";

// Page component responsible for rendering the email verification form and text design information
const page = () => {
  return (
    <div className="flex justify-between items-center">
      {/* Renders the TextAuth component */}
      <TextAuth />

      {/* Renders the EmailVerifyForm component */}
      <EmailVerifyForm />
    </div>
  );
};

export default page;
