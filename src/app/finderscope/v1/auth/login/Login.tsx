/*****
 @author: KayJayGlobal
 @purpose: This component handles user login by rendering the login form and design-related text.
******/

import React from "react";
import LoginForm from "./forms/LoginForm"; // Imports the login form component
import TextAuth from "@/app/components/common/TextAuth"; // Imports a text component reperesenting additional design

/*****
 @purpose: Renders the login page, displaying the login form and designed text 
******/
const Login = () => {
  return (
    <div className="flex justify-between items-center">
      {/* Renders the textauth component */}
      <TextAuth />

      {/* Renders the login form for user input */}
      <LoginForm />
    </div>
  );
};

export default Login;
