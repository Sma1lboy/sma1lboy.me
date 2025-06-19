import React, { useCallback, useState } from "react";
import { Stage, Layer, Circle } from "react-konva";
import { Linkedin, Github, Mail, Play, Twitter } from "lucide-react";

interface CircleData {
  x: number;
  y: number;
  radius: number;
  color: string;
  level: number;
  id: string;
}

interface Props extends React.ComponentProps<"div"> {}

export const Home = ({ ...rest }: Props) => {
  const [circles, setCircles] = useState<CircleData[]>([]);
  const [stageSize, setStageSize] = useState({ width: 600, height: 600 });
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const minRadius = 3;
  const maxLevel = 10;

    // Load and process the image
  React.useEffect(() => {
    const loadImage = async () => {
      const img = new Image();
      
      img.onload = () => {
        const size = Math.min(window.innerWidth * 0.5, 600);
        setStageSize({ width: size, height: size });
        
        // Create canvas to extract image data
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Draw image to fit canvas
          ctx.drawImage(img, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size);
          setImageData(data);
          
          // Create initial circle with average color
          const avgColor = getAverageColor(data, 0, 0, size, size);
          
          const initialCircle: CircleData = {
            x: size / 2,
            y: size / 2,
            radius: size / 2,
            color: avgColor,
            level: 0,
            id: generateCircleId(),
          };
          
          setCircles([initialCircle]);
        }
      };
      
      img.onerror = (error) => {
        console.error('Failed to load image:', error);
        // Fallback to default circle
        const size = Math.min(window.innerWidth * 0.5, 600);
        setStageSize({ width: size, height: size });
        
        const initialCircle: CircleData = {
          x: size / 2,
          y: size / 2,
          radius: size / 2,
          color: "#6366f1",
          level: 0,
          id: generateCircleId(),
        };
        
        setCircles([initialCircle]);
      };
      
      img.src = '/home-avatar.png';
    };
    
    loadImage();
  }, []);

  const generateCircleId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Get average color from image data in a region
  const getAverageColor = (
    imageData: ImageData,
    x: number,
    y: number,
    width: number,
    height: number
  ): string => {
    const data = imageData.data;
    const imageWidth = imageData.width;
    let r = 0, g = 0, b = 0, count = 0;
    
    const startX = Math.max(0, Math.floor(x));
    const endX = Math.min(imageWidth, Math.floor(x + width));
    const startY = Math.max(0, Math.floor(y));
    const endY = Math.min(imageData.height, Math.floor(y + height));
    
    for (let py = startY; py < endY; py += 2) {
      for (let px = startX; px < endX; px += 2) {
        const index = (py * imageWidth + px) * 4;
        r += data[index];
        g += data[index + 1];
        b += data[index + 2];
        count++;
      }
    }
    
    if (count === 0) return '#6366f1';
    
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Sample color from specific point in image
  const sampleColorFromImage = (x: number, y: number): string => {
    if (!imageData) {
      return '#6366f1';
    }
    
    const px = Math.floor(x);
    const py = Math.floor(y);
    
    if (px < 0 || px >= imageData.width || py < 0 || py >= imageData.height) {
      return '#6366f1';
    }
    
    const index = (py * imageData.width + px) * 4;
    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Generate artistic color based on position
  const getColorFromPosition = useCallback((x: number, y: number): string => {
    const hue = ((x + y) * 0.8) % 360;
    const saturation = 60 + Math.sin(x * 0.01) * 20;
    const lightness = 45 + Math.cos(y * 0.01) * 15;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }, []);

  // Split circle function
  const splitCircle = useCallback(
    (circleIndex: number) => {
      setCircles((prevCircles) => {
        if (circleIndex < 0 || circleIndex >= prevCircles.length) {
          return prevCircles;
        }

        const circle = prevCircles[circleIndex];

        if (!circle || circle.radius <= minRadius || circle.level >= maxLevel) {
          return prevCircles;
        }

        const newCircles = [...prevCircles];
        // Remove the original circle
        newCircles.splice(circleIndex, 1);

        // Create 4 smaller circles
        const newRadius = circle.radius / 2;
        const offset = newRadius * 0.7;

        const positions = [
          { x: circle.x - offset, y: circle.y - offset },
          { x: circle.x + offset, y: circle.y - offset },
          { x: circle.x - offset, y: circle.y + offset },
          { x: circle.x + offset, y: circle.y + offset },
        ];

        const newSubCircles: CircleData[] = positions.map((pos) => ({
          x: pos.x,
          y: pos.y,
          radius: newRadius,
          color: sampleColorFromImage(pos.x, pos.y),
          level: circle.level + 1,
          id: generateCircleId(),
        }));

        return [...newCircles, ...newSubCircles];
      });
    },
    [minRadius, maxLevel, imageData],
  );

  // Find circle at position
  const findCircleAtPosition = useCallback(
    (x: number, y: number): number | null => {
      for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);

        if (distance <= circle.radius && circle.radius > minRadius && circle.level < maxLevel) {
          return i;
        }
      }
      return null;
    },
    [circles, minRadius, maxLevel],
  );

  // Handle circle click
  const handleCircleClick = useCallback(
    (index: number) => {
      splitCircle(index);
    },
    [splitCircle],
  );

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

                {/* Right Column - Interactive Canvas */}
        <div className="flex flex-col items-center justify-center bg-white p-8 lg:w-1/2 lg:p-16 xl:p-24">
          {/* Canvas Container */}
          <div className="flex w-full justify-center">
            {/* Konva Stage */}
            <div className="relative">
              <Stage 
                width={stageSize.width} 
                height={stageSize.height}
                className="cursor-crosshair"
                style={{ backgroundColor: "#ffffff" }}
              >
                <Layer>
                  {circles.map((circle, index) => (
                    <Circle
                      key={circle.id}
                      x={circle.x}
                      y={circle.y}
                      radius={circle.radius}
                      fill={circle.color}
                      onClick={() => handleCircleClick(index)}
                      onTap={() => handleCircleClick(index)}
                      onMouseEnter={(e) => {
                        const stage = e.target.getStage();
                        if (stage) {
                          stage.container().style.cursor = "pointer";
                        }
                        // Auto split on mouse enter
                        splitCircle(index);
                      }}
                      onMouseLeave={(e) => {
                        const stage = e.target.getStage();
                        if (stage) {
                          stage.container().style.cursor = "crosshair";
                        }
                      }}
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
