import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";

export function useTicker(callback: any, paused?: boolean, fps?: number) {
  useEffect(() => {
    if (!paused && callback) {
      gsap.ticker.add(callback);
      fps && gsap.ticker.fps(fps);
    }
    return () => {
      gsap.ticker.remove(callback);
    };
  }, [callback, paused, fps]);
}
