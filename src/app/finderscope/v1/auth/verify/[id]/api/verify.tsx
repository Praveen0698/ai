import { baseUrl } from "@/config/BaseUrl";

export const verifyTokenId = (token: string) => {
  return fetch(
    `${baseUrl}/api/users/verify/${token}`,
    {
      method: "GET",
    }
  );
};
