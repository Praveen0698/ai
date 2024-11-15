/*****
@author: KayJayGlobal
@purpose: This component renders the user registration page layout with two main sections: 
1. `TextAuth`: Responsible for displaying authentication-related text or branding.
2. `VerifyEmail`: A form component for handling verification link message.

@method: Functional component
@usage: This component is part of a Next.js application and is used for rendering the verification link message.
******/

import TextAuth from "@/app/components/common/TextAuth"; // Import the TextAuth component for design display
import VerifyEmail from "./page/VerifyEmail"; // Import the VerifyEmail component for email verification
import React from "react"; // Import React to use JSX syntax

const page = () => {
  return (
    <div className="flex justify-between items-center">
      {/* Container for layout with flexbox for horizontal alignment */}
      <TextAuth />
      {/* Component to display authentication-related text or options */}
      <VerifyEmail />
      {/* Component responsible for handling email verification */}
    </div>
  );
};

export default page; // Export the component for use in other parts of the application
