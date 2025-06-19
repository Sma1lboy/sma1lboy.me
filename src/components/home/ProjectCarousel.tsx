import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import { featuredProjects, slideVariants } from "../../constants/home";
import { Safari } from "../magicui/safari";

interface ProjectCarouselProps {
  currentProject: number;
  setCurrentProject: (index: number) => void;
  direction: number;
  setDirection: (direction: number) => void;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}

export function ProjectCarousel({
  currentProject,
  setCurrentProject,
  direction,
  setDirection,
  isHovered,
  setIsHovered,
}: ProjectCarouselProps) {
  // Auto-play carousel functionality
  React.useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentProject((currentProject + 1) % featuredProjects.length);
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isHovered, currentProject, setCurrentProject, setDirection]);

  // Function to jump to a specific project (used by dots navigation)
  const jumpToProject = (index: number) => {
    const newDirection = index > currentProject ? 1 : -1;
    setDirection(newDirection);
    setCurrentProject(index);
  };

  return (
    <div className="relative">
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
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
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
                  onClick={() => window.open(featuredProjects[currentProject].url, "_blank")}
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

      {/* Dots Navigation */}
      <div className="mt-16 mb-10 flex items-center justify-center">
        <div className="flex gap-3">
          {featuredProjects.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => jumpToProject(index)}
              className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                index === currentProject ? "bg-gray-800" : "bg-gray-300"
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
