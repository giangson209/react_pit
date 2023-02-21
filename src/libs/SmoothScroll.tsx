import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

const useSmoothScroll = () => {
  // useEffect(() => {
  //   const lenis = new Lenis({
  //     duration: 1.2,
  //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  //     direction: "vertical", // vertical, horizontal
  //     gestureDirection: "vertical", // vertical, horizontal, both
  //     smooth: true,
  //     mouseMultiplier: 1,
  //     smoothTouch: false,
  //     touchMultiplier: 2,
  //     infinite: false,
  //   });
  //   //get scroll value

  //   function raf(time: DOMHighResTimeStamp) {
  //     lenis.raf(time);
  //     requestAnimationFrame(raf);
  //   }

  //   requestAnimationFrame(raf);
  //   return () => {
  //     lenis.destroy();
  //   };
  // }, []);
};

export default useSmoothScroll;
