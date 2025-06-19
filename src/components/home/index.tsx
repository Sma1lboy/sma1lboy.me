import React, { useState } from "react";
import { Linkedin, Github, Mail, Play, Twitter, ExternalLink, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveAvatar } from "../InteractiveAvatar";

// Featured projects data
const featuredProjects = [
  {
    id: 1,
    title: "FoxyChat",
    description: "An intelligent AI chat platform with advanced conversation capabilities and seamless user experience.",
    url: "https://foxychat.net",
    preview: "/images/foxychat-preview.png",
    tech: "Next.js • TypeScript • AI/ML",
    year: "2024"
  },
  {
    id: 2,
    title: "TaskForge",
    description: "A powerful task management and productivity platform designed for modern teams and individuals.",
    url: "https://gettaskforge.com", 
    preview: "/images/taskforge-preview.png",
    tech: "React • Node.js • PostgreSQL",
    year: "2024"
  },
  {
    id: 3,
    title: "Personal Portfolio",
    description: "A minimalist portfolio website showcasing my work and experiences with modern web technologies.",
    url: "https://sma1lboy.me",
    preview: "/images/personal-preview.png", 
    tech: "React • TanStack Router • Framer Motion",
    year: "2024"
  }

];

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

const slideVariants = {
  enterFromRight: { x: 300, opacity: 0 },
  enterFromLeft: { x: -300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: -300, opacity: 0 },
  exitToRight: { x: 300, opacity: 0 }
};

interface Props extends React.ComponentProps<"div"> {}

export function Home({ ...rest }: Props) {
  const [currentProject, setCurrentProject] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev, default to right

  const nextProject = () => {
    setDirection(1);
    setTimeout(() => {
      setCurrentProject((prev) => (prev + 1) % featuredProjects.length);
    }, 0);
  };

  const prevProject = () => {
    setDirection(-1);
    setTimeout(() => {
      setCurrentProject((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
    }, 0);
  };

  const jumpToProject = (index: number) => {
    const newDirection = index > currentProject ? 1 : -1;
    setDirection(newDirection);
    setTimeout(() => {
      setCurrentProject(index);
    }, 0);
  };

  return (
    <div className="bg-white text-gray-900" {...rest}>
      {/* Hero Section */}
      <motion.div 
        className="min-h-screen bg-white text-gray-900" 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Main Layout - Two Columns */}
        <div className="max-w-7xl mx-auto">
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
                    className="rounded-full border border-gray-100 p-3 transition-colors duration-200 hover:bg-gray-50"
                    aria-label="Twitter"
                    variants={socialLinkVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Twitter size={20} className="text-gray-700" />
                  </motion.a>
                  <motion.a
                    href="https://space.bilibili.com/72605744"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-gray-100 p-3 transition-colors duration-200 hover:bg-gray-50"
                    aria-label="Bilibili"
                    variants={socialLinkVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={20} className="text-gray-700" />
                  </motion.a>
                  <motion.a
                    href="https://github.com/Sma1lboy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-gray-100 p-3 transition-colors duration-200 hover:bg-gray-50"
                    aria-label="GitHub"
                    variants={socialLinkVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={20} className="text-gray-700" />
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/chong-chen-857214292/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-gray-100 p-3 transition-colors duration-200 hover:bg-gray-50"
                    aria-label="LinkedIn"
                    variants={socialLinkVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin size={20} className="text-gray-700" />
                  </motion.a>
                  <motion.a
                    href="mailto:jackson@example.com"
                    className="rounded-full border border-gray-100 p-3 transition-colors duration-200 hover:bg-gray-50"
                    aria-label="Email"
                    variants={socialLinkVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail size={20} className="text-gray-700" />
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
        </div>
      </motion.div>

      {/* Featured Projects Section */}
      <motion.section 
        className="py-16 px-8 lg:py-24 lg:px-16 xl:px-24 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              Selected Work
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              A curated collection of projects that represent my approach to building 
              thoughtful digital experiences.
            </p>
          </motion.div>

          {/* Project Carousel */}
          <motion.div className="relative" variants={itemVariants}>
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              {/* Project Info */}
              <div className="lg:w-2/5 space-y-6">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentProject}
                    variants={slideVariants}
                    initial={direction > 0 ? "enterFromRight" : "enterFromLeft"}
                    animate="center"
                    exit={direction > 0 ? "exitToLeft" : "exitToRight"}
                    transition={{ duration: 0.3 }}
                    custom={direction}
                  >
                    <div className="text-sm font-medium text-gray-400 mb-3 tracking-wider uppercase">
                      {featuredProjects[currentProject].year} • Selected Work
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      {featuredProjects[currentProject].title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed font-light">
                      {featuredProjects[currentProject].description}
                    </p>
                    <div className="text-sm text-gray-500 mb-6 font-medium">
                      {featuredProjects[currentProject].tech}
                    </div>
                    <motion.a
                      href={featuredProjects[currentProject].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors duration-200 group"
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-lg font-medium">Visit Project</span>
                      <ArrowUpRight 
                        size={20} 
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" 
                      />
                    </motion.a>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Project Preview - Enlarged */}
              <div className="lg:w-3/5">
                <div className="relative">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentProject}
                      variants={slideVariants}
                      initial={direction > 0 ? "enterFromRight" : "enterFromLeft"}
                      animate="center"
                      exit={direction > 0 ? "exitToLeft" : "exitToRight"}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                      custom={direction}
                    >
                      <motion.a
                        href={featuredProjects[currentProject].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 block cursor-pointer group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Browser Header */}
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="flex-1 text-center">
                            <div className="text-sm text-gray-600 bg-white rounded px-4 py-2 max-w-md mx-auto border border-gray-100">
                              {featuredProjects[currentProject].url.replace('https://', '')}
                            </div>
                          </div>
                        </div>
                        
                        {/* Preview Content - Larger */}
                        <div className="aspect-[16/10] bg-gray-50 overflow-hidden relative">
                          <img
                            src={featuredProjects[currentProject].preview}
                            alt={`${featuredProjects[currentProject].title} preview`}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-gray-900 font-medium flex items-center gap-2">
                              <span>Visit Site</span>
                              <ExternalLink size={16} />
                            </div>
                          </div>
                        </div>
                      </motion.a>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4 mt-16">
              <motion.button
                onClick={prevProject}
                className="p-4 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </motion.button>

              {/* Dots Indicator */}
              <div className="flex gap-3 mx-8">
                {featuredProjects.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => jumpToProject(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentProject ? 'bg-gray-800' : 'bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextProject}
                className="p-4 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={20} className="text-gray-600" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
} 