import React, { useCallback, useState } from "react";
import { Circle, Layer, Stage } from "react-konva";
import { useAvatarCacheStore } from "../store/avatarCacheStore";

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
  const maxLevel = 25; // Increased for deeper detail

  // Performance optimization: limit total circles to prevent memory issues
  const maxCircles = 8000;

  // Use Zustand store for cache management
  const {
    get: getCachedCircles,
    set: setCachedCircles,
    isLoading,
    setLoading,
  } = useAvatarCacheStore();

  React.useEffect(() => {
    const loadImage = async () => {
      setLoading(true);

      const size = Math.min(window.innerWidth * 0.7, 800);
      const targetStageSize = { width: size, height: size };

      // Check cache first
      const cachedCircles = await getCachedCircles(imageSrc, targetStageSize);
      if (cachedCircles) {
        console.log("🎯 Using cached data");
        setCircles(cachedCircles);
        setStageSize(targetStageSize);
        setLoading(false);
        return;
      }

      console.log("🔄 Starting new circle calculation");
      const img = new Image();

      img.onload = async () => {
        setStageSize(targetStageSize);

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

          // Enhanced pre-split algorithm with deeper subdivision
          for (let iteration = 0; iteration < 25; iteration++) {
            // Performance check: stop if we have too many circles
            if (preSplitCircles.length > maxCircles * 0.8) {
              break;
            }

            const currentCircles = [...preSplitCircles];
            preSplitCircles.length = 0;

            currentCircles.forEach((circle) => {
              const normalizedX = circle.x / size;
              const normalizedY = circle.y / size;

              // Enhanced distance calculations for better distribution
              const distanceFromCenter = Math.sqrt(
                (normalizedX - 0.5) ** 2 + (normalizedY - 0.5) ** 2,
              );

              // Multiple focal points for more interesting patterns
              const distanceFromTopLeft = Math.sqrt(normalizedX ** 2 + normalizedY ** 2);
              const distanceFromBottomRight = Math.sqrt(
                (normalizedX - 1) ** 2 + (normalizedY - 1) ** 2,
              );
              const distanceFromDiagonal = Math.abs(normalizedX - normalizedY);
              const distanceFromAntiDiagonal = Math.abs(normalizedX + normalizedY - 1);

              // Enhanced weighting system for better visual distribution
              const centerWeight = Math.exp(-distanceFromCenter * 2.5);
              const cornerWeight = Math.max(
                Math.exp(-distanceFromTopLeft * 2),
                Math.exp(-distanceFromBottomRight * 2),
              );
              const diagonalWeight = Math.max(
                Math.exp(-distanceFromDiagonal * 1.8),
                Math.exp(-distanceFromAntiDiagonal * 1.8),
              );

              // Color variance analysis for content-aware splitting
              const colorVariance = getColorVariance(data, circle.x, circle.y, circle.radius);
              const varianceWeight = Math.min(colorVariance / 50, 1); // Normalize variance

              // Dynamic probability based on iteration, position, and content
              let baseProbability;
              if (iteration < 8) {
                baseProbability = 0.98 - iteration * 0.02; // High initial probability
              } else if (iteration < 16) {
                baseProbability = 0.82 - (iteration - 8) * 0.04; // Medium probability
              } else {
                baseProbability = 0.5 - (iteration - 16) * 0.03; // Lower probability for fine details
              }

              // Combine all weights for intelligent splitting
              const combinedWeight =
                centerWeight * 0.3 +
                cornerWeight * 0.2 +
                diagonalWeight * 0.25 +
                varianceWeight * 0.25;

              const splitProbability = baseProbability * combinedWeight;

              // More aggressive minimum radius for deeper detail
              const minRadius = size / 256;

              // Use deterministic pseudo-random number based on circle position and iteration
              const seed = circle.x * 1000 + circle.y * 100 + iteration * 10;
              const pseudoRandom = (Math.sin(seed) + 1) / 2; // Deterministic random number between 0-1

              if (pseudoRandom < splitProbability && circle.radius > minRadius) {
                const newRadius = circle.radius / 2;
                const offset = newRadius;

                const positions = [
                  { x: circle.x - offset, y: circle.y - offset },
                  { x: circle.x + offset, y: circle.y - offset },
                  { x: circle.x - offset, y: circle.y + offset },
                  { x: circle.x + offset, y: circle.y + offset },
                ];

                positions.forEach((pos) => {
                  // Enhanced color sampling with area averaging
                  const color = getEnhancedColor(data, pos.x, pos.y, newRadius);
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

          // Enhanced final processing with content-aware splitting
          for (let i = 0; i < finalCircles.length; i++) {
            const circle = finalCircles[i];

            // More aggressive final splitting for better detail
            if (circle.radius > size / 64) {
              // Content-aware splitting decision
              const colorVariance = getColorVariance(data, circle.x, circle.y, circle.radius);

              // Higher probability for areas with more color variation
              const varianceBasedProbability = Math.min(colorVariance / 30, 1);
              const baseForceSplitProbability = 0.7;

              // Use deterministic pseudo-random number
              const seed = circle.x * 1000 + circle.y * 100 + circle.level * 10;
              const pseudoRandom = (Math.sin(seed) + 1) / 2;
              const shouldForceSplit =
                pseudoRandom < baseForceSplitProbability + varianceBasedProbability * 0.3;

              if (shouldForceSplit) {
                const newRadius = circle.radius / 2;
                const offset = newRadius;

                const positions = [
                  { x: circle.x - offset, y: circle.y - offset },
                  { x: circle.x + offset, y: circle.y - offset },
                  { x: circle.x - offset, y: circle.y + offset },
                  { x: circle.x + offset, y: circle.y + offset },
                ];

                positions.forEach((pos) => {
                  // Use enhanced color sampling for final circles
                  const color = getEnhancedColor(data, pos.x, pos.y, newRadius);
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

          // Additional micro-detail pass for very small circles
          const microDetailCircles: CircleData[] = [];
          additionalCircles.forEach((circle) => {
            if (circle.radius > size / 128 && circle.radius <= size / 64) {
              const colorVariance = getColorVariance(data, circle.x, circle.y, circle.radius);

              // Only split if there's significant color variation
              // Use deterministic pseudo-random number
              const seed = circle.x * 1000 + circle.y * 100 + circle.level * 10;
              const pseudoRandom = (Math.sin(seed) + 1) / 2;
              if (colorVariance > 20 && pseudoRandom < 0.4) {
                const newRadius = circle.radius / 2;
                const offset = newRadius;

                const positions = [
                  { x: circle.x - offset, y: circle.y - offset },
                  { x: circle.x + offset, y: circle.y - offset },
                  { x: circle.x - offset, y: circle.y + offset },
                  { x: circle.x + offset, y: circle.y + offset },
                ];

                positions.forEach((pos) => {
                  const color = getEnhancedColor(data, pos.x, pos.y, newRadius);
                  microDetailCircles.push({
                    x: pos.x,
                    y: pos.y,
                    radius: newRadius,
                    color,
                    level: circle.level + 1,
                    id: generateCircleId(),
                  });
                });
              }
            }
          });

          const allCircles = [...finalCircles, ...additionalCircles, ...microDetailCircles];

          // Performance optimization: limit total circles and sort by importance
          const sortedCircles = allCircles
            .sort((a, b) => {
              // Prioritize circles with higher color variance (more interesting areas)
              const varianceA = getColorVariance(data, a.x, a.y, a.radius);
              const varianceB = getColorVariance(data, b.x, b.y, b.radius);
              return varianceB - varianceA;
            })
            .slice(0, maxCircles);

          setCircles(sortedCircles);

          // Save to cache
          await setCachedCircles(imageSrc, targetStageSize, sortedCircles);
          console.log("💾 Saved to cache");
          setLoading(false);
        }
      };

      img.onerror = (error) => {
        console.error("Failed to load image:", error);
        setStageSize(targetStageSize);

        const initialCircle: CircleData = {
          x: targetStageSize.width / 2,
          y: targetStageSize.height / 2,
          radius: targetStageSize.width / 2,
          color: "#6366f1",
          level: 0,
          id: generateCircleId(),
        };

        setCircles([initialCircle]);
        setLoading(false);
      };

      img.src = imageSrc;
    };

    loadImage();
  }, [getCachedCircles, imageSrc, setCachedCircles, setLoading]);

  const generateCircleId = () => {
    return Math.random().toString(36).substr(2, 9);
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

  const getColorVariance = (
    imageData: ImageData,
    centerX: number,
    centerY: number,
    radius: number,
  ): number => {
    const data = imageData.data;
    const imageWidth = imageData.width;
    const imageHeight = imageData.height;

    const samples: number[] = [];
    const sampleRadius = Math.max(1, Math.floor(radius / 4));

    // Sample colors in a grid pattern within the circle
    for (let dy = -sampleRadius; dy <= sampleRadius; dy += 2) {
      for (let dx = -sampleRadius; dx <= sampleRadius; dx += 2) {
        const x = Math.floor(centerX + dx);
        const y = Math.floor(centerY + dy);

        if (x >= 0 && x < imageWidth && y >= 0 && y < imageHeight) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= sampleRadius) {
            const index = (y * imageWidth + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Calculate luminance as a simple color metric
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            samples.push(luminance);
          }
        }
      }
    }

    if (samples.length < 2) return 0;

    // Calculate variance
    const mean = samples.reduce((sum, val) => sum + val, 0) / samples.length;
    const variance = samples.reduce((sum, val) => sum + (val - mean) ** 2, 0) / samples.length;

    return Math.sqrt(variance);
  };

  const getEnhancedColor = (
    imageData: ImageData,
    centerX: number,
    centerY: number,
    radius: number,
  ): string => {
    const data = imageData.data;
    const imageWidth = imageData.width;
    const imageHeight = imageData.height;

    let r = 0,
      g = 0,
      b = 0,
      count = 0;
    const sampleRadius = Math.max(1, Math.floor(radius / 3));

    // Sample in a circular pattern for better color representation
    for (let dy = -sampleRadius; dy <= sampleRadius; dy++) {
      for (let dx = -sampleRadius; dx <= sampleRadius; dx++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= sampleRadius) {
          const x = Math.floor(centerX + dx);
          const y = Math.floor(centerY + dy);

          if (x >= 0 && x < imageWidth && y >= 0 && y < imageHeight) {
            const index = (y * imageWidth + x) * 4;

            // Weight samples by distance (closer samples have more influence)
            const weight = 1 - distance / sampleRadius;

            r += data[index] * weight;
            g += data[index + 1] * weight;
            b += data[index + 2] * weight;
            count += weight;
          }
        }
      }
    }

    if (count === 0) {
      // If no valid samples, try to get a single pixel color at the center
      const px = Math.floor(centerX);
      const py = Math.floor(centerY);

      if (px >= 0 && px < imageWidth && py >= 0 && py < imageHeight) {
        const index = (py * imageWidth + px) * 4;
        const singleR = imageData.data[index];
        const singleG = imageData.data[index + 1];
        const singleB = imageData.data[index + 2];
        return `rgb(${singleR}, ${singleG}, ${singleB})`;
      }

      return "#6366f1"; // Only fallback if completely out of bounds
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

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

        const newSubCircles: CircleData[] = positions.map((pos) => {
          // Use enhanced color sampling if imageData is available, otherwise inherit parent color
          let color = circle.color; // Default to parent color

          if (imageData) {
            // Try to get enhanced color from image
            const sampledColor = getEnhancedColor(imageData, pos.x, pos.y, newRadius);
            if (sampledColor !== "#6366f1") {
              // Only use if not the fallback color
              color = sampledColor;
            }
          }

          return {
            x: pos.x,
            y: pos.y,
            radius: newRadius,
            color,
            level: circle.level + 1,
            id: generateCircleId(),
          };
        });

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
        {/* Loading state display */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-sm text-gray-600">Generating circles...</p>
            </div>
          </div>
        )}

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
