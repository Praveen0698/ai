/*****
 @author: KayJayGlobal
 @purpose: Render products in card view
******/
"use client"; // Indicate that this component is a client component

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaEuroSign } from "react-icons/fa"; // Import Euro sign icon
import NewLogo from "../../../../../../public/assets/newLogo.png"; // Logo asset

// Define the structure of a Product interface
interface Product {
  Title: string; // Product title
  Price: string; // Product price
  URL_Long: string; // Long URL for the product
  URL_Short: string; // Short URL for the product
  Marketplace: string; // Marketplace of the product
  Features: string | { [key: string]: string }; // Features can be a string or an object
}

// Define the props for the RenderListItem component
interface RenderListItemProps {
  items: string; // JSON string containing product data
  userLastMsg: string; // The last message from the user
  setInput: React.Dispatch<React.SetStateAction<string>>; // Function to set input state
}

// Main RenderListItem component
const RenderListItem: React.FC<RenderListItemProps> = ({
  items,
  userLastMsg,
  setInput,
}) => {
  // State to hold the products fetched from the parsed JSON
  const [productsGot, setProductsGot] = useState<Product[]>([]);

  // Effect to parse the incoming JSON string and update state
  useEffect(() => {
    if (items) {
      try {
        const parsedData = JSON.parse(items); // Parse the JSON string

        // Check if parsed data is an array of products
        if (Array.isArray(parsedData.products)) {
          setProductsGot(parsedData.products);
        } else if (Array.isArray(parsedData)) {
          setProductsGot(parsedData); // Set products if it's a direct array
        } else {
          setProductsGot([]); // Reset if data structure is unexpected
        }
      } catch (error) {
        console.error("Error parsing JSON:", error); // Log JSON parsing error
        setProductsGot([]); // Reset products state on error
      }
    } else {
      console.error("No JSON content found."); // Log if no items provided
      setProductsGot([]); // Reset products state
    }
  }, [items]); // Re-run effect when items change

  return (
    <>
      <Image
        src={NewLogo}
        alt="logo"
        className="inline-block"
        width={40}
        height={25}
      />
      <div className="px-2.5 bg-[#fff] rounded text-[#343541] inline-block font-normal text-sm">
        <h2
          className="text-[#343541] font-semibold text-lg"
          style={{ margin: "0" }}
        >
          Here are some results
        </h2>
        <div className="grid grid-cols-3 gap-5 ml-2.5">
          {productsGot && productsGot.length > 0 ? ( // Check if products exist
            productsGot.map((product, index) => (
              <div
                key={index} // Unique key for each product
                className="mb-2.5 flex justify-between items-start flex-col"
              >
                <h3 className="text-[#343541] text-sm font-semibold flex justify-center items-start gap-1">
                  <span>{index + 1}.</span>{" "}
                  {product.Title || "Untitled Product"}{" "}
                </h3>

                <div className="grid grid-cols-1">
                  {typeof product.Features === "string" ? ( // Check if Features is a string
                    <p className="text-[#343541] font-normal text-xs py-1 px-5 flex justify-start items-start gap-2">
                      <span>&#x2022;</span> {product.Features}
                    </p>
                  ) : (
                    Object.entries(product.Features).map(
                      (
                        [key, value],
                        idx // Handle object features
                      ) => (
                        <p
                          key={idx} // Unique key for each feature
                          className="text-[#343541] font-normal text-xs py-1 px-5 flex justify-start items-start gap-2 !mb-0"
                        >
                          <span>&#x2022;</span>
                          <span className="font-bold">
                            {key.charAt(0).toUpperCase() +
                              key.slice(1).replace(/_/g, " ")}
                            :
                          </span>{" "}
                          {String(value)}
                        </p>
                      )
                    )
                  )}
                </div>

                {/* Product details section */}
                <div className="flex justify-evenly items-center m-5 border-1 border-gray-400 rounded-[3px] bg-[#f4f4f4] w-[95%] text-center">
                  <span className="flex p-1 text-center">
                    {product.Marketplace}
                  </span>
                  <span className="text-[#d4d4d4]">|</span>
                  <span className="flex items-center p-1 gap-1 text-center">
                    {product.Price} <FaEuroSign className="text-xs" />
                  </span>
                  <span className="text-[#d4d4d4]">|</span>
                  <span className="flex p-1 text-center">
                    <a
                      href={product.URL_Long} // Link to buy the product
                      className="text-[#000] border-[1px] border-black px-3 py-0.5 rounded text-xs no-underline hover:underline"
                      target="_blank"
                      rel="noopener noreferrer" // Security for external links
                    >
                      BUY
                    </a>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p> // Message if no products are available
          )}
        </div>

        {/* Optional refresh button to reset input */}
        {/* <div>
        <button onClick={() => setInput(userLastMsg)}>Refresh</button>
      </div> */}
      </div>
    </>
  );
};

export default RenderListItem; // Export the RenderListItem component
