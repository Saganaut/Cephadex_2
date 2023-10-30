import React, { createContext, useState, useContext, useEffect } from "react";
import { checkUserAuth } from "../services/CheckUserAuth";
import { fetchUserSettings } from "../services/Api/User/UserApi";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userSettings, setUserSettings] = useState(null);

  const setUserSettingsData = (settingsData) => {
    setUserSettings(settingsData);
  };

  const setUserData = (userData) => {
    console.log("entered setUserData");
    console.log(userData);
    setUser(userData);
  };

  const clearUserData = () => {
    setUser(null);
    setUserSettings(null);
  };

  const contextValue = {
    user,
    setUserData,
    clearUserData,
    userSettings,
    setUserSettingsData,
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await checkUserAuth();
      if (user !== false) {
        setUser(user);
      }
      const user_settings = await fetchUserSettings();
      if (user_settings !== false) {
        setUserSettings(user_settings);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserContext };
export { useUser };
export { UserProvider };
