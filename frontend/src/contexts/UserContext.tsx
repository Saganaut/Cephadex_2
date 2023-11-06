import { type User, type UserSettings } from "@customTypes//User";
import { fetchUserSettings } from "@services/Api/User/UserApi";
import { checkUserAuth } from "@services/CheckUserAuth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextProps {
  user: User | null;
  setUserData: (userData: User) => void;
  clearUserData: () => void;
  userSettings: UserSettings | null;
  setUserSettingsData: (settingsData: UserSettings) => void;
}
const UserContext = createContext<UserContextProps | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
}
const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const setUserSettingsData = (
    settingsData: React.SetStateAction<UserSettings | null>
  ): void => {
    setUserSettings(settingsData);
  };

  const setUserData = (userData: React.SetStateAction<User | null>): void => {
    console.log("entered setUserData");
    console.log(userData);
    setUser(userData);
  };

  const clearUserData = (): void => {
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
    const fetchUser = async (): Promise<void> => {
      const checkUserAuthResponse = await checkUserAuth();
      if (checkUserAuthResponse.isLoggedIn) {
        setUser(checkUserAuthResponse.user);
      }
      const userSettingsResponse = await fetchUserSettings();
      if (userSettingsResponse.isLoggedIn) {
        setUserSettings(userSettingsResponse.userSettings);
      }
    };

    void fetchUser();
  }, []);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context == null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserContext };
export { useUser };
export { UserProvider };
