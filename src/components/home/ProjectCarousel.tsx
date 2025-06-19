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
      <div className="flex flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:gap-16">
        {/* Project Info */}
        <div className="space-y-4 sm:space-y-6 lg:w-2/5">
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
              <div className="mb-2 text-xs font-medium tracking-wider text-gray-400 uppercase sm:mb-3 sm:text-sm">
                {featuredProjects[currentProject].year} • Selected Work
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:mb-4 lg:text-4xl">
                {featuredProjects[currentProject].title}
              </h3>
              <p className="mb-4 text-base leading-relaxed font-light text-gray-600 sm:mb-6 sm:text-lg">
                {featuredProjects[currentProject].description}
              </p>
              <div className="mb-4 text-xs font-medium text-gray-500 sm:mb-6 sm:text-sm">
                {featuredProjects[currentProject].tech}
              </div>
              <motion.a
                href={featuredProjects[currentProject].url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex touch-manipulation items-center gap-2 text-gray-900 transition-colors duration-200 hover:text-gray-600"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-base font-medium sm:text-lg">Visit Project</span>
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 sm:size-5"
                />
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Project Preview with Safari Component */}
        <div className="w-full lg:w-3/5">
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
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
                  className="cursor-pointer touch-manipulation transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => window.open(featuredProjects[currentProject].url, "_blank")}
                >
                  <Safari
                    url={featuredProjects[currentProject].url.replace("https://", "")}
                    imageSrc={featuredProjects[currentProject].preview}
                    width={800}
                    height={500}
                    className="h-full w-full overflow-hidden rounded-lg bg-transparent shadow-xl sm:shadow-2xl"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="mt-12 mb-8 flex items-center justify-center sm:mt-16 sm:mb-10">
        <div className="flex gap-2 sm:gap-3">
          {featuredProjects.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => jumpToProject(index)}
              className={`h-3 w-3 touch-manipulation rounded-full transition-colors duration-300 sm:h-3 sm:w-3 ${
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
