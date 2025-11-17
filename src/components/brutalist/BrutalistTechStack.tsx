import { useState } from "react";

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

const LEVEL_COLORS: Record<string, string> = {
  Expert: "bg-red-500",
  Advanced: "bg-yellow-400",
  Intermediate: "bg-blue-500",
  Familiar: "bg-green-500",
};

export function BrutalistTechStack() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTech =
    selectedCategory === "All"
      ? techStack
      : techStack.filter((tech) => tech.category === selectedCategory);

  const groupedByLevel = filteredTech.reduce(
    (acc, tech) => {
      if (!acc[tech.level]) {
        acc[tech.level] = [];
      }
      acc[tech.level].push(tech);
      return acc;
    },
    {} as Record<string, TechItem[]>,
  );

  return (
    <section
      id="tech-stack"
      className="min-h-screen border-b-8 border-black bg-yellow-200 px-4 py-16 dark:border-white dark:bg-purple-900"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 border-8 border-black bg-purple-600 p-8 dark:border-white">
          <h2 className="text-5xl font-black text-white uppercase lg:text-7xl">
            TECH
            <br />
            STACK
          </h2>
        </div>

        {/* Category Filter */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`border-6 border-black p-4 text-lg font-black uppercase transition-transform hover:scale-105 dark:border-white ${
                selectedCategory === category
                  ? "scale-105 bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white text-black dark:bg-black dark:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tech by Level */}
        <div className="space-y-8">
          {["Expert", "Advanced", "Intermediate", "Familiar"].map((level) => {
            const techs = groupedByLevel[level] || [];
            if (techs.length === 0) return null;

            return (
              <div key={level}>
                {/* Level Header */}
                <div
                  className={`${LEVEL_COLORS[level]} mb-4 border-8 border-black p-6 dark:border-white`}
                >
                  <h3 className="text-3xl font-black text-black uppercase lg:text-4xl dark:text-white">
                    {level} ({techs.length})
                  </h3>
                </div>

                {/* Tech Items */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {techs.map((tech) => (
                    <div
                      key={tech.name}
                      className="border-4 border-black bg-white p-4 transition-transform hover:translate-x-1 hover:translate-y-1 dark:border-white dark:bg-black"
                    >
                      <p className="text-center text-sm font-black text-black uppercase dark:text-white">
                        {tech.name}
                      </p>
                      <p className="mt-1 text-center text-xs font-bold text-gray-600 dark:text-gray-400">
                        {tech.category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
