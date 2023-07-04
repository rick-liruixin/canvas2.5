interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Check if two RGB colors are similar within a given tolerance.
 * @param rgb1 - The first RGB color to compare.
 * @param rgb2 - The second RGB color to compare.
 * @param tolerance - The tolerance value to determine similarity.
 * @returns True if the colors are similar within the tolerance, false otherwise.
 */
export const areSimilarRgb = (
  rgb1: RGBColor,
  rgb2: RGBColor,
  tolerance = 60
): boolean => {
  const rDiff = Math.abs(rgb1.r - rgb2.r);
  const gDiff = Math.abs(rgb1.g - rgb2.g);
  const bDiff = Math.abs(rgb1.b - rgb2.b);
  return rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance;
};

/**
 * Checks if two HSL colors are similar based on a threshold value.
 * @param color1 - The first HSL color represented as an array of numbers [h, s, l].
 * @param color2 - The second HSL color represented as an array of numbers [h, s, l].
 * @param threshold - The maximum difference allowed for each HSL component. Defaults to 60.
 * @returns True if the colors are similar, false otherwise.
 */
export const areSimilarHsl = (
  color1: Array<number>,
  color2: Array<number>,
  threshold = 60
): boolean => {
  const [h1, s1, l1] = color1;
  const [h2, s2, l2] = color2;
  const deltaH = Math.abs(h1 - h2);
  const deltaS = Math.abs(s1 - s2);
  const deltaL = Math.abs(l1 - l2);

  return deltaH <= threshold && deltaS <= threshold && deltaL <= threshold;
};

/**
 * Convert RGB color to HSL color.
 * @param r - Red component of the RGB color (0-255).
 * @param g - Green component of the RGB color (0-255).
 * @param b - Blue component of the RGB color (0-255).
 * @returns An array with the corresponding HSL values (H: 0-360, S: 0-100, L: 0-100).
 */
export const rgbToHsl = ({ r, g, b }: RGBColor): [number, number, number] => {
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;

  const maxValue = Math.max(normalizedR, normalizedG, normalizedB);
  const minValue = Math.min(normalizedR, normalizedG, normalizedB);

  let H, S;

  const L = (maxValue + minValue) / 2;

  if (maxValue === minValue) {
    S = 0;
  } else if (L <= 0.5) {
    S = (maxValue - minValue) / (maxValue + minValue);
  } else {
    S = (maxValue - minValue) / (2 - maxValue - minValue);
  }

  if (maxValue === minValue) {
    H = 0;
  } else if (maxValue === normalizedR) {
    H = (normalizedG - normalizedB) / (maxValue - minValue);
  } else if (maxValue === normalizedG) {
    H = 2 + (normalizedB - normalizedR) / (maxValue - minValue);
  } else {
    H = 4 + (normalizedR - normalizedG) / (maxValue - minValue);
  }

  H = (H / 6) % 1;

  return [H * 360, S * 100, L * 100];
};

/**
 * Calculate the pixel ratio of the device.
 * @param {any} context - The rendering context.
 * @returns {number} - The pixel ratio.
 */
export const getPixelRatio = (context: any) => {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
};
