export enum WheelDirection {
  Up,
  Down,
}
export function getWheelScroll(e: WheelEvent & { wheelDeltaX: number; wheelDelta: number }) {
  const wheelDelta = e.wheelDelta || -e.deltaY || -e.detail;
  const delta = Math.max(-1, Math.min(1, wheelDelta));
  const direction = delta > 0 ? WheelDirection.Up : WheelDirection.Down;
  return { wheelDelta, delta, direction };
}
