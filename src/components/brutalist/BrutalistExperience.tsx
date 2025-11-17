import { sortedExperiences } from "@/constants/experiences";
import { ExternalLink } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  work: "bg-green-500",
  internship: "bg-blue-500",
  education: "bg-purple-500",
  project: "bg-yellow-400",
  award: "bg-red-500",
};

const TYPE_LABELS: Record<string, string> = {
  work: "WORK",
  internship: "INTERNSHIP",
  education: "EDUCATION",
  project: "PROJECT",
  award: "AWARD",
};

export function BrutalistExperience() {
  return (
    <section
      id="experience"
      className="min-h-screen border-b-8 border-black bg-white px-4 py-16 dark:border-white dark:bg-black"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 border-8 border-black bg-blue-500 p-8 dark:border-white">
          <h2 className="text-5xl font-black text-white uppercase lg:text-7xl">
            EXPERIENCE
            <br />& EDUCATION
          </h2>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {sortedExperiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            const colorClass = TYPE_COLORS[exp.type] || "bg-gray-500";
            const typeLabel = TYPE_LABELS[exp.type] || exp.type.toUpperCase();

            return (
              <div
                key={exp.id}
                className={`grid grid-cols-1 gap-0 lg:grid-cols-2 ${isEven ? "" : "lg:flex-row-reverse"}`}
              >
                {/* Left: Type Badge & Period */}
                <div
                  className={`border-8 border-black p-8 dark:border-white ${colorClass} ${isEven ? "" : "lg:order-2"}`}
                >
                  <div className="mb-4 inline-block border-4 border-black bg-black px-4 py-2 dark:border-white dark:bg-white">
                    <span className="text-xl font-black text-white dark:text-black">
                      {typeLabel}
                    </span>
                  </div>

                  <div className="mb-2 text-3xl font-black text-black uppercase dark:text-white">
                    {exp.period.start.substring(0, 7)}
                    {exp.period.end ? ` — ${exp.period.end.substring(0, 7)}` : " — PRESENT"}
                  </div>

                  {exp.location && (
                    <div className="mt-4 border-4 border-black bg-white p-3 dark:border-white dark:bg-black">
                      <p className="font-bold text-black dark:text-white">📍 {exp.location}</p>
                    </div>
                  )}
                </div>

                {/* Right: Content */}
                <div
                  className={`border-8 border-t-0 border-black p-8 lg:border-t-8 dark:border-white ${isEven ? "lg:border-l-0" : "lg:border-r-0"} bg-white dark:bg-black ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  {/* Title & Company */}
                  <h3 className="mb-2 text-2xl font-black text-black uppercase lg:text-3xl dark:text-white">
                    {exp.title}
                  </h3>

                  <div className="mb-6 inline-flex items-center gap-2 border-4 border-black bg-yellow-300 px-4 py-2 dark:border-white dark:bg-yellow-600">
                    <span className="text-lg font-black text-black dark:text-white">
                      {exp.company || exp.organization}
                    </span>
                    {exp.url && (
                      <a
                        href={exp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:rotate-45"
                      >
                        <ExternalLink size={20} className="text-black dark:text-white" />
                      </a>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4 border-4 border-black bg-gray-100 p-4 dark:border-white dark:bg-gray-900">
                    <p className="leading-relaxed font-bold text-black dark:text-white">
                      {exp.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {exp.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="border-2 border-black bg-black px-3 py-1 text-xs font-bold text-white uppercase dark:border-white dark:bg-white dark:text-black"
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
                          className="border-4 border-black bg-red-500 p-3 dark:border-white dark:bg-red-600"
                        >
                          <p className="text-sm font-black text-white">★ {achievement}</p>
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
