import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/navbar/Navbar";
import { NAVBAR_ITEMS } from "../config/constants";
import Footer from "../components/general/Footer";

interface MainLayoutProps {
  children?: React.ReactNode;
  fullWidth?: boolean;
  absoluteNavbar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  fullWidth = false,
  absoluteNavbar = false,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar items={NAVBAR_ITEMS} absolute={absoluteNavbar} />
      <main className="flex-1">
        <div
          className={`container mx-auto ${
            fullWidth ? "" : "max-w-7xl px-4 md:px-6 lg:px-8 pb-12 mt-8"
          } `}
        >
          {children || <Outlet />}
        </div>
      </main>
      <Footer />
    </div>
  );
};
