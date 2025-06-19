import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Play, Twitter } from "lucide-react";
import { socialLinks, socialLinkVariants } from "../../constants/home";

const iconMap = {
  Twitter,
  Play,
  Github,
  Linkedin,
  Mail,
};

interface SocialLinksProps {
  className?: string;
}

export function SocialLinks({ className = "" }: SocialLinksProps) {
  return (
    <div className={`flex gap-3 sm:gap-4 ${className}`}>
      {socialLinks.map((link) => {
        const IconComponent = iconMap[link.icon as keyof typeof iconMap];

        return (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-manipulation rounded-full border border-gray-100 p-2.5 transition-all duration-200 ease-out hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none active:bg-gray-100 sm:p-3 dark:border-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-600 dark:active:bg-gray-700"
            aria-label={link.label}
            variants={socialLinkVariants}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <IconComponent
              size={18}
              className="text-gray-700 transition-all duration-200 ease-out sm:size-5 dark:text-gray-300"
            />
          </motion.a>
        );
      })}
    </div>
  );
}
