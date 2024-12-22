import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "",
    email: "", // Email is required for database updates
    weight: null,
    height: null,
    age: null,
  });

  const updateUser = (newData) => {
    // Ensure the email is correctly set
    setUser((prev) => ({
      ...prev,
      ...newData,
    }));
  };
  

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
