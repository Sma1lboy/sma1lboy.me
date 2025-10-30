import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../constants/home";
import { ProjectCarousel } from "./ProjectCarousel";

export function ProjectsSection() {
  return (
    <motion.section
      id="projects"
      className="bg-white px-4 py-12 sm:px-8 sm:py-12 lg:px-16 lg:py-16 xl:px-24 dark:bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div className="mb-12 text-center sm:mb-16" variants={itemVariants}>
          <h2 className="mb-3 text-2xl font-light text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl dark:text-gray-100">
            Selected Work
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light text-gray-600 sm:text-lg dark:text-gray-400">
            A curated collection of projects that represent my approach to building thoughtful
            digital experiences.
          </p>
        </motion.div>

        {/* Project Carousel */}
        <motion.div className="relative" variants={itemVariants}>
          <ProjectCarousel />
        </motion.div>
      </div>
    </motion.section>
  );
}
