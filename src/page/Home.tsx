import React from "react";
import { Linkedin, Github, Mail, Play, Twitter } from "lucide-react";
import { InteractiveAvatar } from "../components";

interface Props extends React.ComponentProps<"div"> {}

export const Home = ({ ...rest }: Props) => {

  return (
    <div className="min-h-screen bg-white text-gray-900" {...rest}>
      {/* Main Layout - Two Columns */}
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Column - Personal Introduction */}
        <div className="flex flex-col justify-center p-8 lg:w-1/2 lg:p-16 xl:p-24">
          {/* Header */}
          <div className="max-w-md">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 lg:text-6xl">Jackson Chen</h1>
            <p className="mb-8 text-lg font-light text-gray-600 lg:text-xl">
              Full Stack Developer & Computer Science Student
            </p>

            {/* Quote */}
            <blockquote className="mb-12 text-2xl leading-relaxed font-light text-gray-700 italic lg:text-3xl">
              "I came, I saw, I made it."
            </blockquote>

            {/* About */}
            <div className="mb-12 space-y-6 text-gray-600">
              <p className="leading-relaxed">
                I am a <strong>Full Stack Developer</strong> and also a student at the{" "}
                <strong>University of Wisconsin-Madison</strong>, majoring in{" "}
                <strong>Computer Science</strong>. I'm an explorer of new tech, an{" "}
                <strong>avid learner</strong>, and a <strong>problem-solver</strong> at heart.
              </p>
              <p className="leading-relaxed">
                Moreover, I'm a <strong>passionate programmer</strong> on earth. Feel free to connect with me
                for all things tech or just to say hello!
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://x.com/sma1lboy"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
                aria-label="Twitter"
              >
                <Twitter size={20} className="text-gray-600" />
              </a>
              <a
                href="https://space.bilibili.com/72605744"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
                aria-label="Bilibili"
              >
                <Play size={20} className="text-gray-600" />
              </a>
              <a
                href="https://github.com/Sma1lboy"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
                aria-label="GitHub"
              >
                <Github size={20} className="text-gray-600" />
              </a>
              <a
                href="https://www.linkedin.com/in/chong-chen-857214292/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-gray-600" />
              </a>
              <a
                href="mailto:jackson@example.com"
                className="rounded-full border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50"
                aria-label="Email"
              >
                <Mail size={20} className="text-gray-600" />
              </a>
            </div>
          </div>
        </div>

                {/* Right Column - Interactive Avatar */}
        <div className="flex flex-col items-center justify-center bg-white p-8 lg:w-1/2 lg:p-16 xl:p-24">
          <InteractiveAvatar imageSrc="/home-avatar.png" />
        </div>
      </div>
    </div>
  );
};
