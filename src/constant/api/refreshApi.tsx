import { baseUrl } from "@/config/BaseUrl";

export const validateRefresh = () => {
  const token = localStorage.getItem("refresh") || "";
  return fetch(`${baseUrl}/api/users/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Adding the token to the Authorization header
    },
  });
};
