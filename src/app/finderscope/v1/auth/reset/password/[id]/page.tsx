/*****
@author: KayJayGlobal
@purpose: This component renders the user registration page layout with two main sections: 
1. `TextAuth`: Responsible for displaying authentication-related text or branding.
2. `ResetPasswordForm`: A form component for handling user reset password.

@method: Functional component
@usage: This component is part of a Next.js application and is used for rendering the user reset password page.
******/
import TextAuth from "@/app/components/common/TextAuth"; // Import the TextAuth component for displaying authentication text
import ResetPasswordForm from "./forms/ResetPasswordForm"; // Import the ResetPasswordForm component for resetting user password

const page = () => {
  return (
    <div className="flex justify-between items-center">
      {/* Flex container to arrange child components horizontally */}
      <TextAuth /> {/* Render the TextAuth component */}
      <ResetPasswordForm /> {/* Render the ResetPasswordForm component */}
    </div>
  );
};

export default page; // Export the page component for use in routing or other components
