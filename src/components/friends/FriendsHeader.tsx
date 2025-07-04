import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { itemVariants } from "../../constants/home";

interface FriendsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function FriendsHeader({ searchTerm, setSearchTerm }: FriendsHeaderProps) {
  return (
    <motion.div className="mb-12 text-center sm:mb-16" variants={itemVariants}>
      <motion.h1
        className="mb-4 text-3xl font-light text-gray-900 sm:text-4xl lg:text-5xl dark:text-gray-100"
        variants={itemVariants}
      >
        朋友们 / Friends
      </motion.h1>
      <motion.p
        className="mx-auto mb-8 max-w-2xl text-base font-light text-gray-600 sm:text-lg dark:text-gray-400"
        variants={itemVariants}
      >
        这里是我在学习和生活中遇到的有趣的人们。每个人都有自己独特的故事和想法，让我的世界变得更加丰富多彩。
      </motion.p>

      {/* Search Bar */}
      <motion.div className="mx-auto max-w-md" variants={itemVariants}>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索朋友们... / Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-gray-600 dark:focus:ring-gray-700"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
