import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserDetailContext = createContext();

export const UserDetailProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUserDetail(JSON.parse(storedUser));
    };
    loadUser();
  }, []);

  const saveUser = async (user) => {
    setUserDetail(user);
    await AsyncStorage.setItem("user", JSON.stringify(user));
  };

  const logoutUser = async () => {
    setUserDetail(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, saveUser, logoutUser }}>
      {children}
    </UserDetailContext.Provider>
  );
};