import { motion } from "framer-motion";
import { Calendar, ExternalLink, MapPin, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { containerVariants, itemVariants } from "../../constants/home";
import { Experience, ExperienceType } from "../../types";

interface ExperienceWaterfallProps {
  experiences: Experience[];
}

const experienceTypeConfig = {
  work: { label: "Work Experience", icon: Users, color: "bg-muted text-muted-foreground" },
  education: { label: "Education", icon: Trophy, color: "bg-muted text-muted-foreground" },
  project: { label: "Projects", icon: ExternalLink, color: "bg-muted text-muted-foreground" },
  volunteer: {
    label: "Volunteer Experience",
    icon: Users,
    color: "bg-muted text-muted-foreground",
  },
  award: { label: "Awards", icon: Trophy, color: "bg-muted text-muted-foreground" },
  certification: { label: "Certifications", icon: Trophy, color: "bg-muted text-muted-foreground" },
  internship: { label: "Internships", icon: Users, color: "bg-muted text-muted-foreground" },
};

const ExperienceCard = ({ experience, index }: { experience: Experience; index: number }) => {
  const config = experienceTypeConfig[experience.type];
  const Icon = config.icon;

  const formatPeriod = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    return `${formatDate(startDate)} - ${endDate ? formatDate(endDate) : "Present"}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
      className="group bg-card border-border shadow-custom-md hover:shadow-custom-lg relative overflow-hidden rounded-xl border transition-all duration-300"
    >
      {/* Background gradient overlay */}
      <div className="from-background/50 to-muted/30 absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`rounded-lg p-2 ${config.color} transition-transform duration-200 group-hover:scale-110`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                {config.label}
              </span>
              {experience.featured && (
                <div className="mt-1 flex items-center">
                  <div className="bg-chart-1 mr-2 h-2 w-2 animate-pulse rounded-full" />
                  <span className="text-chart-1 text-xs font-medium">Featured</span>
                </div>
              )}
            </div>
          </div>
          {experience.url && (
            <motion.a
              href={experience.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-muted hover:bg-accent rounded-lg p-2 transition-colors duration-200"
            >
              <ExternalLink className="text-muted-foreground h-4 w-4" />
            </motion.a>
          )}
        </div>

        {/* Title and Organization */}
        <div className="mb-3">
          <h3 className="text-foreground group-hover:text-primary mb-1 text-lg font-semibold transition-colors duration-200">
            {experience.title}
          </h3>
          {(experience.company || experience.organization) && (
            <p className="text-muted-foreground text-sm font-medium">
              {experience.company || experience.organization}
            </p>
          )}
        </div>

        {/* Period and Location */}
        <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatPeriod(experience.period.start, experience.period.end)}</span>
          </div>
          {experience.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{experience.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {experience.description}
        </p>

        {/* Technologies */}
        {experience.technologies && experience.technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {experience.technologies.slice(0, 6).map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="bg-secondary text-secondary-foreground inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
              {experience.technologies.length > 6 && (
                <span className="text-muted-foreground inline-flex items-center rounded-md px-2 py-1 text-xs font-medium">
                  +{experience.technologies.length - 6}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Achievements */}
        {experience.achievements && experience.achievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-foreground text-sm font-medium">主要成就</h4>
            <ul className="space-y-1">
              {experience.achievements.slice(0, 3).map((achievement, achievementIndex) => (
                <li
                  key={achievementIndex}
                  className="text-muted-foreground flex items-start text-sm"
                >
                  <div className="bg-muted-foreground mt-2 mr-2 h-1 w-1 flex-shrink-0 rounded-full" />
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export function ExperienceWaterfall({ experiences }: ExperienceWaterfallProps) {
  const [selectedType, setSelectedType] = useState<ExperienceType | "all">("all");

  const filteredExperiences =
    selectedType === "all" ? experiences : experiences.filter((exp) => exp.type === selectedType);

  const categories = ["all", ...Object.keys(experienceTypeConfig)] as const;

  return (
    <motion.section
      className="bg-background px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-24 xl:px-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div className="mb-12 text-center sm:mb-16" variants={itemVariants}>
          <h2 className="text-foreground mb-3 text-2xl font-light sm:mb-4 sm:text-3xl lg:text-4xl">
            Experiences
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base font-light sm:text-lg">
            From learning to work, from projects to achievements, documenting my growth journey and
            experience accumulation.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-2 sm:mb-16"
          variants={itemVariants}
        >
          {categories.map((category) => {
            const isSelected = selectedType === category;
            const config =
              category === "all"
                ? { label: "All", color: "bg-primary text-primary-foreground" }
                : experienceTypeConfig[category as ExperienceType];

            return (
              <motion.button
                key={category}
                onClick={() => setSelectedType(category as ExperienceType | "all")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? config.color
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {config.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Waterfall Layout */}
        <motion.div
          className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3"
          variants={itemVariants}
        >
          {filteredExperiences.map((experience, index) => (
            <div key={experience.id} className="break-inside-avoid">
              <ExperienceCard experience={experience} index={index} />
            </div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredExperiences.length === 0 && (
          <motion.div
            className="py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-muted-foreground">
              <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p className="mb-2 text-lg font-medium">暂无相关经历</p>
              <p className="text-sm">请选择其他类别查看更多内容</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
