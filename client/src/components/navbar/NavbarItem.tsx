import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavbarItemType } from "../../types/navbarTypes";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface NavbarItemProps {
  item: NavbarItemType;
  isMobile?: boolean;
  onClick?: () => void;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({
  item,
  isMobile = false,
  onClick,
}) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("relative", isMobile ? "w-full" : "inline-block")}
    >
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          "block px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
          "hover:bg-muted",
          isActive
            ? "text-primary bg-primary/5 border border-primary/20"
            : "text-foreground hover:text-primary",
          isMobile ? "text-base py-3 w-full" : ""
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="relative">
          {item.label}
          {isActive && !isMobile && (
            <motion.div
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"
              layoutId="underline"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          )}
        </span>
      </Link>
    </motion.div>
  );
};

// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { NavbarItemType } from "../../types/navbarTypes";
// import { cn } from "../../lib/utils";
// import { motion } from "framer-motion";

// interface NavbarItemProps {
//   item: NavbarItemType;
//   isMobile?: boolean;
//   onClick?: () => void;
// }

// export const NavbarItem: React.FC<NavbarItemProps> = ({
//   item,
//   isMobile = false,
//   onClick,
// }) => {
//   const location = useLocation();
//   const isActive = location.pathname === item.href;

//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       className={cn("relative", isMobile ? "w-full" : "inline-block")}
//     >
//       <Link
//         to={item.href}
//         onClick={onClick}
//         className={cn(
//           "block px-3 py-2 text-sm transition-colors",
//           "hover:bg-[#121a2a]/50 rounded-lg",
//           isActive
//             ? "text-[#6FFFB4] font-semibold"
//             : "text-[#94a3b8] hover:text-white",
//           isMobile ? "text-lg py-3" : ""
//         )}
//         aria-current={isActive ? "page" : undefined}
//       >
//         {item.label}
//         {isActive && (
//           <motion.div
//             className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6FFFB4]"
//             layoutId="underline"
//           />
//         )}
//       </Link>
//     </motion.div>
//   );
// };
