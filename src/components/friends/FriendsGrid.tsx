import { motion } from "framer-motion";
import { ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import { useMemo } from "react";
import { friends, type Friend } from "../../constants/friends";
import { itemVariants } from "../../constants/home";

interface FriendsGridProps {
  searchTerm: string;
}

export function FriendsGrid({ searchTerm }: FriendsGridProps) {
  const filteredFriends = useMemo(() => {
    if (!searchTerm) return friends;

    const lowercaseSearch = searchTerm.toLowerCase();
    return friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(lowercaseSearch) ||
        friend.title.toLowerCase().includes(lowercaseSearch) ||
        friend.description.toLowerCase().includes(lowercaseSearch) ||
        friend.tags.some((tag) => tag.toLowerCase().includes(lowercaseSearch)),
    );
  }, [searchTerm]);

  const featuredFriends = filteredFriends.filter((friend) => friend.featured);
  const regularFriends = filteredFriends.filter((friend) => !friend.featured);

  return (
    <motion.div variants={itemVariants}>
      {/* Featured Friends Section */}
      {featuredFriends.length > 0 && (
        <motion.div className="mb-12" variants={itemVariants}>
          <h2 className="mb-6 text-xl font-medium text-gray-900 dark:text-gray-100">
            特别的朋友们 / Special Friends
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFriends.map((friend, index) => (
              <FriendCard key={friend.id} friend={friend} index={index} featured />
            ))}
          </div>
        </motion.div>
      )}

      {/* All Friends Section */}
      {regularFriends.length > 0 && (
        <motion.div variants={itemVariants}>
          <h2 className="mb-6 text-xl font-medium text-gray-900 dark:text-gray-100">
            {featuredFriends.length > 0 ? "更多朋友们 / More Friends" : "朋友们 / Friends"}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {regularFriends.map((friend, index) => (
              <FriendCard key={friend.id} friend={friend} index={index} />
            ))}
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {filteredFriends.length === 0 && (
        <motion.div className="py-12 text-center" variants={itemVariants}>
          <p className="text-gray-500 dark:text-gray-400">
            没有找到匹配 "{searchTerm}" 的朋友，试试其他关键词吧～
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

interface FriendCardProps {
  friend: Friend;
  index: number;
  featured?: boolean;
}

function FriendCard({ friend, index, featured = false }: FriendCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600 ${
        featured ? "ring-2 ring-gray-200 dark:ring-gray-700" : ""
      }`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
    >
      {/* Avatar */}
      <div className="mb-4 flex justify-center">
        <div className="relative">
          <img
            src={friend.avatar}
            alt={friend.name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100 transition-transform duration-300 group-hover:scale-105 dark:ring-gray-700"
          />
          {featured && (
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 ring-2 ring-white dark:ring-gray-800"></div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {friend.name}
        </h3>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{friend.title}</p>
        <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {friend.description}
        </p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap justify-center gap-1">
          {friend.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
          {friend.tags.length > 3 && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              +{friend.tags.length - 3}
            </span>
          )}
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-3">
          {friend.website && (
            <a
              href={friend.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors duration-200 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <ExternalLink size={16} />
            </a>
          )}
          {friend.github && (
            <a
              href={friend.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors duration-200 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Github size={16} />
            </a>
          )}
          {friend.twitter && (
            <a
              href={friend.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors duration-200 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Twitter size={16} />
            </a>
          )}
          {friend.linkedin && (
            <a
              href={friend.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors duration-200 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <Linkedin size={16} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
