import { baseUrl } from "@/config/BaseUrl";

export const login = (formData: object) => {
  return fetch(
    `${baseUrl}/api/users/signin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
};

export const verifyEmail = (formData: object) => {
  return fetch(
    `${baseUrl}/api/users/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
};
