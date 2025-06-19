import React, { useState } from "react";
import { HeroSection } from "./HeroSection";
import { NavigationDock } from "./NavigationDock";
import { ProjectsSection } from "./ProjectsSection";

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

      if (!heroSection || !projectsSection) return;

      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const heroTop = heroSection.offsetTop;
      const projectsTop = projectsSection.offsetTop;

      if (scrollPosition >= heroTop && scrollPosition < projectsTop) {
        setActiveSection("hero");
      } else if (scrollPosition >= projectsTop) {
        setActiveSection("projects");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="bg-white text-gray-900" {...rest}>
        <HeroSection />
        <ProjectsSection />
      </div>

      <NavigationDock activeSection={activeSection} scrollToSection={scrollToSection} />
    </>
  );
}
