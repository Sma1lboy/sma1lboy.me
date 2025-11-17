import { Mail, Github, Linkedin, Twitter } from "lucide-react";

export function BrutalistHero() {
  return (
    <section
      id="hero"
      className="min-h-screen border-b-8 border-black px-4 pt-32 pb-12 md:pt-40 dark:border-white"
    >
      <div className="mx-auto max-w-7xl">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
          {/* Left: Text Content */}
          <div className="border-8 border-black bg-yellow-300 p-8 lg:p-12 dark:border-white dark:bg-blue-600">
            <div className="space-y-6">
              <h1 className="text-6xl leading-none font-black text-black uppercase lg:text-8xl dark:text-white">
                JACKSON
                <br />
                CHEN
              </h1>

              <div className="border-4 border-black bg-black p-4 dark:border-white dark:bg-white">
                <p className="text-xl font-bold text-white uppercase lg:text-2xl dark:text-black">
                  FULL STACK DEVELOPER &<br />
                  COMPUTER SCIENCE STUDENT
                </p>
              </div>

              <div className="border-4 border-black bg-white p-6 dark:border-white dark:bg-black">
                <p className="text-3xl font-black text-black italic lg:text-4xl dark:text-white">
                  "I CAME,
                  <br />I SAW,
                  <br />I MADE IT."
                </p>
              </div>
            </div>
          </div>

          {/* Right: About & Social */}
          <div className="border-8 border-t-0 border-black bg-white p-8 lg:border-t-8 lg:border-l-0 lg:p-12 dark:border-white dark:bg-black">
            <div className="space-y-6">
              <div className="border-4 border-black bg-red-500 p-6 dark:border-white">
                <h2 className="mb-4 text-2xl font-black text-white uppercase">ABOUT</h2>
                <div className="space-y-4 font-bold text-white">
                  <p>
                    I am a{" "}
                    <span className="bg-black px-2 py-1 text-white dark:bg-white dark:text-black">
                      FULL STACK DEVELOPER
                    </span>{" "}
                    and also a student at the{" "}
                    <span className="bg-black px-2 py-1 text-white dark:bg-white dark:text-black">
                      UNIVERSITY OF WISCONSIN-MADISON
                    </span>
                    , majoring in{" "}
                    <span className="bg-black px-2 py-1 text-white dark:bg-white dark:text-black">
                      COMPUTER SCIENCE
                    </span>
                    .
                  </p>
                  <p>
                    I'm an explorer of new tech, an{" "}
                    <span className="bg-yellow-300 px-2 py-1 text-black">AVID LEARNER</span>, and a{" "}
                    <span className="bg-yellow-300 px-2 py-1 text-black">PROBLEM-SOLVER</span> at
                    heart.
                  </p>
                  <p>
                    Moreover, I'm a{" "}
                    <span className="bg-blue-500 px-2 py-1 text-white">PASSIONATE PROGRAMMER</span>{" "}
                    on earth. Feel free to connect with me for all things tech or just to say hello!
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://github.com/Sma1lboy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border-4 border-black bg-black p-4 font-bold text-white uppercase transition-transform hover:translate-x-2 hover:translate-y-2 dark:border-white dark:bg-white dark:text-black"
                >
                  <Github size={24} />
                  GITHUB
                </a>
                <a
                  href="https://www.linkedin.com/in/jackson-chen-uwisc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border-4 border-black bg-blue-600 p-4 font-bold text-white uppercase transition-transform hover:translate-x-2 hover:translate-y-2 dark:border-white"
                >
                  <Linkedin size={24} />
                  LINKEDIN
                </a>
                <a
                  href="https://twitter.com/sma1lboy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border-4 border-black bg-blue-400 p-4 font-bold text-white uppercase transition-transform hover:translate-x-2 hover:translate-y-2 dark:border-white"
                >
                  <Twitter size={24} />
                  TWITTER
                </a>
                <a
                  href="mailto:jacksonchen666666@gmail.com"
                  className="flex items-center justify-center gap-2 border-4 border-black bg-red-600 p-4 font-bold text-white uppercase transition-transform hover:translate-x-2 hover:translate-y-2 dark:border-white"
                >
                  <Mail size={24} />
                  EMAIL
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
