// import { fetchUserSettings } from "@services/Api/User/UserApi";
// import { checkUserAuth } from "@services/CheckUserAuth";
// import React, { createContext, useContext, useEffect, useState } from "react";

// interface UserContextProps {
//   user: any;
//   setUserData: (userData: any) => void;
//   clearUserData: () => void;
//   userSettings: any;
//   setUserSettingsData: (settingsData: any) => void;
// }
// const UserContext = createContext<UserContextProps | null>(null);

// interface UserProviderProps {
//   children: React.ReactNode;
// }
// const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userSettings, setUserSettings] = useState(null);

//   const setUserSettingsData = (
//     settingsData: React.SetStateAction<null>
//   ): void => {
//     setUserSettings(settingsData);
//   };

//   const setUserData = (userData: React.SetStateAction<null>): void => {
//     console.log("entered setUserData");
//     console.log(userData);
//     setUser(userData);
//   };

//   const clearUserData = (): void => {
//     setUser(null);
//     setUserSettings(null);
//   };

//   const contextValue = {
//     user,
//     setUserData,
//     clearUserData,
//     userSettings,
//     setUserSettingsData,
//   };

//   useEffect(() => {
//     const fetchUser = async (): Promise<void> => {
//       const user = await checkUserAuth();
//       if (user !== false) {
//         setUser(user);
//       }
//       const user_settings = await fetchUserSettings();
//       if (user_settings !== false) {
//         setUserSettings(user_settings);
//       }
//     };

//     void fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
//   );
// };

// const useUser = (): UserContextProps => {
//   const context = useContext(UserContext);
//   if (context == null) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };

// export { UserContext };
// export { useUser };
// export { UserProvider };
