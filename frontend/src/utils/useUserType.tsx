import { useEffect, useState } from "react";
import { useAuthorizedData } from "./useAuthorizedData";

export const useUserType = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const [userData, status] = useAuthorizedData<any>("/core/me/");

  useEffect(() => {
    if (status === "idle" && userData) {
      setUserType(userData[0]?.user_type || null);
    }
  }, [userData, status]);

  return { userType, status };
};
