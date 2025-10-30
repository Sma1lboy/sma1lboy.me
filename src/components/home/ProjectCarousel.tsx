import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import React from "react";
import { featuredProjects } from "../../constants/home";
import { Safari } from "../magicui/safari";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function ProjectCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Handle hover state for autoplay
  React.useEffect(() => {
    if (!api) return;

    if (isHovered) {
      autoplayPlugin.current.stop();
    } else {
      autoplayPlugin.current.play();
    }
  }, [isHovered, api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[autoplayPlugin.current]}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {featuredProjects.map((project, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="flex flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:gap-16">
                {/* Project Info */}
                <div className="space-y-4 sm:space-y-6 lg:w-2/5">
                  <div className="mb-2 text-xs font-medium tracking-wider text-gray-400 uppercase sm:mb-3 sm:text-sm dark:text-gray-500">
                    {project.year} • Selected Work
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:mb-4 lg:text-4xl dark:text-gray-100">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-base leading-relaxed font-light text-gray-600 sm:mb-6 sm:text-lg dark:text-gray-400">
                    {project.description}
                  </p>
                  <div className="mb-4 text-xs font-medium text-gray-500 sm:mb-6 sm:text-sm dark:text-gray-400">
                    {project.tech}
                  </div>
                  <motion.a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex touch-manipulation items-center gap-2 text-gray-900 transition-colors duration-200 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-base font-medium sm:text-lg">Visit Project</span>
                    <ArrowUpRight
                      size={18}
                      className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 sm:size-5"
                    />
                  </motion.a>
                </div>

                {/* Project Preview with Safari Component */}
                <div className="w-full lg:w-3/5">
                  <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={() => setIsHovered(true)}
                    onTouchEnd={() => setIsHovered(false)}
                  >
                    <motion.div
                      className="cursor-pointer touch-manipulation"
                      onClick={() => window.open(project.url, "_blank")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Safari
                        url={project.url.replace("https://", "")}
                        imageSrc={project.preview}
                        width={800}
                        height={500}
                        className="h-full w-full overflow-hidden rounded-lg bg-transparent"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots Navigation */}
      <div className="mt-12 mb-8 flex items-center justify-center sm:mt-16 sm:mb-10">
        <div className="flex gap-2 sm:gap-3">
          {featuredProjects.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-3 w-3 touch-manipulation rounded-full transition-colors duration-300 sm:h-3 sm:w-3 ${
                index === current ? "bg-gray-800 dark:bg-gray-200" : "bg-gray-300 dark:bg-gray-600"
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
