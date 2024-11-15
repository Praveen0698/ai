/*****
 @author: KayJayGlobal
 @purpose: User Chat form
 @method: POST
 @Req Param: {
    input
 }
 @response: JSON
******/

/*****
 @author: Kayglobal
 @purpose: This component handles user reset password by allowing users to input their query.
******/
"use client"; // This component is a client component in Next.js

import React, { ChangeEvent, FormEvent, useState } from "react"; // Import React and types for handling events
import { IoArrowUpCircleSharp } from "react-icons/io5";
import { FaRegStopCircle } from "react-icons/fa";

// Define the props interface for ChatForm component
interface ChatFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void; // Function to handle form submission
  input: string; // Input text value
  isLoading: boolean;
  stop: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void; // Function to handle input change events
}

// ChatForm functional component
const ChatForm: React.FC<ChatFormProps> = ({
  handleSubmit,
  input,
  handleInputChange,
  isLoading,
  stop,
}) => {
  return (
    // Form that triggers handleSubmit on submission
    <form
      onSubmit={handleSubmit} // Attach the submit handler
      className=" w-[95%] flex justify-between items-center p-1.5 rounded-full bg-[#F4F4F4] m-auto"
    >
      <input
        className="flex-grow h-[40px] bg-transparent outline-none text-sm font-medium text-[#686868] pl-3 placeholder-custom-gray placeholder-font-medium placeholder-text-lg"
        type="text" // Input type is text
        placeholder="Envía un mensaje a Finderscope" // Placeholder text for the input field
        value={input} // Controlled input value
        onChange={handleInputChange} // Attach input change handler
      />
      <button
        type="submit" // Button type is submit to trigger form submission
        className="border-none outline-none text-lg font-medium text-[#686868] cursor-pointer bg-none ml-2"
      >
        {isLoading ? (
          <FaRegStopCircle className="text-2xl text-black" onClick={stop} />
        ) : (
          <IoArrowUpCircleSharp className="text-3xl text-black" />
        )}
        {/* Submit button icon */}
      </button>
    </form>
  );
};

export default ChatForm; // Export the ChatForm component for use in other parts of the application
