// utils/userId.ts
import api from "./api";

export const fetchUserId = async (): Promise<string | null> => {
  try {
    const response = await api.get("/core/me/");
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0].id;
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
  }
  return null;
};
