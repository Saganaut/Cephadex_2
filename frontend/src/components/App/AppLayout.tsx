import { NavBarApp } from "@components/App/Dashboard/NavBar/AppNavBar"; // Adjust with your actual import
import { SideBarApp } from "@components/App/Dashboard/SideBar/SideBar"; // Adjust with your actual import
import React, { useState } from "react";
import { ErrorBoundary } from "@utils/ErrorBoundary";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <ErrorBoundary>
        <div className="flex h-screen flex-col dark:bg-tolopea">
          {/* Navbar: keeping styling within the NavBarApp component */}

          <NavBarApp isSidebarOpen={isSidebarOpen} />
          {/* Main content area */}
          <div className="flex grow overflow-hidden">
            {/* Sidebar: You can control visibility with state and also keep internal styling within the SideBarApp component */}
            <div
              className={
                isSidebarOpen
                  ? "w-[220px] shrink-0 transition-all duration-300"
                  : "w-[110px] shrink-0 transition-all duration-300"
              }
            >
              <SideBarApp
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            </div>

            {/* Content area: this should grow or shrink based on the sidebar's state */}
            <div className="grow overflow-auto  p-4">{children}</div>
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
};

export { Layout };
