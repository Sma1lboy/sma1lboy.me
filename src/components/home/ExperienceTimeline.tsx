import { motion } from "framer-motion";
import { Calendar, ExternalLink, MapPin, Trophy, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { containerVariants, itemVariants } from "../../constants/home";
import { Experience, ExperienceType } from "../../types";

interface ExperienceTimelineProps {
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

const TimelineItem = ({ experience, index }: { experience: Experience; index: number }) => {
  const config = experienceTypeConfig[experience.type];
  const Icon = config.icon;
  const [isInView, setIsInView] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 },
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatPeriod = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    };

    return `${formatDate(startDate)} - ${endDate ? formatDate(endDate) : "Present"}`;
  };

  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={itemRef}
      className="relative flex w-full items-center"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Timeline Line */}
      <div className="bg-border absolute left-1/2 w-0.5 -translate-x-1/2 transform">
        <div
          className={`from-primary to-chart-1 w-full bg-gradient-to-b transition-all duration-1000 ease-out ${
            isInView ? "h-full" : "h-0"
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
            height: isInView ? "100%" : "0%",
          }}
        />
      </div>

      {/* Timeline Node */}
      <motion.div
        className="absolute left-1/2 z-10 -translate-x-1/2 transform"
        initial={{ scale: 0, rotate: -180 }}
        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1 + 0.3,
          type: "spring",
          stiffness: 200,
        }}
      >
        <div
          className={`h-12 w-12 rounded-full ${config.color} border-background flex items-center justify-center border-4 shadow-lg`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </motion.div>

      {/* Content Card */}
      <motion.div
        className={`w-5/12 ${isLeft ? "mr-auto pr-8" : "ml-auto pl-8"}`}
        initial={{
          opacity: 0,
          x: isLeft ? -100 : 100,
          y: 50,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                x: 0,
                y: 0,
              }
            : {
                opacity: 0,
                x: isLeft ? -100 : 100,
                y: 50,
              }
        }
        transition={{
          duration: 0.6,
          delay: index * 0.1 + 0.2,
          ease: "easeOut",
        }}
        whileHover={{
          y: -8,
          transition: { duration: 0.2 },
        }}
      >
        <div className="bg-card border-border shadow-custom-md hover:shadow-custom-lg group rounded-xl border p-6 transition-all duration-300">
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

      {/* Mobile Timeline Connector */}
      <div className="bg-border absolute top-0 left-6 h-full w-0.5 md:hidden">
        <div
          className={`from-primary to-chart-1 w-full bg-gradient-to-b transition-all duration-1000 ease-out ${
            isInView ? "h-full" : "h-0"
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
            height: isInView ? "100%" : "0%",
          }}
        />
      </div>
    </motion.div>
  );
};

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
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
      <div className="mx-auto max-w-6xl">
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

        {/* Timeline */}
        <motion.div className="relative space-y-12 md:space-y-16" variants={itemVariants}>
          {/* Mobile Layout */}
          <div className="md:hidden">
            {filteredExperiences.map((experience, index) => (
              <div key={experience.id} className="relative pl-12">
                {/* Mobile Timeline Node */}
                <motion.div
                  className="absolute left-6 z-10 -translate-x-1/2 transform"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`h-8 w-8 rounded-full ${experienceTypeConfig[experience.type].color} border-background flex items-center justify-center border-2 shadow-lg`}
                  >
                    {(() => {
                      const Icon = experienceTypeConfig[experience.type].icon;
                      return <Icon className="h-3 w-3" />;
                    })()}
                  </div>
                </motion.div>

                {/* Mobile Content */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border-border shadow-custom-md rounded-xl border p-4"
                >
                  <TimelineItem experience={experience} index={index} />
                </motion.div>
              </div>
            ))}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            {filteredExperiences.map((experience, index) => (
              <TimelineItem key={experience.id} experience={experience} index={index} />
            ))}
          </div>
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
