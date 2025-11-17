import { featuredProjects } from "@/constants/home";
import { ExternalLink } from "lucide-react";

const COLORS = ["bg-red-500", "bg-blue-500", "bg-yellow-400", "bg-green-500", "bg-purple-500"];

export function BrutalistProjects() {
  return (
    <section
      id="projects"
      className="min-h-screen border-b-8 border-black bg-gray-100 px-4 py-16 dark:border-white dark:bg-gray-900"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 border-8 border-black bg-black p-8 dark:border-white dark:bg-white">
          <h2 className="text-5xl font-black text-white uppercase lg:text-7xl dark:text-black">
            SELECTED
            <br />
            WORK
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div
                className={`${COLORS[index % COLORS.length]} h-full border-8 border-black p-8 transition-transform hover:translate-x-2 hover:translate-y-2 dark:border-white`}
              >
                {/* Year Badge */}
                <div className="mb-4 inline-block border-4 border-black bg-black px-4 py-2 dark:border-white dark:bg-white">
                  <span className="text-xl font-black text-white dark:text-black">
                    {project.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-4 flex items-center gap-2 text-3xl font-black text-black uppercase lg:text-4xl dark:text-white">
                  {project.title}
                  <ExternalLink size={32} className="transition-transform group-hover:rotate-45" />
                </h3>

                {/* Description */}
                <div className="mb-4 border-4 border-black bg-white p-4 dark:border-white dark:bg-black">
                  <p className="leading-relaxed font-bold text-black dark:text-white">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="border-4 border-black bg-black p-4 dark:border-white dark:bg-white">
                  <p className="text-sm font-black text-white uppercase dark:text-black">
                    {project.tech}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
