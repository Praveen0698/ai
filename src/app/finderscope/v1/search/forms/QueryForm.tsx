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

import React, { ChangeEvent, FormEvent } from "react"; // Import React and event types
import { FaArrowRight } from "react-icons/fa6"; // Importing an arrow icon for the submit button

// Define the props interface for QueryForm component
interface QueryFormProps {
  input: string; // The input value from the textarea
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void; // Function to handle form submission
  setInput: React.Dispatch<React.SetStateAction<string>>; // The input value from the textarea
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void; // Function to handle textarea input change
}

// QueryForm functional component
const QueryForm: React.FC<QueryFormProps> = ({
  input,
  handleInputChange,
  setInput,
  handleSubmit,
}) => {
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter: Insert a newline
        e.preventDefault();
        setInput((prevInput) => prevInput + "\n");
      } else {
        // Enter without Shift: Submit the form
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  return (
    // Form that triggers handleSubmit on submission
    <form
      onSubmit={handleSubmit} // Attach the submit handler
      className="w-[851px] h-[156px] relative flex justify-between items-center rounded-lg  my-10"
    >
      <textarea
        className="border-[3px] border-[#D6D6D6] resize-none bg-[#F8F8F8] outline-[#367DFD] w-[851px] h-[156px] mx-auto text-sm rounded-lg font-medium text-[#686868] pl-3 pt-3 placeholder-[#797A7D] placeholder-font-medium placeholder-text-lg"
        placeholder="¿En qué te puedo ayudar?." // Placeholder text for the textarea
        value={input} // Controlled input value
        onChange={handleInputChange} // Attach input change handler
        required // Mark textarea as required
        onKeyDown={handleKeyDown}
      />
      <button
        disabled={input.length === 0} // Disable button if input is empty
        type="submit" // Button type is submit to trigger form submission
        className="border-none bg-[#B5B5B1] rounded-full p-2 outline-none text-lg absolute bottom-5 right-5 font-medium text-[#686868] cursor-pointer bg-none"
      >
        <FaArrowRight /> {/* Submit button icon */}
      </button>
    </form>
  );
};

export default QueryForm; // Export the QueryForm component for use in other parts of the application
