import React from "react";
import { NavBar } from "../../components/Pages/NavBar/NavBar";
import { Footer } from "../../components/Pages/Footer/Footer";
import { SignInModal } from "../../components/Modals/SignInModal";
import { RegisterModal } from "../../components/Modals/RegisterModal";

const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <SignInModal />
      <RegisterModal />
      <NavBar />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
};

export { PublicLayout };
