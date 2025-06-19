import { motion } from "framer-motion";
import { avatarVariants, containerVariants, itemVariants } from "../../constants/home";
import { InteractiveAvatar } from "../InteractiveAvatar";
import { SocialLinks } from "./SocialLinks";

export function HeroSection() {
  return (
    <motion.div
      id="hero"
      className="min-h-screen bg-white text-gray-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Main Layout - Two Columns */}
      <div className="mx-auto max-w-7xl">
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
              <motion.div className="mb-12 space-y-6 text-gray-600" variants={itemVariants}>
                <motion.p className="leading-relaxed" variants={itemVariants}>
                  I am a <strong>Full Stack Developer</strong> and also a student at the{" "}
                  <strong>University of Wisconsin-Madison</strong>, majoring in{" "}
                  <strong>Computer Science</strong>. I'm an explorer of new tech, an{" "}
                  <strong>avid learner</strong>, and a <strong>problem-solver</strong> at heart.
                </motion.p>
                <motion.p className="leading-relaxed" variants={itemVariants}>
                  Moreover, I'm a <strong>passionate programmer</strong> on earth. Feel free to
                  connect with me for all things tech or just to say hello!
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
            className="flex flex-col items-center justify-center bg-white p-8 lg:w-1/2 lg:p-16 xl:p-24"
            variants={avatarVariants}
            initial="hidden"
            animate="visible"
          >
            <InteractiveAvatar imageSrc="/home-avatar.png" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
