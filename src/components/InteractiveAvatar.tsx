import React, { useCallback, useState } from "react";
import { Circle, Layer, Stage } from "react-konva";

interface CircleData {
  x: number;
  y: number;
  radius: number;
  color: string;
  level: number;
  id: string;
}

interface InteractiveAvatarProps {
  imageSrc: string;
  className?: string;
}

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  imageSrc,
  className = "",
}) => {
  const [circles, setCircles] = useState<CircleData[]>([]);
  const [stageSize, setStageSize] = useState({ width: 800, height: 800 });
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const minRadius = 2;
  const maxLevel = 17;

  React.useEffect(() => {
    const loadImage = async () => {
      const img = new Image();

      img.onload = () => {
        const size = Math.min(window.innerWidth * 0.7, 800);
        setStageSize({ width: size, height: size });

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size);
          setImageData(data);

          const mainCircle: CircleData = {
            x: size / 2,
            y: size / 2,
            radius: size / 2,
            color: getAverageColor(data, 0, 0, size, size),
            level: 0,
            id: generateCircleId(),
          };

          const preSplitCircles = [mainCircle];

          for (let iteration = 0; iteration < 17; iteration++) {
            const currentCircles = [...preSplitCircles];
            preSplitCircles.length = 0;

            currentCircles.forEach((circle) => {
              const normalizedX = circle.x / size;
              const normalizedY = circle.y / size;

              // Distance from center (for radial effect)
              const distanceFromCenter = Math.sqrt(
                (normalizedX - 0.5) ** 2 + (normalizedY - 0.5) ** 2,
              );

              // Distance from main diagonal (for diagonal emphasis)
              const distanceFromDiagonal = Math.abs(normalizedX - normalizedY);

              // Combine center focus with diagonal emphasis
              const centerWeight = Math.exp(-distanceFromCenter * 3); // Focus on center
              const diagonalWeight = Math.exp(-distanceFromDiagonal * 1.5); // Emphasize diagonal

              const baseProbability = 0.95 - iteration * 0.025;
              const combinedWeight = centerWeight * 0.6 + diagonalWeight * 0.4;
              const splitProbability = baseProbability * combinedWeight;

              if (Math.random() < splitProbability && circle.radius > size / 128) {
                const newRadius = circle.radius / 2;
                const offset = newRadius; // Perfect fit without overlap

                const positions = [
                  { x: circle.x - offset, y: circle.y - offset },
                  { x: circle.x + offset, y: circle.y - offset },
                  { x: circle.x - offset, y: circle.y + offset },
                  { x: circle.x + offset, y: circle.y + offset },
                ];

                positions.forEach((pos) => {
                  const color = getSampleColor(data, pos.x, pos.y);
                  preSplitCircles.push({
                    x: pos.x,
                    y: pos.y,
                    radius: newRadius,
                    color,
                    level: circle.level + 1,
                    id: generateCircleId(),
                  });
                });
              } else {
                preSplitCircles.push(circle);
              }
            });
          }

          const finalCircles = [...preSplitCircles];
          const additionalCircles: CircleData[] = [];

          for (let i = 0; i < finalCircles.length; i++) {
            const circle = finalCircles[i];

            if (circle.radius > size / 32) {
              const shouldForceSplit = Math.random() < 0.8;

              if (shouldForceSplit) {
                const newRadius = circle.radius / 2;
                const offset = newRadius; // Perfect fit without overlap

                const positions = [
                  { x: circle.x - offset, y: circle.y - offset },
                  { x: circle.x + offset, y: circle.y - offset },
                  { x: circle.x - offset, y: circle.y + offset },
                  { x: circle.x + offset, y: circle.y + offset },
                ];

                positions.forEach((pos) => {
                  const color = getSampleColor(data, pos.x, pos.y);
                  additionalCircles.push({
                    x: pos.x,
                    y: pos.y,
                    radius: newRadius,
                    color,
                    level: circle.level + 1,
                    id: generateCircleId(),
                  });
                });

                finalCircles.splice(i, 1);
                i--;
              }
            }
          }

          const allCircles = [...finalCircles, ...additionalCircles];
          setCircles(allCircles);
        }
      };

      img.onerror = (error) => {
        console.error("Failed to load image:", error);
        const size = Math.min(window.innerWidth * 0.7, 800);
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

      img.src = imageSrc;
    };

    loadImage();
  }, [imageSrc]);

  const generateCircleId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const getSampleColor = (imageData: ImageData, x: number, y: number): string => {
    const px = Math.floor(x);
    const py = Math.floor(y);

    if (px < 0 || px >= imageData.width || py < 0 || py >= imageData.height) {
      return "#6366f1";
    }

    const index = (py * imageData.width + px) * 4;
    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];

    return `rgb(${r}, ${g}, ${b})`;
  };

  const getAverageColor = (
    imageData: ImageData,
    x: number,
    y: number,
    width: number,
    height: number,
  ): string => {
    const data = imageData.data;
    const imageWidth = imageData.width;
    let r = 0,
      g = 0,
      b = 0,
      count = 0;

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

    if (count === 0) return "#6366f1";

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const sampleColorFromImage = (x: number, y: number): string => {
    if (!imageData) {
      return "#6366f1";
    }

    const px = Math.floor(x);
    const py = Math.floor(y);

    if (px < 0 || px >= imageData.width || py < 0 || py >= imageData.height) {
      return "#6366f1";
    }

    const index = (py * imageData.width + px) * 4;
    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];

    return `rgb(${r}, ${g}, ${b})`;
  };

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
        newCircles.splice(circleIndex, 1);

        const newRadius = circle.radius / 2;
        const offset = newRadius; // Perfect fit without overlap

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

  const handleCircleClick = useCallback(
    (index: number) => {
      splitCircle(index);
    },
    [splitCircle],
  );

  return (
    <div className={`flex w-full justify-center ${className}`}>
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
  );
};
