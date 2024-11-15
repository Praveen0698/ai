import { baseUrl } from "@/config/BaseUrl";

export const changePassword = (formData: object) => {
  const token = localStorage.getItem("access") || "";
  return fetch(`${baseUrl}/api/users/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`, // Adding the token to the Authorization header
    },
    body: JSON.stringify(formData), // Assuming formData is your payload
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

export const getConversation = (token: string) => {
  return fetch(`${baseUrl}/api/conversations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`, // Adding the token to the Authorization header
    },
  });
};
