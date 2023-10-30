import React, { useState} from "react";
import { NavBarApp } from "components/App/Dashboard/NavBar/AppNavBar"; // Adjust with your actual import
import { SideBarApp } from "components/App/Dashboard/SideBar/SideBar"; // Adjust with your actual import

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>

 
    <div className="flex flex-col h-screen bg-light-color dark:bg-dark-color">
      {/* Navbar: keeping styling within the NavBarApp component */}
        <NavBarApp />

      {/* Main content area */}
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar: You can control visibility with state and also keep internal styling within the SideBarApp component */}
        <div className={isSidebarOpen ? "w-40 flex-shrink-0 transition-all duration-300" : "w-20 flex-shrink-0 transition-all duration-300"}>
        <SideBarApp isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Content area: this should grow or shrink based on the sidebar's state */}
        <div className="flex-grow p-4  overflow-auto">
        
          {children}
        </div>
      </div>
    </div>   </>
  );
};

export { Layout };