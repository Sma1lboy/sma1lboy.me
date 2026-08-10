// Animation variants
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export const socialLinkVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.1,
    y: -2,
    transition: {
      duration: 0.2,
    },
  },
};

export const avatarVariants = {
  hidden: { opacity: 0, scale: 0.8, x: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.3,
    },
  },
};

export const slideVariants = {
  enterFromRight: { x: 300, opacity: 0 },
  enterFromLeft: { x: -300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: -300, opacity: 0 },
  exitToRight: { x: 300, opacity: 0 },
};

// Social links data
export const socialLinks = [
  {
    href: "https://x.com/sma1lboy",
    label: "Twitter",
    icon: "Twitter",
  },
  {
    href: "https://space.bilibili.com/72605744",
    label: "Bilibili",
    icon: "Play",
  },
  {
    href: "https://github.com/Sma1lboy",
    label: "GitHub",
    icon: "Github",
  },
  {
    href: "https://www.linkedin.com/in/chong-chen-857214292/",
    label: "LinkedIn",
    icon: "Linkedin",
  },
  {
    href: "mailto:541898146chen@gmail.com",
    label: "Email",
    icon: "Mail",
  },
];
