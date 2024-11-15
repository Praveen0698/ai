import { baseUrl } from "@/config/BaseUrl";

export const emailVerify = (formData: object) => {
  return fetch(
    `${baseUrl}/api/users/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
};
