import { baseUrl } from "@/config/BaseUrl";

export const register = (formData: object) => {
  return fetch(
    `${baseUrl}/api/users/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
};
