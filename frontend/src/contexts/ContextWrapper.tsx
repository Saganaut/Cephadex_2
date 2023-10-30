import React from "react";
import { ModalProvider } from "./ModalContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./UserContext";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { FilterProvider } from "./FilterContext";

const ContextWrapper = ({ children }) => {
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
