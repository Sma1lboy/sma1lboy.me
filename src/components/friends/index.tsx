import { motion } from "framer-motion";
import React, { useState } from "react";
import { containerVariants } from "../../constants/home";
import { FriendsGrid } from "./FriendsGrid";
import { FriendsHeader } from "./FriendsHeader";

interface Props extends React.ComponentProps<"div"> {}

export function Friends({ className, ...rest }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div
      className={`min-h-screen bg-white text-gray-900 transition-all duration-200 ease-out dark:bg-gray-900 dark:text-gray-100 ${className || ""}`}
      {...rest}
    >
      <motion.div
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <FriendsHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FriendsGrid searchTerm={searchTerm} />
      </motion.div>
    </div>
  );
}
