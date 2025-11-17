import { sortedExperiences } from '@/constants/experiences';
import { ExternalLink } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  work: 'bg-green-500',
  internship: 'bg-blue-500',
  education: 'bg-purple-500',
  project: 'bg-yellow-400',
  award: 'bg-red-500',
};

const TYPE_LABELS: Record<string, string> = {
  work: 'WORK',
  internship: 'INTERNSHIP',
  education: 'EDUCATION',
  project: 'PROJECT',
  award: 'AWARD',
};

export function BrutalistExperience() {
  return (
    <section
      id="experience"
      className="min-h-screen py-16 px-4 border-b-8 border-black dark:border-white bg-white dark:bg-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 bg-blue-500 p-8 border-8 border-black dark:border-white">
          <h2 className="text-5xl lg:text-7xl font-black uppercase text-white">
            EXPERIENCE<br />& EDUCATION
          </h2>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {sortedExperiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            const colorClass = TYPE_COLORS[exp.type] || 'bg-gray-500';
            const typeLabel = TYPE_LABELS[exp.type] || exp.type.toUpperCase();

            return (
              <div
                key={exp.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${isEven ? '' : 'lg:flex-row-reverse'}`}
              >
                {/* Left: Type Badge & Period */}
                <div
                  className={`p-8 border-8 border-black dark:border-white ${colorClass} ${isEven ? '' : 'lg:order-2'}`}
                >
                  <div className="bg-black dark:bg-white px-4 py-2 border-4 border-black dark:border-white inline-block mb-4">
                    <span className="text-white dark:text-black font-black text-xl">
                      {typeLabel}
                    </span>
                  </div>

                  <div className="text-3xl font-black text-black dark:text-white uppercase mb-2">
                    {exp.period.start.substring(0, 7)}
                    {exp.period.end ? ` — ${exp.period.end.substring(0, 7)}` : ' — PRESENT'}
                  </div>

                  {exp.location && (
                    <div className="bg-white dark:bg-black p-3 border-4 border-black dark:border-white mt-4">
                      <p className="text-black dark:text-white font-bold">📍 {exp.location}</p>
                    </div>
                  )}
                </div>

                {/* Right: Content */}
                <div
                  className={`p-8 border-8 border-black dark:border-white border-t-0 lg:border-t-8 ${isEven ? 'lg:border-l-0' : 'lg:border-r-0'} bg-white dark:bg-black ${isEven ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  {/* Title & Company */}
                  <h3 className="text-2xl lg:text-3xl font-black uppercase text-black dark:text-white mb-2">
                    {exp.title}
                  </h3>

                  <div className="bg-yellow-300 dark:bg-yellow-600 px-4 py-2 border-4 border-black dark:border-white inline-flex items-center gap-2 mb-6">
                    <span className="text-black dark:text-white font-black text-lg">
                      {exp.company || exp.organization}
                    </span>
                    {exp.url && (
                      <a
                        href={exp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:rotate-45 transition-transform"
                      >
                        <ExternalLink size={20} className="text-black dark:text-white" />
                      </a>
                    )}
                  </div>

                  {/* Description */}
                  <div className="bg-gray-100 dark:bg-gray-900 p-4 border-4 border-black dark:border-white mb-4">
                    <p className="text-black dark:text-white font-bold leading-relaxed">
                      {exp.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="bg-black dark:bg-white px-3 py-1 border-2 border-black dark:border-white text-white dark:text-black font-bold text-xs uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Achievements */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="space-y-2">
                      {exp.achievements.map((achievement, i) => (
                        <div
                          key={i}
                          className="bg-red-500 dark:bg-red-600 p-3 border-4 border-black dark:border-white"
                        >
                          <p className="text-white font-black text-sm">★ {achievement}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
