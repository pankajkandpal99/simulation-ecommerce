import React from "react";
import { NavbarItem } from "./NavbarItem";
import { NavbarItemType } from "../../types/navbarTypes";
import AuthButtons from "../auth/AuthButtons";
import { motion } from "framer-motion";
import { X, User, Menu, ShieldCheck, ShoppingCart } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerPortal,
  DrawerTrigger,
} from "../ui/drawer";
import { Link, useNavigate } from "react-router-dom";
import CartIcon from "../general/CartIcon";

interface MobileMenuProps {
  items: NavbarItemType[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ items }) => {
  const navigate = useNavigate();
  const { authenticated } = useSelector((state: RootState) => state.auth);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const displayName =
    currentUser?.username || currentUser?.phoneNumber || "Guest";
  const displayEmail = currentUser?.email;
  const isGuest = !authenticated;

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="lg:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <button
            className="text-primary p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} strokeWidth={2} />
          </button>
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerContent className="fixed inset-y-0 right-0 h-full w-72 max-h-screen bg-card border-l border-border shadow-2xl z-50">
            <div className="h-full flex flex-col max-h-screen">
              <div className="p-4 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    ShopFlow
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* <button
                    onClick={() => navigate("/cart")}
                    className="p-2 hover:bg-muted rounded-lg transition-colors relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-3 h-3 flex items-center justify-center text-[10px]">
                      0
                    </span>
                  </button> */}

                  <CartIcon />
                  <DrawerClose className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors">
                    <X size={20} />
                  </DrawerClose>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={itemVariants}
                  className={`mb-6 bg-muted p-4 rounded-lg border border-border shadow-sm ${
                    isGuest ? "opacity-75" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <div
                        className={`flex items-center justify-center w-10 h-10 ${
                          isGuest ? "bg-muted" : "bg-primary/10"
                        } rounded-full`}
                      >
                        <User
                          size={20}
                          className={
                            isGuest ? "text-muted-foreground" : "text-primary"
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold text-foreground">
                        {displayName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isGuest ? "Not logged in" : "Logged in"}
                      </span>
                    </div>
                  </div>

                  {/* Email section if available */}
                  {displayEmail && (
                    <div className="bg-background/60 p-2 rounded-md">
                      <span className="text-xs text-muted-foreground">
                        Email
                      </span>
                      <div className="text-sm font-medium text-foreground truncate">
                        {displayEmail}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Admin Dashboard Link */}
                {currentUser?.role === "ADMIN" && (
                  <Link to="/admin-dashboard" className="block mb-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all cursor-pointer">
                      <ShieldCheck
                        size={18}
                        strokeWidth={2}
                        className="text-primary"
                      />
                      <span className="text-sm font-medium text-primary">
                        Admin Dashboard
                      </span>
                    </div>
                  </Link>
                )}

                {/* Divider */}
                <div className="h-px w-full bg-border my-6"></div>

                {/* Navigation Links */}
                <nav className="space-y-2 pb-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial="closed"
                      animate="open"
                      variants={itemVariants}
                      custom={index}
                    >
                      <DrawerClose asChild>
                        <div className="py-2 px-3 text-sm rounded-lg hover:bg-muted transition-colors">
                          <NavbarItem item={item} isMobile />
                        </div>
                      </DrawerClose>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Footer with Auth Buttons */}
              <div className="border-t border-border bg-background p-4">
                <motion.div
                  initial="closed"
                  animate="open"
                  variants={itemVariants}
                >
                  <AuthButtons isMobile />
                </motion.div>
              </div>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </div>
  );
};

export default MobileMenu;
