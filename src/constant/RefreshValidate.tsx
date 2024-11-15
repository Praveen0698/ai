import { useRouter } from "next/navigation";
import { validateRefresh } from "./api/refreshApi";

export const useHandleValidateRefresh = () => {
  const router = useRouter();

  const handleValidateRefresh = () => {
    validateRefresh() // API call for refreshing the token
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        if (data && data.accessToken) {
          localStorage.setItem("access", data.accessToken);
        } else if (
          data.message === "invalid token" ||
          data.message === "Refresh token is required."
        ) {
          localStorage.removeItem("access");
          router.push("/"); // Redirect to home if token is invalid
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return handleValidateRefresh;
};
