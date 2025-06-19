import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Github,
  Home as HomeIcon,
  Linkedin,
  Mail,
  Play,
  Twitter,
} from "lucide-react";
import React, { useState } from "react";
import { InteractiveAvatar } from "../InteractiveAvatar";
import { Dock, DockIcon } from "../magicui/dock";
import { Safari } from "../magicui/safari";

// Featured projects data
const featuredProjects = [
  {
    id: 1,
    title: "FoxyChat",
    description:
      "A cross-platform desktop AI chat application built with Electron and TypeScript. Features intelligent conversation capabilities, RobotJS automation, and a modern interface designed for seamless AI interactions.",
    url: "https://foxychat.net",
    preview: "/images/foxychat-preview.png",
    tech: "Electron • TypeScript • RobotJS • AI/ML",
    year: "2024",
  },
  {
    id: 2,
    title: "TaskForge",
    description:
      "A comprehensive full-stack task management platform built with modern web technologies. Features a monorepo architecture with separate client and server packages, database migrations, and production-ready deployment workflows.",
    url: "https://task-forge-website.vercel.app",
    preview: "/images/taskforge-preview.png",
    tech: "TypeScript • Monorepo • Full-Stack • Database",
    year: "2024",
  },
  {
    id: 3,
    title: "Personal Portfolio",
    description:
      "A minimalist portfolio website showcasing my work and experiences with modern web technologies.",
    url: "https://sma1lboy.me",
    preview: "/images/personal-preview.png",
    tech: "React • TanStack Router • Framer Motion",
    year: "2024",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const socialLinkVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.1,
    y: -2,
    transition: {
      duration: 0.2,
    },
  },
};

const avatarVariants = {
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

const slideVariants = {
  enterFromRight: { x: 300, opacity: 0 },
  enterFromLeft: { x: -300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: -300, opacity: 0 },
  exitToRight: { x: 300, opacity: 0 },
};

interface Props extends React.ComponentProps<"div"> {}

export function Home({ ...rest }: Props) {
  const [currentProject, setCurrentProject] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev, default to right
  const [activeSection, setActiveSection] = useState("hero"); // Track current section

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll detection to highlight current section
  React.useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      const projectsSection = document.getElementById("projects");

      if (!heroSection || !projectsSection) return;

      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const heroTop = heroSection.offsetTop;
      const projectsTop = projectsSection.offsetTop;

      if (scrollPosition >= heroTop && scrollPosition < projectsTop) {
        setActiveSection("hero");
      } else if (scrollPosition >= projectsTop) {
        setActiveSection("projects");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <div className="bg-white text-gray-900" {...rest}>
        {/* Hero Section */}
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
                  <motion.div className="flex gap-4" variants={itemVariants}>
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
          id="projects"
          className="bg-white px-8 py-16 lg:px-16 lg:py-24 xl:px-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <div className="mx-auto max-w-7xl">
            {/* Section Header */}
            <motion.div className="mb-16 text-center" variants={itemVariants}>
              <h2 className="mb-4 text-3xl font-light text-gray-900 lg:text-4xl">Selected Work</h2>
              <p className="mx-auto max-w-2xl text-lg font-light text-gray-600">
                A curated collection of projects that represent my approach to building thoughtful
                digital experiences.
              </p>
            </motion.div>

            {/* Project Carousel */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
                {/* Project Info */}
                <div className="space-y-6 lg:w-2/5">
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
                      <div className="mb-3 text-sm font-medium tracking-wider text-gray-400 uppercase">
                        {featuredProjects[currentProject].year} • Selected Work
                      </div>
                      <h3 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
                        {featuredProjects[currentProject].title}
                      </h3>
                      <p className="mb-6 text-lg leading-relaxed font-light text-gray-600">
                        {featuredProjects[currentProject].description}
                      </p>
                      <div className="mb-6 text-sm font-medium text-gray-500">
                        {featuredProjects[currentProject].tech}
                      </div>
                      <motion.a
                        href={featuredProjects[currentProject].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-gray-900 transition-colors duration-200 hover:text-gray-600"
                        whileHover={{ x: 4 }}
                      >
                        <span className="text-lg font-medium">Visit Project</span>
                        <ArrowUpRight
                          size={20}
                          className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </motion.a>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Project Preview with Safari Component */}
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
                        <div
                          className="cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                          onClick={() =>
                            window.open(featuredProjects[currentProject].url, "_blank")
                          }
                        >
                          <Safari
                            url={featuredProjects[currentProject].url.replace("https://", "")}
                            imageSrc={featuredProjects[currentProject].preview}
                            width={800}
                            height={500}
                            className="h-full w-full overflow-hidden rounded-lg bg-transparent shadow-2xl"
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="mt-16 flex items-center justify-center gap-4">
                <motion.button
                  onClick={prevProject}
                  className="rounded-full border border-gray-100 bg-white p-4 shadow-sm transition-colors duration-200 hover:bg-gray-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </motion.button>

                {/* Dots Indicator */}
                <div className="mx-8 flex gap-3">
                  {featuredProjects.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => jumpToProject(index)}
                      className={`h-3 w-3 rounded-full transition-colors duration-200 ${
                        index === currentProject ? "bg-gray-800" : "bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={nextProject}
                  className="rounded-full border border-gray-100 bg-white p-4 shadow-sm transition-colors duration-200 hover:bg-gray-50"
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

      {/* Fixed Dock */}
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
        <Dock>
          {/* Home/Navigation */}
          <DockIcon
            onClick={() => scrollToSection("hero")}
            className={`${
              activeSection === "hero"
                ? "bg-blue-100 shadow-lg ring-2 ring-blue-300 dark:bg-blue-900 dark:ring-blue-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <HomeIcon
              size={20}
              className={`transition-colors duration-200 ${
                activeSection === "hero"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            />
          </DockIcon>

          {/* Projects */}
          <DockIcon
            onClick={() => scrollToSection("projects")}
            className={`${
              activeSection === "projects"
                ? "bg-blue-100 shadow-lg ring-2 ring-blue-300 dark:bg-blue-900 dark:ring-blue-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <FolderOpen
              size={20}
              className={`transition-colors duration-200 ${
                activeSection === "projects"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            />
          </DockIcon>

          {/* Divider */}
          <div className="mx-2 h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

          {/* Social Media Section */}
          <DockIcon
            onClick={() => window.open("https://github.com/Sma1lboy", "_blank")}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Github size={20} className="text-gray-700 dark:text-gray-300" />
          </DockIcon>

          <DockIcon
            onClick={() => window.open("https://x.com/sma1lboy", "_blank")}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Twitter size={20} className="text-gray-700 dark:text-gray-300" />
          </DockIcon>

          <DockIcon
            onClick={() =>
              window.open("https://www.linkedin.com/in/chong-chen-857214292/", "_blank")
            }
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Linkedin size={20} className="text-gray-700 dark:text-gray-300" />
          </DockIcon>

          <DockIcon
            onClick={() => window.open("mailto:jackson@example.com")}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Mail size={20} className="text-gray-700 dark:text-gray-300" />
          </DockIcon>
        </Dock>
      </div>
    </>
  );
}
