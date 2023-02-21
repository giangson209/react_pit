export function easeOut(
  currentTime: number,
  startValue: number,
  endValue: number,
  totalTime: number
) {
  return (
    startValue +
    (endValue - startValue) *
      ((currentTime = currentTime / totalTime - 1) * currentTime * currentTime + 1)
  );
}

export function easeIn(progress: number, startValue: number, endValue: number) {
  return startValue + (endValue - startValue) * Math.pow(progress, 3);
}

export function easeInOutCubic(
  currentTime: number,
  start: number,
  endValue: number,
  totalTime: number
) {
  if ((currentTime /= totalTime / 2) < 1)
    return ((endValue - start) / 2) * currentTime * currentTime * currentTime + start;
  return ((endValue - start) / 2) * ((currentTime -= 2) * currentTime * currentTime + 2) + start;
}
