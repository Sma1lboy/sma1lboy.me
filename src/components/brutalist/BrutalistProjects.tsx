import { featuredProjects } from '@/constants/home';
import { ExternalLink } from 'lucide-react';

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500', 'bg-purple-500'];

export function BrutalistProjects() {
  return (
    <section
      id="projects"
      className="min-h-screen py-16 px-4 border-b-8 border-black dark:border-white bg-gray-100 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 bg-black dark:bg-white p-8 border-8 border-black dark:border-white">
          <h2 className="text-5xl lg:text-7xl font-black uppercase text-white dark:text-black">
            SELECTED<br />WORK
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project, index) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div
                className={`${COLORS[index % COLORS.length]} p-8 border-8 border-black dark:border-white hover:translate-x-2 hover:translate-y-2 transition-transform h-full`}
              >
                {/* Year Badge */}
                <div className="inline-block bg-black dark:bg-white px-4 py-2 border-4 border-black dark:border-white mb-4">
                  <span className="text-white dark:text-black font-black text-xl">
                    {project.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl lg:text-4xl font-black uppercase text-black dark:text-white mb-4 flex items-center gap-2">
                  {project.title}
                  <ExternalLink
                    size={32}
                    className="group-hover:rotate-45 transition-transform"
                  />
                </h3>

                {/* Description */}
                <div className="bg-white dark:bg-black p-4 border-4 border-black dark:border-white mb-4">
                  <p className="text-black dark:text-white font-bold leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="bg-black dark:bg-white p-4 border-4 border-black dark:border-white">
                  <p className="text-white dark:text-black font-black uppercase text-sm">
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
