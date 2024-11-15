import { baseUrl } from "@/config/BaseUrl";

export const conversationId = (conversationData: object) => {
  const token = localStorage.getItem("access") || "";
  return fetch(`${baseUrl}/api/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`, // Adding the token to the Authorization header
    },
    body: JSON.stringify(conversationData), // Assuming formData is your payload
  });
};

export const messagesPrompt = (messageData: object) => {
  const token = localStorage.getItem("access") || "";
  return fetch(`${baseUrl}/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`, // Adding the token to the Authorization header
    },
    body: JSON.stringify(messageData), // Assuming formData is your payload
  });
};

export const messagesSet = (id: string | null) => {
  const token = localStorage.getItem("access") || "";
  return fetch(`${baseUrl}/api/conversations/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`, // Adding the token to the Authorization header
    },
  });
};
