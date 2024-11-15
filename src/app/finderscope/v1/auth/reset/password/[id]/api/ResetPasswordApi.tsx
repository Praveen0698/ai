import { baseUrl } from "@/config/BaseUrl";

export const resetPassword = (formData: object) => {
  return fetch(
    `${baseUrl}/api/users/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
};

export const verifyTokenId = (token: string) => {
  return fetch(
    `${baseUrl}/api/users/verify/${token}`,
    {
      method: "GET",
    }
  );
};
