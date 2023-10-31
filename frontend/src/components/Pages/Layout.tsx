import { RegisterModal } from "@components/Modals/RegisterModal";
import { SignInModal } from "@components/Modals/SignInModal";
import { Footer } from "@pages/Footer/Footer";
import { NavBar } from "@pages/NavBar/NavBar";
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
