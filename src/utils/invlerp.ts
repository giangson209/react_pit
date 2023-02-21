import { clamp } from "./clamp";

export function invlerp(min: number, max: number, value: number) {
  return clamp((value - min) / (max - min), 0, 1);
}
