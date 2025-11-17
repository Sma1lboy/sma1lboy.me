import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

export function BrutalistHero() {
  return (
    <section
      id="hero"
      className="min-h-screen pt-32 md:pt-40 pb-12 px-4 border-b-8 border-black dark:border-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: Text Content */}
          <div className="p-8 lg:p-12 border-8 border-black dark:border-white bg-yellow-300 dark:bg-blue-600">
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl font-black uppercase text-black dark:text-white leading-none">
                JACKSON<br />CHEN
              </h1>

              <div className="bg-black dark:bg-white p-4 border-4 border-black dark:border-white">
                <p className="text-xl lg:text-2xl font-bold text-white dark:text-black uppercase">
                  FULL STACK DEVELOPER &<br />COMPUTER SCIENCE STUDENT
                </p>
              </div>

              <div className="bg-white dark:bg-black p-6 border-4 border-black dark:border-white">
                <p className="text-3xl lg:text-4xl font-black text-black dark:text-white italic">
                  "I CAME,<br />I SAW,<br />I MADE IT."
                </p>
              </div>
            </div>
          </div>

          {/* Right: About & Social */}
          <div className="p-8 lg:p-12 border-8 border-black dark:border-white border-t-0 lg:border-t-8 lg:border-l-0 bg-white dark:bg-black">
            <div className="space-y-6">
              <div className="bg-red-500 p-6 border-4 border-black dark:border-white">
                <h2 className="text-2xl font-black uppercase text-white mb-4">ABOUT</h2>
                <div className="space-y-4 text-white font-bold">
                  <p>
                    I am a <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1">FULL STACK DEVELOPER</span> and also a student at the <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1">UNIVERSITY OF WISCONSIN-MADISON</span>, majoring in <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1">COMPUTER SCIENCE</span>.
                  </p>
                  <p>
                    I'm an explorer of new tech, an <span className="bg-yellow-300 text-black px-2 py-1">AVID LEARNER</span>, and a <span className="bg-yellow-300 text-black px-2 py-1">PROBLEM-SOLVER</span> at heart.
                  </p>
                  <p>
                    Moreover, I'm a <span className="bg-blue-500 text-white px-2 py-1">PASSIONATE PROGRAMMER</span> on earth. Feel free to connect with me for all things tech or just to say hello!
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://github.com/Sma1lboy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black dark:bg-white text-white dark:text-black p-4 border-4 border-black dark:border-white hover:translate-x-2 hover:translate-y-2 transition-transform flex items-center justify-center gap-2 font-bold uppercase"
                >
                  <Github size={24} />
                  GITHUB
                </a>
                <a
                  href="https://www.linkedin.com/in/jackson-chen-uwisc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-4 border-4 border-black dark:border-white hover:translate-x-2 hover:translate-y-2 transition-transform flex items-center justify-center gap-2 font-bold uppercase"
                >
                  <Linkedin size={24} />
                  LINKEDIN
                </a>
                <a
                  href="https://twitter.com/sma1lboy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-400 text-white p-4 border-4 border-black dark:border-white hover:translate-x-2 hover:translate-y-2 transition-transform flex items-center justify-center gap-2 font-bold uppercase"
                >
                  <Twitter size={24} />
                  TWITTER
                </a>
                <a
                  href="mailto:jacksonchen666666@gmail.com"
                  className="bg-red-600 text-white p-4 border-4 border-black dark:border-white hover:translate-x-2 hover:translate-y-2 transition-transform flex items-center justify-center gap-2 font-bold uppercase"
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
