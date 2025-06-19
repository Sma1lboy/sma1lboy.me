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
  { name: "gRPC", category: "Backend", level: "Intermediate" },
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

  const renderTechList = (techs: TechItem[]) => (
    <div className="flex flex-wrap gap-2">
      {techs.map((tech) => (
        <motion.span
          key={tech.name}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-light transition-all duration-200 ${
            tech.level === "Expert"
              ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
              : tech.level === "Advanced"
                ? "bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-900"
                : tech.level === "Intermediate"
                  ? "bg-gray-500 text-white dark:bg-gray-500 dark:text-white"
                  : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {tech.name}
        </motion.span>
      ))}
    </div>
  );

  return (
    <motion.section
      className="bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-24 xl:px-24 dark:bg-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-7xl">
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

        {/* GitHub Stats */}
        <motion.div
          className="mb-12 grid grid-cols-2 gap-4 sm:mb-16 md:grid-cols-4"
          variants={itemVariants}
        >
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900 sm:text-3xl lg:text-4xl dark:text-gray-100">
              79
            </div>
            <div className="text-sm font-light text-gray-600 dark:text-gray-400">Public Repos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900 sm:text-3xl lg:text-4xl dark:text-gray-100">
              78
            </div>
            <div className="text-sm font-light text-gray-600 dark:text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900 sm:text-3xl lg:text-4xl dark:text-gray-100">
              52
            </div>
            <div className="text-sm font-light text-gray-600 dark:text-gray-400">Following</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-gray-900 sm:text-3xl lg:text-4xl dark:text-gray-100">
              4+
            </div>
            <div className="text-sm font-light text-gray-600 dark:text-gray-400">Years Coding</div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-2 sm:mb-16"
          variants={itemVariants}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-light transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Tech Stack Display */}
        {selectedCategory === "All" ? (
          /* Grouped by Category */
          <motion.div className="space-y-8 sm:space-y-12" variants={itemVariants}>
            {Object.entries(groupedTech).map(([category, techs]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="text-lg font-light text-gray-900 sm:text-xl dark:text-gray-100">
                  {category}
                </h3>
                {renderTechList(techs)}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Filtered Category */
          <motion.div variants={itemVariants}>
            {renderTechList(filteredTech.sort((a, b) => levelOrder[b.level] - levelOrder[a.level]))}
          </motion.div>
        )}

        {/* Legend */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-6 sm:mt-16"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-gray-900 dark:bg-gray-100"></div>
            <span className="text-sm font-light text-gray-600 dark:text-gray-400">Expert</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-gray-700 dark:bg-gray-300"></div>
            <span className="text-sm font-light text-gray-600 dark:text-gray-400">Advanced</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-gray-500"></div>
            <span className="text-sm font-light text-gray-600 dark:text-gray-400">
              Intermediate
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <span className="text-sm font-light text-gray-600 dark:text-gray-400">Familiar</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
