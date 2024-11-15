/*****
@author: KayJayGlobal
@purpose: This component renders the user registration page layout with two main sections: 
1. `TextAuth`: Responsible for displaying authentication-related text or branding.
2. `RegisterForm`: A form component for handling user registration.

@method: Functional component
@usage: This component is part of a Next.js application and is used for rendering the user registration page.
******/

import RegisterForm from "./forms/RegisterForm"; // Import the registration form component
import TextAuth from "@/app/components/common/TextAuth"; // Import the text/branding for authentication
import React from "react"; // Import React to use JSX syntax

const page = () => {
  return (
    // Create a flex container for layout that aligns items horizontally in the center
    <div className="flex justify-between items-center">
      <TextAuth /> {/* Displays authentication text or branding */}
      <RegisterForm /> {/* Displays the form for user registration */}
    </div>
  );
};

export default page; // Export the component for use in routing
