import { createFileRoute } from '@tanstack/react-router'

import React from "react";
import { Linkedin, Github, Mail, Play, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { InteractiveAvatar } from "../components";

export const Route = createFileRoute('/')({
  component: Home,
}) 

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const socialLinkVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.1, 
    y: -2,
    transition: {
      duration: 0.2
    }
  }
};

const avatarVariants = {
  hidden: { opacity: 0, scale: 0.8, x: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.3
    }
  }
};

interface Props extends React.ComponentProps<"div"> {}

export function Home({ ...rest }: Props) {

  return (
    <motion.div 
      className="min-h-screen bg-white text-gray-900" 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      {...rest}
    >
      {/* Main Layout - Two Columns */}
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Column - Personal Introduction */}
        <div className="flex flex-col justify-center p-8 lg:w-1/2 lg:p-16 xl:p-24">
          {/* Header */}
          <motion.div className="max-w-md" variants={itemVariants}>
            <motion.h1 
              className="mb-4 text-4xl font-bold text-gray-900 lg:text-6xl"
              variants={itemVariants}
            >
              Jackson Chen
            </motion.h1>
            <motion.p 
              className="mb-8 text-lg font-light text-gray-600 lg:text-xl"
              variants={itemVariants}
            >
              Full Stack Developer & Computer Science Student
            </motion.p>

            {/* Quote */}
            <motion.blockquote 
              className="mb-12 text-2xl leading-relaxed font-light text-gray-700 italic lg:text-3xl"
              variants={itemVariants}
            >
              "I came, I saw, I made it."
            </motion.blockquote>

            {/* About */}
            <motion.div 
              className="mb-12 space-y-6 text-gray-600"
              variants={itemVariants}
            >
              <motion.p 
                className="leading-relaxed"
                variants={itemVariants}
              >
                I am a <strong>Full Stack Developer</strong> and also a student at the{" "}
                <strong>University of Wisconsin-Madison</strong>, majoring in{" "}
                <strong>Computer Science</strong>. I'm an explorer of new tech, an{" "}
                <strong>avid learner</strong>, and a <strong>problem-solver</strong> at heart.
              </motion.p>
              <motion.p 
                className="leading-relaxed"
                variants={itemVariants}
              >
                Moreover, I'm a <strong>passionate programmer</strong> on earth. Feel free to connect with me
                for all things tech or just to say hello!
              </motion.p>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex gap-4"
              variants={itemVariants}
            >
              <motion.a
                href="https://x.com/sma1lboy"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
                aria-label="Twitter"
                variants={socialLinkVariants}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Twitter size={20} className="text-gray-600" />
              </motion.a>
              <motion.a
                href="https://space.bilibili.com/72605744"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
                aria-label="Bilibili"
                variants={socialLinkVariants}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Play size={20} className="text-gray-600" />
              </motion.a>
              <motion.a
                href="https://github.com/Sma1lboy"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
                aria-label="GitHub"
                variants={socialLinkVariants}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Github size={20} className="text-gray-600" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/chong-chen-857214292/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
                aria-label="LinkedIn"
                variants={socialLinkVariants}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={20} className="text-gray-600" />
              </motion.a>
              <motion.a
                href="mailto:jackson@example.com"
                className="rounded-full border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
                aria-label="Email"
                variants={socialLinkVariants}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={20} className="text-gray-600" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

                {/* Right Column - Interactive Avatar */}
        <motion.div 
          className="flex flex-col items-center justify-center bg-white p-8 lg:w-1/2 lg:p-16 xl:p-24"
          variants={avatarVariants}
          initial="hidden"
          animate="visible"
        >
          <InteractiveAvatar imageSrc="/home-avatar.png" />
        </motion.div>
      </div>
    </motion.div>
  );
};
