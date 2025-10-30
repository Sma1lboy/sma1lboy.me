import React, { useState } from "react";
import { sortedExperiences } from "../../constants/experiences";
import { ExperienceSection } from "./ExperienceSection";
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

      if (!heroSection || !projectsSection || !experienceSection || !techStackSection) return;

      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const heroTop = heroSection.offsetTop;
      const projectsTop = projectsSection.offsetTop;
      const experienceTop = experienceSection.offsetTop;
      const techStackTop = techStackSection.offsetTop;

      if (scrollPosition >= heroTop && scrollPosition < projectsTop) {
        setActiveSection("hero");
      } else if (scrollPosition >= projectsTop && scrollPosition < experienceTop) {
        setActiveSection("projects");
      } else if (scrollPosition >= experienceTop && scrollPosition < techStackTop) {
        setActiveSection("experience");
      } else if (scrollPosition >= techStackTop) {
        setActiveSection("tech-stack");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className="overflow-x-hidden bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
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
      </div>

      <NavigationDock activeSection={activeSection} scrollToSection={scrollToSection} />
    </>
  );
}
