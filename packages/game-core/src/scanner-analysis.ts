export interface ImagePixels {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export interface MatchaDetection {
  isMatcha: boolean;
  centerX: number;
  centerY: number;
  matchCount: number;
}

export function analyzeMatchaPixels(image: ImagePixels): MatchaDetection {
  let sumX = 0;
  let sumY = 0;
  let matchCount = 0;

  for (let index = 0; index < image.data.length; index += 4) {
    const r = image.data[index];
    const g = image.data[index + 1];
    const b = image.data[index + 2];

    if (g > 65 && g > r * 1.15 && g > b * 1.15 && r < 190 && b < 190) {
      matchCount += 1;
      const pixelIndex = index / 4;
      sumX += pixelIndex % image.width;
      sumY += Math.floor(pixelIndex / image.width);
    }
  }

  return {
    isMatcha:
      matchCount > 300 || (image.width * image.height <= 4 && matchCount >= 3),
    centerX: matchCount === 0 ? image.width / 2 : sumX / matchCount,
    centerY: matchCount === 0 ? image.height / 2 : sumY / matchCount,
    matchCount,
  };
}
