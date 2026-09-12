import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "@source/lib/store/store";
import React from "react";
import { Provider } from "react-redux";

import { BannerProvider } from "./BannerContext";
import { CardContextProvider } from "./CardContext";
import { DeckContextsProvider } from "./DeckContexts";
import { DeckNotificationProvider } from "./DeckNotificationContext";
import { FeedbackProvider } from "./FeedbackContext";
import { FileContextProvider } from "./FileContext";
import { FilterProvider } from "./FilterContext";
import { MessagingModalProvider } from "./MessagingContext";
import { ModalProvider } from "./ModalContext";
import { NotificationsProvider } from "./NotificationsContext";

const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
interface ContextWrapperProps {
  children: React.ReactNode;
}

const ContextWrapper: React.FC<ContextWrapperProps> = ({ children }) => {
  return (
    <div>
      <Provider store={store}>
        <BannerProvider>
          <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
            <NotificationsProvider>
              <MessagingModalProvider>
                <DeckNotificationProvider>
                  <DeckContextsProvider>
                    <CardContextProvider>
                      <FileContextProvider>
                        <FeedbackProvider>
                          <FilterProvider>
                            <ModalProvider>{children}</ModalProvider>{" "}
                          </FilterProvider>
                        </FeedbackProvider>
                      </FileContextProvider>
                    </CardContextProvider>
                  </DeckContextsProvider>
                </DeckNotificationProvider>
              </MessagingModalProvider>
            </NotificationsProvider>
          </GoogleOAuthProvider>
        </BannerProvider>
      </Provider>
    </div>
  );
};

export { ContextWrapper };
