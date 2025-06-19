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
            className="touch-manipulation rounded-full border border-gray-100 p-2.5 transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100 sm:p-3"
            aria-label={link.label}
            variants={socialLinkVariants}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <IconComponent size={18} className="text-gray-700 sm:size-5" />
          </motion.a>
        );
      })}
    </div>
  );
}
