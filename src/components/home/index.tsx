import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { sortedExperiences } from "../../constants/experiences";
import { ExperienceSection } from "./ExperienceSection";
import { GitHubActivitySection } from "./GitHubActivitySection";
import { HeroSection } from "./HeroSection";
import { NavigationDock } from "./NavigationDock";
import { ProjectsSection } from "./ProjectsSection";
import TechStackSection from "./TechStackSection";

interface Props extends React.ComponentProps<"div"> {}

export function Home({ ...rest }: Props) {
  const [activeSection, setActiveSection] = useState("hero"); // Track current section

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll detection to highlight current section
  React.useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      const projectsSection = document.getElementById("projects");
      const experienceSection = document.getElementById("experience");
      const techStackSection = document.getElementById("tech-stack");
      const githubActivitySection = document.getElementById("github-activity");

      if (!heroSection || !projectsSection || !experienceSection || !techStackSection) return;

      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const heroTop = heroSection.offsetTop;
      const projectsTop = projectsSection.offsetTop;
      const experienceTop = experienceSection.offsetTop;
      const techStackTop = techStackSection.offsetTop;
      const githubActivityTop = githubActivitySection?.offsetTop || Infinity;

      if (scrollPosition >= heroTop && scrollPosition < projectsTop) {
        setActiveSection("hero");
      } else if (scrollPosition >= projectsTop && scrollPosition < experienceTop) {
        setActiveSection("projects");
      } else if (scrollPosition >= experienceTop && scrollPosition < techStackTop) {
        setActiveSection("experience");
      } else if (scrollPosition >= techStackTop && scrollPosition < githubActivityTop) {
        setActiveSection("tech-stack");
      } else if (scrollPosition >= githubActivityTop) {
        setActiveSection("github-activity");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className="overflow-x-hidden bg-white text-gray-900 dark:bg-black dark:text-gray-100"
        {...rest}
      >
        <HeroSection />
        <ProjectsSection />
        <div id="experience">
          <ExperienceSection experiences={sortedExperiences} />
        </div>
        <div id="tech-stack">
          <TechStackSection />
        </div>
        <GitHubActivitySection />
      </div>

      <NavigationDock activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* Brutalist Version Link */}
      <Link
        to="/new"
        className="fixed right-6 bottom-24 z-40 border-4 border-black bg-yellow-400 px-6 py-3 text-sm font-black text-black uppercase shadow-lg transition-transform hover:translate-x-1 hover:translate-y-1 dark:border-white"
      >
        🎨 BRUTALIST
      </Link>
    </>
  );
}
