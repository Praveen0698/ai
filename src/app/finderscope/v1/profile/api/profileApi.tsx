import { baseUrl } from "@/config/BaseUrl";

export const getProfile = () => {
  const token = localStorage.getItem("access") || "";
  return fetch(`${baseUrl}/api/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`, // Adding the token to the Authorization header
    },
  });
};

export const deleteProfile = (id: string | undefined) => {
  const token = localStorage.getItem("access") || "";
  return fetch(`${baseUrl}/api/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`, // Adding the token to the Authorization header
    },
  });
};

export const changeProfile = (formProfileData: object) => {
  const token = localStorage.getItem("access") || "";
  return fetch(`${baseUrl}/api/users/update-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`, // Adding the token to the Authorization header
    },
    body: JSON.stringify(formProfileData), // Assuming formData is your payload
  });
};
