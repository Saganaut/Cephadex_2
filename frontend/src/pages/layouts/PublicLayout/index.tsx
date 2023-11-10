import { RegisterModal } from "@common/Modals/RegisterModal";
import { SignInModal } from "@common/Modals/SignInModal";
import { Footer } from "@layouts/PublicLayout/Footer/Footer";
import { NavBar } from "@layouts/PublicLayout/NavBar/NavBar";
import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
}
const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <SignInModal />
      <RegisterModal />
      <NavBar />
      <div className="grow">{children}</div>
      <Footer />
    </div>
  );
};

export { PublicLayout };
