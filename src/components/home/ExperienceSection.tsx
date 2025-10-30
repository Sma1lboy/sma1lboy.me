import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Calendar,
  Code2,
  ExternalLink,
  GraduationCap,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { containerVariants, itemVariants } from "../../constants/home";
import { Experience, ExperienceType } from "../../types";

interface ExperienceSectionProps {
  experiences: Experience[];
}

// Minimal color scheme matching the site's design
const experienceTypeConfig = {
  work: {
    label: "Work",
    icon: Briefcase,
  },
  internship: {
    label: "Work",
    icon: Briefcase,
  },
  education: {
    label: "Education",
    icon: GraduationCap,
  },
  project: {
    label: "Projects",
    icon: Code2,
  },
  award: {
    label: "Awards & Certifications",
    icon: Trophy,
  },
  certification: {
    label: "Awards & Certifications",
    icon: Trophy,
  },
};

const ExperienceCard = ({ experience }: { experience: Experience }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = experienceTypeConfig[experience.type];
  const Icon = config.icon;

  const formatPeriod = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    return `${formatDate(startDate)} - ${endDate ? formatDate(endDate) : "Present"}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group py-8 first:pt-0"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <Icon className="h-4 w-4 text-gray-400 dark:text-gray-600" />
              <span className="text-xs font-light tracking-wider text-gray-400 uppercase dark:text-gray-600">
                {config.label}
              </span>
              {experience.featured && (
                <span className="text-xs font-light text-gray-900 dark:text-gray-100">
                  • Featured
                </span>
              )}
            </div>
            <h3 className="mb-2 text-xl font-light text-gray-900 dark:text-gray-100">
              {experience.title}
            </h3>
            {(experience.company || experience.organization) && (
              <p className="mb-3 text-base font-light text-gray-600 dark:text-gray-400">
                {experience.company || experience.organization}
              </p>
            )}
          </div>

          {experience.url && (
            <motion.a
              href={experience.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-gray-900 dark:hover:text-gray-100"
              whileHover={{ x: 2, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="h-4 w-4" />
            </motion.a>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm font-light text-gray-500 dark:text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{formatPeriod(experience.period.start, experience.period.end)}</span>
          </div>
          {experience.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              <span>{experience.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed font-light text-gray-600 dark:text-gray-400">
          {isExpanded
            ? experience.description
            : `${experience.description.slice(0, 180)}${experience.description.length > 180 ? "..." : ""}`}
        </p>

        {/* Technologies */}
        {experience.technologies && experience.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {experience.technologies.slice(0, isExpanded ? undefined : 8).map((tech, index) => (
              <span
                key={`${experience.id}-tech-${index}`}
                className="text-xs font-light text-gray-500 dark:text-gray-500"
              >
                {tech}
                {index <
                  (isExpanded
                    ? experience.technologies!.length
                    : Math.min(8, experience.technologies!.length)) -
                    1 && " •"}
              </span>
            ))}
            {!isExpanded && experience.technologies.length > 8 && (
              <span className="text-xs font-light text-gray-400 dark:text-gray-600">
                +{experience.technologies.length - 8} more
              </span>
            )}
          </div>
        )}

        {/* Expandable achievements */}
        <AnimatePresence>
          {isExpanded && experience.achievements && experience.achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-l border-gray-200 pl-4 dark:border-gray-800"
            >
              <ul className="space-y-2">
                {experience.achievements.map((achievement, index) => (
                  <motion.li
                    key={`${experience.id}-achievement-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-sm leading-relaxed font-light text-gray-600 dark:text-gray-400"
                  >
                    • {achievement}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand button */}
        {(experience.description.length > 180 ||
          (experience.achievements && experience.achievements.length > 0)) && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-light text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-400"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? "Show less →" : "Show more →"}
          </motion.button>
        )}

        {/* Divider */}
        <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />
      </div>
    </motion.div>
  );
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [selectedType, setSelectedType] = useState<ExperienceType | "all">("all");

  const filteredExperiences =
    selectedType === "all"
      ? experiences
      : selectedType === "work"
        ? experiences.filter((exp) => exp.type === "work" || exp.type === "internship")
        : selectedType === "award"
          ? experiences.filter((exp) => exp.type === "award" || exp.type === "certification")
          : experiences.filter((exp) => exp.type === selectedType);

  // Only show unique categories
  const categories: Array<"all" | "work" | "education" | "project" | "award"> = [
    "all",
    "work",
    "education",
    "project",
    "award",
  ];

  return (
    <motion.section
      className="bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-24 xl:px-24 dark:bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div className="mb-12 text-center sm:mb-16" variants={itemVariants}>
          <h2 className="mb-3 text-2xl font-light text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl dark:text-gray-100">
            Experiences
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light text-gray-600 sm:text-lg dark:text-gray-400">
            From learning to work, from projects to achievements, documenting my growth journey and
            experience accumulation.
          </p>
        </motion.div>

        {/* Simple Filter Pills */}
        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-3 sm:mb-16"
          variants={itemVariants}
        >
          {categories.map((category) => {
            const isSelected = selectedType === category;

            let config;
            if (category === "all") {
              config = { label: "All", icon: Users };
            } else {
              config = experienceTypeConfig[category];
            }

            const Icon = config.icon;

            return (
              <motion.button
                key={category}
                onClick={() => setSelectedType(category as ExperienceType | "all")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-light transition-all duration-200 ${
                  isSelected
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {config.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Experience List */}
        <motion.div className="space-y-0" variants={itemVariants}>
          {filteredExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredExperiences.length === 0 && (
          <motion.div
            className="py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Users className="mx-auto mb-4 h-8 w-8 text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-light text-gray-600 dark:text-gray-400">
              No experiences found in this category
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
