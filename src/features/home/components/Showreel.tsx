import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInstance } from "src/hooks/useInstance";
import { useTicker } from "src/hooks/useTicker";

import gsap, { Expo } from "gsap";
import clsx from "clsx";
import Parallax from "@components/parallax/Parallax";
import { off, on } from "@utils/listener";

import styles from "styles/Home.module.scss";

type Props = {};

// Function for Mouse Move Scale Change
export function getScale(diffX: number, diffY: number, s = 1035, min = 0.05) {
  const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  return Math.min(distance / s, min);
}

// Function For Mouse Movement Angle in Degrees
export function getAngle(diffX: number, diffY: number) {
  return (Math.atan2(diffY, diffX) * 180) / Math.PI;
}

const Showreel = (props: Props) => {
  const [isLandscape, setIsLanscape] = useState(false);
  // const [ref, setRef] = useState<HTMLDivElement | null>();
  const ref = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGEllipseElement>(null);
  const [isIn, setIsIn] = useState(false);

  const prevRotation = useRef(0);

  const pos = useInstance(() => ({ x: 0.5, y: 0.5 }));
  const circle = useInstance(() => ({ cx: 0.5, cy: 0.5, rx: 0, ry: 0 }));
  const vel = useInstance(() => ({ x: 0, y: 0 }));
  const set = useInstance<Record<"x" | "y" | "r" | "sx" | "sy" | "width", Function>>();

  const setElippse = useInstance<Record<"cx" | "cy" | "rx" | "ry" | "rt", Function>>();

  // Start Animation loop
  const loop = useCallback(() => {
    const prev = prevRotation.current;

    // Calculate angle and scale based on velocity
    var rotation = getAngle(vel.x, vel.y); // Mouse Move Angle
    var scale = getScale(vel.x, vel.y); // Blob Squeeze Amount

    setElippse.cx(circle.cx);
    setElippse.cy(circle.cy);

    setElippse.rx(circle.rx * (1 + scale));
    setElippse.ry(circle.ry * (1 - scale));

    const oldAngle = prev % 360;
    const angle = oldAngle - rotation;

    // Difference angle less than 180 -> new angle is diffence of prev minus angle
    // otherwise it's total of previous angle add angle
    const newV =
      Math.abs(angle) < 180 ? prev - angle : prev + (prev > 0 ? 1 : -1) * (360 - Math.abs(angle));
    prevRotation.current = vel.x === vel.y && vel.x === 0 ? 0 : newV;

    setElippse.rt(prevRotation.current, circle.cx, circle.cy);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setElippse]);

  useEffect(() => {
    // elipse
    setElippse.cx = (x: number) => gsap.to(clipRef.current, { attr: { cx: x } });
    setElippse.cy = (y: number) => gsap.to(clipRef.current, { attr: { cy: y } });
    setElippse.rx = (x: number) => gsap.to(clipRef.current, { attr: { rx: x } });
    setElippse.ry = (y: number) => gsap.to(clipRef.current, { attr: { ry: y } });
    setElippse.rt = (r: number, cx: number, cy: number) =>
      gsap.to(clipRef.current, {
        attr: {
          transform: `rotate(${r} ${cx} ${cy})`,
        },
      });
  }, [set, setElippse]);

  // Mouse event
  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    const handleMouseLeave = () => {
      setIsIn(false);
    };
    function handleMouseMove(this: HTMLDivElement, ev: MouseEvent) {
      if (!viewportRef.current) return;

      const {
        width: viewportWidth,
        height: viewportHeight,
        top: t,
        left: l,
      } = viewportRef.current.getBoundingClientRect();

      const { top, left, width, height } = this.getBoundingClientRect();

      const x = ev.clientX - left; // position in element
      const y = ev.clientY - top; // position in element

      const cxPercentage = ((viewportWidth - width) / 2 + x) / viewportWidth;
      const cyPercentage = ((viewportHeight - height) / 2 + y) / viewportHeight;

      circle.cx = cxPercentage;
      circle.cy = cyPercentage;

      gsap.to(pos, {
        x: x - width / 2,
        y: y - height / 2,
        duration: 1.5,
        ease: Expo.easeOut,
        onUpdate: () => {
          vel.x = x - width / 2 - pos.x;
          vel.y = y - height / 2 - pos.y;
        },
      });

      requestAnimationFrame(loop);
    }

    const handleMouseEnter = () => {
      setIsIn(true);
      on(element, "mousemove", handleMouseMove);
      on(element, "mouseleave", handleMouseLeave);
    };
    const handleResize = () => {
      const { innerHeight, innerWidth } = window;
      setIsLanscape(innerHeight > innerWidth);
      const size =
        0.3 * (innerHeight > innerWidth ? innerWidth / innerHeight : innerHeight / innerWidth);

      gsap.to(circle, {
        rx: size,
        ry: size,
        duration: 0.5,
        ease: Expo.easeOut,
        onUpdate() {
          setElippse.rx(circle.rx);
          setElippse.ry(circle.ry);
        },
      });
    };

    // Listener
    handleResize();
    function bindEvents() {
      on(element, "mouseenter", handleMouseEnter);
      on(window, "resize", handleResize, { passive: true });
    }
    function unbindEvents() {
      off(element, "mouseenter", handleMouseEnter);
      off(window, "resize", handleResize, { passive: true });
      off(element, "mousemove", handleMouseMove);
    }
    bindEvents();
    return unbindEvents;
  }, [circle, loop, pos, setElippse, vel]);

  useTicker(loop, !isIn);

  return (
    <div className="absolute h-full w-full">
      <div className="h-full overflow-hidden flex items-center justify-center">
        <div
          className={clsx(
            isLandscape ? "h-full" : "w-full",
            "aspect-square relative bg-neutral-800"
          )}
          ref={ref}
        >
          <div className={styles.reelVideoContainer} ref={viewportRef}>
            <div className="relative w-full h-full overflow-hidden">
              <Parallax.Child
                start={["top", "-100%"]}
                end="top"
                as={"video"}
                src="/video/banner.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
              />
            </div>
          </div>
        </div>
      </div>
      <svg className="w-0 h-0">
        <defs>
          <clipPath id="clip-ellipse" clipPathUnits="objectBoundingBox">
            <ellipse ref={clipRef} fill="white" rx="0" ry="0" cx="0.5" cy="0.25"></ellipse>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default Showreel;
