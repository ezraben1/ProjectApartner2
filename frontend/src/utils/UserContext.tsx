// src/UserContext.tsx

import { createContext, useContext, useState } from "react";

type UserContextType = {
  currentUser: any;
  setCurrentUser: (user: any) => void;
};

const UserContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
