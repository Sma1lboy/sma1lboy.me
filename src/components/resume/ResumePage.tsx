import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Star,
  Twitter,
} from "lucide-react";
import { resumeData } from "../../constants/resume";
import { useSEO } from "@/hooks/useSEO";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function section(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease },
  };
}

export default function ResumePage() {
  useSEO({
    title: "Resume",
    description: "Professional experience, education, and skills.",
    path: "/resume",
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0a0a0a] dark:text-gray-100">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:py-20">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          className="mb-16"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            {resumeData.name}
          </h1>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">@{resumeData.handle}</p>
          <p className="mt-3 text-base text-gray-600 dark:text-[#999]">{resumeData.title}</p>

          {/* Contact links */}
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <a
              href={resumeData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Github size={14} />
              GitHub
            </a>
            <a
              href={resumeData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>
            <a
              href={resumeData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Twitter size={14} />
              Twitter
            </a>
            <a
              href={`mailto:${resumeData.email}`}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Mail size={14} />
              Email
            </a>
          </div>
        </motion.header>

        {/* Experience Timeline */}
        <motion.section className="mb-16" {...section(0.15)}>
          <div className="mb-6 flex items-center gap-2">
            <Briefcase size={16} className="text-gray-400 dark:text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Experience</h2>
          </div>

          <div className="relative ml-3 border-l border-gray-200 pl-8 dark:border-[#1a1a1a]">
            {resumeData.experience.map((exp, i) => (
              <motion.div
                key={exp.company}
                className="relative mb-10 last:mb-0"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.1, ease }}
              >
                {/* Timeline dot */}
                <div
                  className="absolute top-1.5 -left-[37px] h-3 w-3 rounded-full border-2 border-white dark:border-[#0a0a0a]"
                  style={{ backgroundColor: exp.color }}
                />

                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-[#e0e0e0]">
                      {exp.company}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-[#888]">{exp.role}</p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400 dark:text-[#666]">
                    {exp.period}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-[#999]">
                  {exp.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-[#151515] dark:text-[#888]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section className="mb-16" {...section(0.3)}>
          <div className="mb-6 flex items-center gap-2">
            <GraduationCap size={16} className="text-gray-400 dark:text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Education</h2>
          </div>

          {resumeData.education.map((edu) => (
            <div
              key={edu.school}
              className="rounded-lg border border-gray-100 p-5 dark:border-[#1a1a1a]"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-base font-medium text-gray-900 dark:text-[#e0e0e0]">
                  {edu.school}
                </h3>
                <span className="shrink-0 text-xs text-gray-400 dark:text-[#666]">
                  {edu.period}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-[#888]">{edu.degree}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-[#999]">
                {edu.details}
              </p>
            </div>
          ))}
        </motion.section>

        {/* Skills Grid */}
        <motion.section className="mb-16" {...section(0.4)}>
          <div className="mb-6 flex items-center gap-2">
            <BookOpen size={16} className="text-gray-400 dark:text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Skills</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resumeData.skills.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="rounded-lg border border-gray-100 p-4 dark:border-[#1a1a1a]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.07, ease }}
              >
                <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-[#666]">
                  {cat.name}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-[#151515] dark:text-[#999]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Open Source Contributions */}
        <motion.section className="mb-16" {...section(0.5)}>
          <div className="mb-6 flex items-center gap-2">
            <Star size={16} className="text-gray-400 dark:text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Open Source Contributions
            </h2>
          </div>

          <div className="space-y-3">
            {resumeData.contributions.map((c, i) => (
              <motion.a
                key={c.project}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:border-gray-200 dark:border-[#1a1a1a] dark:hover:border-[#2a2a2a]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.07, ease }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-[#e0e0e0]">
                      {c.project}
                    </h3>
                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:bg-[#151515] dark:text-[#666]">
                      {c.role}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-[#888]">{c.description}</p>
                </div>
                <ExternalLink
                  size={14}
                  className="mt-0.5 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500 dark:text-[#333] dark:group-hover:text-[#666]"
                />
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section className="mb-16" {...section(0.6)}>
          <div className="mb-6 flex items-center gap-2">
            <Award size={16} className="text-gray-400 dark:text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Achievements</h2>
          </div>

          <div className="space-y-3">
            {resumeData.achievements.map((a, i) => (
              <motion.div
                key={a.title}
                className="rounded-lg border border-gray-100 p-4 dark:border-[#1a1a1a]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.65 + i * 0.07, ease }}
              >
                <h3 className="text-sm font-medium text-gray-900 dark:text-[#e0e0e0]">{a.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-[#888]">{a.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Download PDF Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.75, ease }}
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[#1a1a1a] dark:bg-[#111] dark:text-[#ccc] dark:hover:bg-[#151515]"
            onClick={() => window.print()}
          >
            <Download size={15} />
            Download PDF
          </button>
        </motion.div>
      </div>
    </div>
  );
}
