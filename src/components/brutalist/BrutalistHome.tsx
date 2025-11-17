import { BrutalistHero } from "./BrutalistHero";
import { BrutalistProjects } from "./BrutalistProjects";
import { BrutalistExperience } from "./BrutalistExperience";
import { BrutalistTechStack } from "./BrutalistTechStack";
import { BrutalistGitHub } from "./BrutalistGitHub";
import { BrutalistNav } from "./BrutalistNav";

export default function BrutalistHome() {
  return (
    <div className="min-h-screen bg-white font-mono dark:bg-black">
      <BrutalistNav />
      <div className="brutalist-container">
        <BrutalistHero />
        <BrutalistProjects />
        <BrutalistExperience />
        <BrutalistTechStack />
        <BrutalistGitHub />
      </div>
    </div>
  );
}
