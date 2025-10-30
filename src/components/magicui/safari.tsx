import { SVGProps, useEffect, useState } from "react";

type SafariMode = "default" | "simple";

export interface SafariProps extends SVGProps<SVGSVGElement> {
  url?: string;
  imageSrc?: string;
  videoSrc?: string;
  width?: number;
  height?: number;
  mode?: SafariMode;
}

export function Safari({
  imageSrc,
  videoSrc,
  url,
  width = 1203,
  height = 753,
  mode = "default",
  ...props
}: SafariProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1203 753"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{ background: "transparent" }}
      {...props}
    >
      <g clipPath="url(#path0)">
        {/* Main browser window background */}
        <path
          d="M0 52H1202V741C1202 747.627 1196.63 753 1190 753H12C5.37258 753 0 747.627 0 741V52Z"
          className="fill-gray-50 dark:fill-[#404040]"
        />

        {/* Browser header background */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 12C0 5.37258 5.37258 0 12 0H1190C1196.63 0 1202 5.37258 1202 12V52H0L0 12Z"
          className="fill-gray-100 dark:fill-[#404040]"
        />

        {/* Inner header */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.06738 12C1.06738 5.92487 5.99225 1 12.0674 1H1189.93C1196.01 1 1200.93 5.92487 1200.93 12V51H1.06738V12Z"
          className="fill-white dark:fill-[#262626]"
        />

        {/* Traffic light buttons */}
        <circle cx="27" cy="25" r="6" className="fill-[#FF5F57]" />
        <circle cx="47" cy="25" r="6" className="fill-[#FFBD2E]" />
        <circle cx="67" cy="25" r="6" className="fill-[#28CA42]" />

        {/* Address bar */}
        <path
          d="M286 17C286 13.6863 288.686 11 292 11H946C949.314 11 952 13.6863 952 17V35C952 38.3137 949.314 41 946 41H292C288.686 41 286 38.3137 286 35V17Z"
          className="fill-[#E5E5E5] dark:fill-[#404040]"
        />

        {/* Lock icon */}
        {mode === "default" && (
          <g className="mix-blend-luminosity">
            <path
              d="M300 32.0852H306.157C307.008 32.0852 307.427 31.6663 307.427 30.7395V25.9851C307.427 25.1472 307.084 24.7219 306.373 24.6521V23.0842C306.373 20.6721 304.767 19.5105 303.079 19.5105C301.39 19.5105 299.784 20.6721 299.784 23.0842V24.6711C299.124 24.7727 298.731 25.1917 298.731 25.9851V30.7395C298.731 31.6663 299.149 32.0852 300 32.0852ZM301.003 22.97C301.003 21.491 301.942 20.6785 303.079 20.6785C304.209 20.6785 305.154 21.491 305.154 22.97V24.6394L301.003 24.6458V22.97Z"
              fill="#A3A3A3"
            />
          </g>
        )}

        {/* URL text */}
        <g className="mix-blend-luminosity">
          <text
            x="580"
            y="30"
            fill="#A3A3A3"
            fontSize="12"
            fontFamily="Arial, sans-serif"
            textAnchor="middle"
          >
            {url}
          </text>
        </g>

        {/* Website content area */}
        {imageSrc && (
          <g>
            <defs>
              <filter id="darkImageFilter" colorInterpolationFilters="sRGB">
                <feComponentTransfer>
                  <feFuncR type="linear" slope="0.7" intercept="0" />
                  <feFuncG type="linear" slope="0.7" intercept="0" />
                  <feFuncB type="linear" slope="0.7" intercept="0" />
                </feComponentTransfer>
                <feColorMatrix type="saturate" values="0.8" />
                <feComponentTransfer>
                  <feFuncR type="linear" slope="0.9" intercept="0" />
                  <feFuncG type="linear" slope="0.9" intercept="0" />
                  <feFuncB type="linear" slope="0.9" intercept="0" />
                </feComponentTransfer>
              </filter>
            </defs>
            <image
              href={imageSrc}
              width="1200"
              height="700"
              x="1"
              y="52"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#roundedBottom)"
              filter={isDark ? "url(#darkImageFilter)" : undefined}
            />
          </g>
        )}

        {videoSrc && (
          <foreignObject
            x="1"
            y="52"
            width="1200"
            height="700"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#roundedBottom)"
          >
            <video
              className="size-full overflow-hidden object-cover dark:brightness-[0.7] dark:contrast-[0.9] dark:saturate-[0.8]"
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
            />
          </foreignObject>
        )}
      </g>

      <defs>
        <clipPath id="path0">
          <path
            d="M0 12C0 5.37258 5.37258 0 12 0H1190C1196.63 0 1202 5.37258 1202 12V741C1202 747.627 1196.63 753 1190 753H12C5.37258 753 0 747.627 0 741V12Z"
            fill="white"
          />
        </clipPath>
        <clipPath id="roundedBottom">
          <path
            d="M1 52H1201V741C1201 747.075 1196.08 752 1190 752H12C5.92486 752 1 747.075 1 741V52Z"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
