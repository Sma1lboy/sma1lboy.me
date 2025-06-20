import { Experience } from "../types";

// Experience data constants
export const experiences: Experience[] = [
  {
    id: "tabbyml-engineer",
    title: "Software Engineer",
    company: "TabbyML, Inc.",
    period: {
      start: "2025-05",
    },
    description:
      "Developing Pochi, a full-stack AI teammate platform using TypeScript and Rust in a monorepo architecture, enabling seamless developer collaboration. Designed and implemented Cloud system for parallel task execution, integrated with VSCode environment and CLI agent, improving development workflow efficiency by 60%. Implemented Agent Mode with leveraging IDE capabilities to deliver smooth UX experience and increasing user engagement by 35%. Refactored frontend-backend Task Event architecture with complete decoupling, enabling multi-entry task creation.",
    type: "work",
    technologies: ["TypeScript", "Rust", "AI/ML", "VSCode", "CLI", "Cloud Systems"],
    achievements: [
      "Developed Pochi AI teammate platform with 60% workflow efficiency improvement",
      "Designed Cloud system for parallel task execution with VSCode integration",
      "Implemented Agent Mode increasing user engagement by 35%",
      "Refactored Task Event architecture with complete frontend-backend decoupling",
      "Enabled multi-entry task creation capabilities",
    ],
    location: "Remote",
    url: "https://getpochi.com",
    featured: true,
  },
  {
    id: "tabbyml-engineer-intern",
    title: "Software Engineer Intern",
    company: "TabbyML, Inc.",
    period: {
      start: "2024-08",
      end: "2025-05",
    },
    description:
      "Contributed to TabbyML's open-source AI assistant project (31k+ GitHub stars) by optimizing core context-aware algorithms, enhancing suggestion speed by 40% and accuracy by 15% for 60 million+ users. Implemented Next Edit Prediction system from end-to-end using Rust and TypeScript, enabling proactive code suggestions and reducing user cognitive load by 10%. Developed a natural language outline editing feature, increasing daily active users by 3% and streamlining code structure planning time by 12%. Designed and implemented an AI-driven commit generator for multi-repo setups, reducing average commit preparation time by 80%. Created a Smart Apply feature for automatic code snippet insertion and implemented quick fix and explain this shortcut actions, improving user efficiency by 25%.",
    type: "internship",
    technologies: ["Rust", "TypeScript", "AI/ML", "Open Source"],
    achievements: [
      "Contributed to open-source project with 31k+ GitHub stars serving 60M+ users",
      "Optimized context-aware algorithms enhancing suggestion speed by 40% and accuracy by 15%",
      "Implemented Next Edit Prediction system reducing user cognitive load by 10%",
      "Developed natural language outline editing feature increasing DAU by 3%",
      "Created AI-driven commit generator reducing commit preparation time by 80%",
      "Implemented Smart Apply feature improving user efficiency by 25%",
    ],
    location: "Remote",
    url: "https://tabby.ml",
    featured: true,
  },
  {
    id: "virtual-hybird-intern",
    title: "Software Engineer",
    company: "Virtual Hybird Inc",
    period: {
      start: "2023-05",
      end: "2023-08",
    },
    description:
      "Utilized Java Spring Boot to improve the scalability of the application through distributed microservices. Built cutting-edge 'Nearby people' service by utilizing the PostGIS extension based on PostgreSQL. Developed a location-based recommendation in Java using the Yelp API and JTS Topology Suite to retrieve nearby feeds based on actual geographic locations, contributing to a 30% rise in user satisfaction. Created a News-Feed server using the fan-out pattern to reduce the 95% of time users are stuck uploading images. Implemented Redis Pub/Sub to enhance the user experience by addressing back-end processing delays for uploaded images. This solution enabled users to upload images seamlessly without waiting, resulting in a smoother and more efficient image processing flow.",
    type: "internship",
    technologies: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "PostGIS",
      "Redis",
      "Microservices",
      "Yelp API",
    ],
    achievements: [
      "Improved application scalability through distributed microservices architecture",
      "Built 'Nearby people' service using PostGIS extension with PostgreSQL",
      "Developed location-based recommendation system contributing to 30% rise in user satisfaction",
      "Created News-Feed server using fan-out pattern reducing 95% of image upload delays",
      "Implemented Redis Pub/Sub for seamless image processing flow",
    ],
    location: "Seattle, Kentucky, United States - Remote",
  },
  {
    id: "shanghai-maimiao-intern",
    title: "Software Developer Intern",
    company: "Shanghai MaiMiao Internet Ltd",
    period: {
      start: "2024-04",
      end: "2024-08",
    },
    description:
      "Designed and developed a scalable, full-stack mobile app with React Native + Expo and Spring Boot + Java microservices, enhancing UX and business operations. Set up a CI/CD pipeline automating builds, tests, and deployments, accelerating releases by 50% and ensuring code quality. Implemented efficient RESTful APIs and a flexible message service interface, optimizing system performance by 30% and enabling integration with various backends.",
    type: "internship",
    technologies: ["React Native", "Expo", "Spring Boot", "Java", "CI/CD", "RESTful APIs"],
    achievements: [
      "Developed scalable full-stack mobile app with React Native and Spring Boot",
      "Set up CI/CD pipeline accelerating releases by 50%",
      "Implemented RESTful APIs optimizing system performance by 30%",
      "Enhanced UX and business operations through microservices architecture",
    ],
    location: "Shanghai, China",
  },
  {
    id: "university-wisconsin-madison",
    title: "Bachelor of Science in Computer Sciences",
    organization: "University of Wisconsin-Madison",
    period: {
      start: "2023-08",
      end: "2025-05",
    },
    description:
      "Pursuing Bachelor of Science in Computer Sciences with a focus on software engineering, algorithms, and artificial intelligence. Maintaining excellent academic performance with a GPA of 3.53/4.00.",
    type: "education",
    technologies: [
      "Java",
      "Python",
      "C++",
      "Data Structures",
      "Algorithms",
      "Software Engineering",
    ],
    achievements: [
      "GPA: 3.53/4.00",
      "Focus on AI and software engineering",
      "Expected graduation May 2025",
    ],
    location: "Madison, WI",
  },
  {
    id: "ohio-state-university",
    title: "Bachelor of Science in Computer Engineering",
    organization: "The Ohio State University",
    period: {
      start: "2021-08",
      end: "2023-05",
    },
    description:
      "Completed foundational coursework in Computer Engineering with a strong GPA of 3.74/4.00. Built solid foundation in computer systems, programming, and engineering principles before transferring to University of Wisconsin-Madison.",
    type: "education",
    technologies: ["C++", "Java", "Computer Systems", "Engineering Principles", "Mathematics"],
    achievements: [
      "GPA: 3.74/4.00",
      "Strong foundation in computer engineering",
      "Successful transfer to UW-Madison",
    ],
    location: "Columbus, OH",
  },
  {
    id: "foxychat-project",
    title: "FoxyChat - AI-Powered Desktop Application",
    period: {
      start: "2024-01",
    },
    description:
      "Won Hackathon and developed a full-stack AI-powered desktop application using Electron and React. Redefined agent architecture as Prompt + MCPs specification and implemented an agent marketplace for AI workflow automation. Implemented AI-driven capabilities in macOS using native system integration to enhance productivity.",
    type: "project",
    technologies: ["TypeScript", "Electron", "React", "Node.js", "Express", "Docker", "OpenAI"],
    achievements: [
      "Won Hackathon with innovative AI desktop application",
      "Redefined agent architecture with Prompt + MCPs specification",
      "Implemented agent marketplace for AI workflow automation",
      "Built native macOS system integration for enhanced productivity",
    ],
    url: "https://foxychat.net",
    featured: true,
  },
  {
    id: "melodyBay-project",
    title: "MelodyBay - Microservice-based Music Platform",
    period: {
      start: "2023-01",
    },
    description:
      "Developed a microservice-based platform for sharing 50,000+ songs, utilizing Java and Spring Boot. Designed and implemented a Redis-based intelligent search engine supporting fuzzy search and auto-completion for songs, artists, and albums. Built an Elasticsearch-based intelligent search engine supporting fuzzy search and auto-completion for songs, artists, and albums.",
    type: "project",
    technologies: ["Java", "Spring Boot", "React", "PostgreSQL", "Docker", "Kubernetes"],
    achievements: [
      "Built platform supporting 50,000+ songs with microservice architecture",
      "Designed Redis-based caching reducing hot song access response time by 70%",
      "Implemented Elasticsearch search engine with fuzzy search and auto-completion",
      "Developed scalable microservice architecture with Docker and Kubernetes",
    ],
  },
  {
    id: "codefox-project",
    title: "CodeFox - AI Project Generation Tools",
    period: {
      start: "2024-01",
    },
    description:
      "Built next-generation AI project generation tools with sophisticated build system with dependency resolution and virtual filesystem, managing complex project generation workflows through 10+ specialized build handlers for seamless full-stack development.",
    type: "project",
    technologies: ["TypeScript", "Next.js", "NextUI", "PostgreSQL", "GraphQL", "AI/ML"],
    achievements: [
      "Built sophisticated build system with dependency resolution and virtual filesystem",
      "Implemented 10+ specialized build handlers for complex project generation",
      "Managed complex project generation workflows for full-stack development",
      "Developed next-generation AI project generation capabilities",
    ],
    url: "https://github.com/CodeFox-Repo/codefox",
  },
  {
    id: "ai-valley-hackathon",
    title: "AI Valley Hackathon Winner - TraeByteDance Challenge",
    period: {
      start: "2024-04",
      end: "2024-04",
    },
    description:
      "Won the TraeByteDance Challenge at AI Valley Hackathon, demonstrating exceptional problem-solving skills and innovative AI application development within a competitive timeframe.",
    type: "award",
    technologies: ["AI/ML", "Python", "React", "API Integration"],
    achievements: [
      "Won TraeByteDance Challenge at AI Valley Hackathon",
      "Demonstrated innovative AI application development",
      "Showcased exceptional problem-solving skills under pressure",
      "Competed successfully against other talented developers",
    ],
  },
];

// Sort by time (newest first)
export const sortedExperiences = [...experiences].sort((a, b) => {
  const aDate = new Date(a.period.start);
  const bDate = new Date(b.period.start);
  return bDate.getTime() - aDate.getTime();
});

// Featured experiences
export const featuredExperiences = experiences.filter((exp) => exp.featured);

// Experiences grouped by type
export const experiencesByType = experiences.reduce(
  (acc, exp) => {
    if (!acc[exp.type]) {
      acc[exp.type] = [];
    }
    acc[exp.type].push(exp);
    return acc;
  },
  {} as Record<string, Experience[]>,
);
