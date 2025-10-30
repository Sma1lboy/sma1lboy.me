import { motion } from "framer-motion";
import { useState } from "react";
import { containerVariants, itemVariants } from "../../constants/home";

type TechCategory =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "Database"
  | "Services"
  | "AI/ML"
  | "Graphics";

interface TechItem {
  name: string;
  category: TechCategory;
  level: "Expert" | "Advanced" | "Intermediate" | "Familiar";
}

const techStack: TechItem[] = [
  // Programming Languages
  { name: "TypeScript", category: "Languages", level: "Expert" },
  { name: "JavaScript", category: "Languages", level: "Expert" },
  { name: "Java", category: "Languages", level: "Expert" },
  { name: "Python", category: "Languages", level: "Advanced" },
  { name: "C++", category: "Languages", level: "Advanced" },
  { name: "Rust", category: "Languages", level: "Advanced" },
  { name: "C", category: "Languages", level: "Intermediate" },
  { name: "Go", category: "Languages", level: "Intermediate" },
  { name: "Swift", category: "Languages", level: "Intermediate" },
  { name: "C#", category: "Languages", level: "Familiar" },
  { name: "PHP", category: "Languages", level: "Familiar" },
  { name: "Ruby", category: "Languages", level: "Familiar" },

  // Frontend
  { name: "React", category: "Frontend", level: "Expert" },
  { name: "Next.js", category: "Frontend", level: "Advanced" },
  { name: "Vite", category: "Frontend", level: "Advanced" },
  { name: "Tailwind CSS", category: "Frontend", level: "Advanced" },
  { name: "Framer Motion", category: "Frontend", level: "Advanced" },
  { name: "TanStack Router", category: "Frontend", level: "Advanced" },
  { name: "HTML/CSS", category: "Frontend", level: "Expert" },
  { name: "Vue.js", category: "Frontend", level: "Intermediate" },
  { name: "React Native", category: "Frontend", level: "Intermediate" },
  { name: "Sass/SCSS", category: "Frontend", level: "Advanced" },
  { name: "Styled Components", category: "Frontend", level: "Intermediate" },
  { name: "Material-UI", category: "Frontend", level: "Intermediate" },
  { name: "Ant Design", category: "Frontend", level: "Intermediate" },
  { name: "Bootstrap", category: "Frontend", level: "Intermediate" },
  { name: "Webpack", category: "Frontend", level: "Intermediate" },
  { name: "ESLint", category: "Frontend", level: "Advanced" },
  { name: "Prettier", category: "Frontend", level: "Advanced" },
  { name: "Jest", category: "Frontend", level: "Intermediate" },
  { name: "React Testing Library", category: "Frontend", level: "Intermediate" },
  { name: "Storybook", category: "Frontend", level: "Familiar" },

  // Backend & Frameworks
  { name: "Spring Boot", category: "Backend", level: "Advanced" },
  { name: "Node.js", category: "Backend", level: "Advanced" },
  { name: "ASP.NET Core", category: "Backend", level: "Advanced" },
  { name: "Express.js", category: "Backend", level: "Intermediate" },
  { name: "FastAPI", category: "Backend", level: "Intermediate" },
  { name: "Actix Web", category: "Backend", level: "Intermediate" },
  { name: "Spring Cloud", category: "Backend", level: "Intermediate" },
  { name: "Microservices", category: "Backend", level: "Advanced" },
  { name: "Spring Security", category: "Backend", level: "Advanced" },
  { name: "Spring Data JPA", category: "Backend", level: "Advanced" },
  { name: "Hibernate", category: "Backend", level: "Advanced" },
  { name: "MyBatis", category: "Backend", level: "Intermediate" },
  { name: "Entity Framework", category: "Backend", level: "Intermediate" },
  { name: "Nest.js", category: "Backend", level: "Intermediate" },
  { name: "Koa.js", category: "Backend", level: "Familiar" },
  { name: "Django", category: "Backend", level: "Intermediate" },
  { name: "Flask", category: "Backend", level: "Intermediate" },
  { name: "RESTful APIs", category: "Backend", level: "Expert" },
  { name: "GraphQL", category: "Backend", level: "Intermediate" },
  { name: "gRPC", category: "Backend", level: "Intermediate" },
  { name: "WebSocket", category: "Backend", level: "Intermediate" },
  { name: "JWT", category: "Backend", level: "Advanced" },
  { name: "OAuth 2.0", category: "Backend", level: "Intermediate" },

  // Tools & DevOps
  { name: "Docker", category: "DevOps", level: "Advanced" },
  { name: "Git", category: "DevOps", level: "Expert" },
  { name: "GitHub Actions", category: "DevOps", level: "Intermediate" },
  { name: "CMake", category: "DevOps", level: "Intermediate" },
  { name: "Kubernetes", category: "DevOps", level: "Familiar" },
  { name: "AWS", category: "DevOps", level: "Intermediate" },
  { name: "Vercel", category: "DevOps", level: "Advanced" },
  { name: "Railway", category: "DevOps", level: "Advanced" },
  { name: "Netlify", category: "DevOps", level: "Intermediate" },
  { name: "Heroku", category: "DevOps", level: "Intermediate" },
  { name: "DigitalOcean", category: "DevOps", level: "Intermediate" },
  { name: "Eureka", category: "DevOps", level: "Intermediate" },
  { name: "Spring Cloud Gateway", category: "DevOps", level: "Intermediate" },
  { name: "Nginx", category: "DevOps", level: "Intermediate" },
  { name: "Apache", category: "DevOps", level: "Familiar" },

  // Databases
  { name: "PostgreSQL", category: "Database", level: "Intermediate" },
  { name: "MySQL", category: "Database", level: "Intermediate" },
  { name: "MongoDB", category: "Database", level: "Advanced" },
  { name: "SQLite", category: "Database", level: "Intermediate" },
  { name: "Redis", category: "Database", level: "Intermediate" },
  { name: "Elasticsearch", category: "Database", level: "Intermediate" },

  // Third-party Services & APIs
  { name: "Resend", category: "Services", level: "Advanced" },
  { name: "Stripe", category: "Services", level: "Intermediate" },
  { name: "Auth0", category: "Services", level: "Intermediate" },
  { name: "Clerk", category: "Services", level: "Intermediate" },
  { name: "Supabase", category: "Services", level: "Advanced" },
  { name: "Firebase", category: "Services", level: "Intermediate" },
  { name: "Twilio", category: "Services", level: "Familiar" },
  { name: "SendGrid", category: "Services", level: "Intermediate" },
  { name: "Cloudinary", category: "Services", level: "Intermediate" },
  { name: "Sentry", category: "Services", level: "Intermediate" },

  // Specialized
  { name: "Machine Learning", category: "AI/ML", level: "Intermediate" },
  { name: "PyTorch", category: "AI/ML", level: "Intermediate" },
  { name: "TensorFlow", category: "AI/ML", level: "Familiar" },
  { name: "LLM Development", category: "AI/ML", level: "Advanced" },
  { name: "Computer Graphics", category: "Graphics", level: "Advanced" },
  { name: "Ray Tracing", category: "Graphics", level: "Advanced" },
  { name: "OpenGL", category: "Graphics", level: "Intermediate" },
];

const categories = [
  "All",
  "Languages",
  "Frontend",
  "Backend",
  "DevOps",
  "Database",
  "Services",
  "AI/ML",
  "Graphics",
];

const levelOrder = { Expert: 4, Advanced: 3, Intermediate: 2, Familiar: 1 };

export default function TechStackSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTech =
    selectedCategory === "All"
      ? techStack
      : techStack.filter((tech) => tech.category === selectedCategory);

  // Group by category for better organization
  const groupedTech = categories.slice(1).reduce(
    (acc, category) => {
      const categoryTechs = techStack.filter((tech) => tech.category === category);
      if (categoryTechs.length > 0) {
        acc[category] = categoryTechs.sort((a, b) => levelOrder[b.level] - levelOrder[a.level]);
      }
      return acc;
    },
    {} as Record<string, TechItem[]>,
  );

  const getLevelStyle = (level: string) => {
    switch (level) {
      case "Expert":
        return "font-medium text-gray-900 dark:text-gray-100";
      case "Advanced":
        return "text-gray-900 dark:text-gray-100";
      case "Intermediate":
        return "text-gray-600 dark:text-gray-400";
      case "Familiar":
        return "text-gray-500 dark:text-gray-500";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const renderTechList = (techs: TechItem[]) => (
    <div className="flex flex-wrap gap-x-3 gap-y-2">
      {techs.map((tech, index) => (
        <motion.span
          key={tech.name}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.02 }}
          viewport={{ once: true }}
          className={`text-sm font-light ${getLevelStyle(tech.level)}`}
        >
          {tech.name}
          {index < techs.length - 1 && (
            <span className="ml-3 text-gray-300 dark:text-gray-700">•</span>
          )}
        </motion.span>
      ))}
    </div>
  );

  return (
    <motion.section
      className="bg-white px-4 py-12 sm:px-8 sm:py-12 lg:px-16 lg:py-16 xl:px-24 dark:bg-black"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div className="mb-12 text-center sm:mb-16" variants={itemVariants}>
          <h2 className="mb-3 text-2xl font-light text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl dark:text-gray-100">
            Technical Expertise
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light text-gray-600 sm:text-lg dark:text-gray-400">
            A comprehensive overview of technologies and tools I work with, organized by expertise
            and experience.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-3 sm:mb-16"
          variants={itemVariants}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full px-4 py-2 text-sm font-light transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Tech Stack Display */}
        {selectedCategory === "All" ? (
          /* Grouped by Category */
          <motion.div className="space-y-12" variants={itemVariants}>
            {Object.entries(groupedTech).map(([category, techs]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="border-b border-gray-200 pb-8 last:border-0 dark:border-[#1a1a1a]"
              >
                <h3 className="mb-4 text-base font-light tracking-wider text-gray-400 uppercase dark:text-gray-600">
                  {category}
                </h3>
                {renderTechList(techs)}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Filtered Category */
          <motion.div variants={itemVariants} className="pb-8">
            {renderTechList(filteredTech.sort((a, b) => levelOrder[b.level] - levelOrder[a.level]))}
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          className="mt-12 border-t border-gray-200 pt-8 sm:mt-16 dark:border-[#1a1a1a]"
          variants={itemVariants}
        >
          <p className="mb-4 text-center text-xs font-light tracking-wider text-gray-400 uppercase dark:text-gray-600">
            Proficiency Legend
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-gray-100">Expert</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                — Production-ready, extensive experience
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-gray-100">Advanced</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                — Strong working knowledge
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Intermediate</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                — Practical experience
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-500">Familiar</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                — Basic understanding
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
