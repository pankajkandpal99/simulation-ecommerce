import React, { useState, useEffect } from "react";
import { NavbarItem } from "./NavbarItem";
import { Link } from "react-router-dom";
import { NavbarItemType } from "../../types/navbarTypes";
import AuthButtons from "../auth/AuthButtons";
import MobileMenu from "./MobileMenu";
import { useAdminAuth } from "../../hooks/useAdminAuth";

interface iAppNavbarProps {
  items: NavbarItemType[];
  absolute?: boolean;
}

export const Navbar: React.FC<iAppNavbarProps> = ({ items, absolute }) => {
  const { isAdmin } = useAdminAuth();
  const [stickyNav, setStickyNav] = useState(false);

  const filteredItems = items.filter(
    (item) => item.href !== "/admin-dashboard" || isAdmin
  );

  useEffect(() => {
    if (!absolute) return;

    const handleScroll = () => {
      const scrollThreshold = 100;

      if (window.scrollY > scrollThreshold) {
        setStickyNav(true);
      } else {
        setStickyNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [absolute]);

  let navbarClass = "";

  if (absolute) {
    if (stickyNav) {
      navbarClass = "fixed top-0 left-0 right-0 shadow-lg";
    } else {
      navbarClass = "absolute top-0 left-0 right-0";
    }
  } else {
    navbarClass = "sticky top-0";
  }

  const slideDownStyle =
    stickyNav && absolute
      ? {
          animation: "slideInDown 0.3s forwards",
        }
      : {};

  return (
    <nav
      className={`${navbarClass} z-40 backdrop-blur-md py-4 border-b border-border/30 transition-all duration-300`}
      style={{
        backgroundColor: stickyNav
          ? "rgba(255, 255, 255, 0.95)"
          : absolute
          ? "transparent"
          : "rgb(255, 255, 255)",
        ...slideDownStyle,
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary hover:text-secondary transition-colors">
            ShopFlow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          {filteredItems.map((item) => (
            <NavbarItem key={item.id} item={item} />
          ))}
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex">
            <AuthButtons />
          </div>
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <MobileMenu items={filteredItems} />
          </div>
        </div>
      </div>
    </nav>
  );
};

// import React, { useState, useEffect } from "react";
// import { NavbarItem } from "./NavbarItem";
// import { Link } from "react-router-dom";
// import { NavbarItemType } from "../../types/navbarTypes";
// import AuthButtons from "../auth/AuthButtons";
// import MobileMenu from "./MobileMenu";
// // import { motion } from "framer-motion";
// import { useAdminAuth } from "../../hooks/useAdminAuth";

// interface iAppNavbarProps {
//   items: NavbarItemType[];
//   absolute?: boolean;
// }

// export const Navbar: React.FC<iAppNavbarProps> = ({ items, absolute }) => {
//   const { isAdmin } = useAdminAuth();
//   const [stickyNav, setStickyNav] = useState(false);

//   const filteredItems = items.filter(
//     (item) => item.href !== "/admin-dashboard" || isAdmin
//   );

//   useEffect(() => {
//     if (!absolute) return;

//     const handleScroll = () => {
//       const scrollThreshold = 100;

//       if (window.scrollY > scrollThreshold) {
//         setStickyNav(true);
//       } else {
//         setStickyNav(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [absolute]);

//   let navbarClass = "";

//   if (absolute) {
//     if (stickyNav) {
//       navbarClass = "fixed top-0 left-0 right-0 shadow-lg";
//     } else {
//       navbarClass = "absolute top-0 left-0 right-0";
//     }
//   } else {
//     navbarClass = "sticky top-0";
//   }

//   const slideDownStyle =
//     stickyNav && absolute
//       ? {
//           animation: "slideInDown 0.3s forwards",
//         }
//       : {};

//   return (
//     <nav
//       className={`${navbarClass} z-40 backdrop-blur-md py-4 border-b border-[#1e293b]/30 transition-all duration-300`}
//       style={{
//         backgroundColor: stickyNav ? "rgba(10, 16, 31, 0.9)" : "transparent",
//         ...slideDownStyle,
//       }}
//     >
//       <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center">
//         <Link to="/" className="flex items-center gap-2">
//           {/* <motion.div whileHover={{ scale: 1.05 }} className="relative">
//             <div className="absolute -inset-1 bg-gradient-to-r from-[#6FFFB4] to-[#3694FF] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200" />
//             <div className="relative">
//               <div className="absolute -inset-1 bg-gradient-to-r from-[#6FFFB4] to-[#3694FF] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
//               <div className="relative bg-[#0a101f] rounded-full p-1">
//                Logo
//               </div>
//             </div>
//           </motion.div> */}
//           <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6FFFB4] to-[#3694FF]">
//             ShopFlow
//           </span>
//         </Link>
//         {/* Desktop Navigation */}
//         <div className="hidden lg:flex items-center gap-4">
//           {filteredItems.map((item) => (
//             <NavbarItem key={item.id} item={item} />
//           ))}
//         </div>
//         <div className="flex items-center gap-3 lg:gap-6">
//           {/* Desktop Auth Buttons */}
//           <div className="hidden lg:flex">
//             <AuthButtons />
//           </div>
//           {/* Mobile Menu */}
//           <div className="lg:hidden">
//             <MobileMenu items={filteredItems} />
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };
