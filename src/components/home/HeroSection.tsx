import { motion } from "framer-motion";
import { avatarVariants, containerVariants, itemVariants } from "../../constants/home";
import { InteractiveAvatar } from "../InteractiveAvatar";
import { SocialLinks } from "./SocialLinks";

export function HeroSection() {
  return (
    <motion.div
      id="hero"
      className="min-h-screen bg-white text-gray-900 transition-all duration-200 ease-out dark:bg-gray-900 dark:text-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Main Layout - Two Columns */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen flex-col lg:flex-row lg:gap-16 xl:gap-20">
          {/* Left Column - Personal Introduction */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:w-1/2 lg:p-12 xl:p-16">
            {/* Header */}
            <motion.div className="max-w-md" variants={itemVariants}>
              <motion.h1
                className="mb-4 text-3xl font-bold text-gray-900 transition-all duration-200 ease-out sm:text-4xl lg:text-6xl dark:text-gray-100"
                variants={itemVariants}
              >
                Jackson Chen
              </motion.h1>
              <motion.p
                className="mb-6 text-base font-light text-gray-700 transition-all duration-200 ease-out sm:text-lg lg:mb-8 lg:text-xl dark:text-gray-300"
                variants={itemVariants}
              >
                Full Stack Developer & Computer Science Student
              </motion.p>

              {/* Quote */}
              <motion.blockquote
                className="mb-8 text-xl leading-relaxed font-light text-gray-700 italic transition-all duration-200 ease-out sm:text-2xl lg:mb-12 lg:text-3xl dark:text-gray-300"
                variants={itemVariants}
              >
                "I came, I saw, I made it."
              </motion.blockquote>

              {/* About */}
              <motion.div
                className="mb-8 space-y-4 text-gray-600 sm:space-y-6 lg:mb-12 dark:text-gray-400"
                variants={itemVariants}
              >
                <motion.p
                  className="text-sm leading-relaxed transition-all duration-200 ease-out sm:text-base"
                  variants={itemVariants}
                >
                  I am a{" "}
                  <strong className="text-gray-900 dark:text-gray-100">Full Stack Developer</strong>{" "}
                  and also a student at the{" "}
                  <strong className="text-gray-900 dark:text-gray-100">
                    University of Wisconsin-Madison
                  </strong>
                  , majoring in{" "}
                  <strong className="text-gray-900 dark:text-gray-100">Computer Science</strong>.
                  I'm an explorer of new tech, an{" "}
                  <strong className="text-gray-900 dark:text-gray-100">avid learner</strong>, and a{" "}
                  <strong className="text-gray-900 dark:text-gray-100">problem-solver</strong> at
                  heart.
                </motion.p>
                <motion.p
                  className="text-sm leading-relaxed transition-all duration-200 ease-out sm:text-base"
                  variants={itemVariants}
                >
                  Moreover, I'm a{" "}
                  <strong className="text-gray-900 dark:text-gray-100">
                    passionate programmer
                  </strong>{" "}
                  on earth. Feel free to connect with me for all things tech or just to say hello!
                </motion.p>
              </motion.div>

              {/* Social Links */}
              <motion.div variants={itemVariants}>
                <SocialLinks />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Interactive Avatar */}
          <motion.div
            className="relative flex flex-col items-center justify-center bg-white p-6 transition-all duration-200 ease-out sm:p-8 lg:w-1/2 lg:p-12 xl:p-16 dark:bg-gray-900"
            variants={avatarVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Subtle divider line for larger screens */}
            <div className="absolute top-1/2 left-0 hidden h-32 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-gray-200 to-transparent transition-all duration-200 ease-out lg:block dark:via-gray-700"></div>
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-none">
              <InteractiveAvatar imageSrc="/home-avatar.png" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
