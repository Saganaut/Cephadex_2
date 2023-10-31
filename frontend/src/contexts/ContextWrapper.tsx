import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "@store/store";
import React from "react";
import { Provider } from "react-redux";

import { FilterProvider } from "./FilterContext";
import { ModalProvider } from "./ModalContext";
import { UserProvider } from "./UserContext";

interface ContextWrapperProps {
  children: React.ReactNode;
}
const ContextWrapper: React.FC<ContextWrapperProps> = ({ children }) => {
  return (
    <div>
      <Provider store={store}>
        <UserProvider>
          <GoogleOAuthProvider clientId="945000040547-5j6598rtn7ikp4n0h4npsrvbkdk0il5u.apps.googleusercontent.com">
            {" "}
            <FilterProvider>
              <ModalProvider>{children}</ModalProvider>{" "}
            </FilterProvider>
          </GoogleOAuthProvider>
        </UserProvider>
      </Provider>
    </div>
  );
};

export { ContextWrapper };
