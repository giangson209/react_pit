/**
 *
 * @param a first value interpolate
 * @param b second value interpolate
 * @param t fraction (from 0 to 1) to use for the interpolation
 * @returns value between `a` and `b` bbased on t
 */
export function lerp(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}
