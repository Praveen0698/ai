// import connectDB from "@/utils/db";
// import DynamicProduct from "@/model/DynamicProduct";

// // Export the POST method as a named export
// export async function POST(req) {
//   try {
//     // Connect to the MongoDB database
//     await connectDB();

//     // Parse the incoming JSON request body
//     const jsonData = await req.json();
//     console.log(jsonData);
//     // Create a new Product entry with dynamic structure
//     const newProduct = new DynamicProduct(jsonData);
//     await newProduct.save(); // Save to MongoDB

//     // Return a success response
//     return new Response(
//       JSON.stringify({ message: "Data saved successfully!" }),
//       {
//         status: 201,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   } catch (error) {
//     console.error("Error saving data:", error);

//     // Return an error response
//     return new Response(JSON.stringify({ error: "Failed to save data" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

import connectDB from "@/utils/db";
import DynamicProduct from "@/model/DynamicProduct";

export async function POST(req) {
  try {
    // Connect to the MongoDB database
    await connectDB();

    // Parse the incoming JSON request body
    const jsonData = await req.json();

    // Ensure the incoming data is an array
    if (!Array.isArray(jsonData)) {
      return new Response(
        JSON.stringify({ error: "Invalid data format. Expected an array." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Loop through the array and save each entry to MongoDB
    for (const data of jsonData) {
      const newProduct = new DynamicProduct(data);
      await newProduct.save(); // Save each product to MongoDB
    }

    // Return a success response after all items are saved
    return new Response(
      JSON.stringify({ message: "All data saved successfully!" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving data:", error);

    // Return an error response
    return new Response(JSON.stringify({ error: "Failed to save data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
