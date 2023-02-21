import clsx from "clsx";
import gsap from "gsap";
import styles from "./Magnetic.module.scss";

import React, { MouseEventHandler, useRef } from "react";
import { CustomElementProps, ReactTag } from "src/types/element.d";
import anime from "animejs";
import { useGui } from "src/libs/debug/hooks";
import { browser } from "@utils/os";

type Props = {
  speed?: number;
  scale?: number;
  tollerance?: number;
  typeTollerance?: "percent" | "fixed";
  reverseInner?: boolean;
  children: React.ReactNode;

  onMouseLeave?: (event: React.MouseEvent<Element, MouseEvent>, scale: number) => void;
};

type State = {
  isTouching: boolean;
  isMouseEnter: boolean;
};

function Magnetic<T extends ReactTag = "div">(props: CustomElementProps<T, Props>) {
  const {
    children,
    scale = 1,
    speed,
    className,
    tollerance = 0,
    typeTollerance = "fixed",
    reverseInner,
    onMouseMove,
    onMouseLeave,
    onMouseEnter,
    ...rest
  } = props;

  const Element: ReactTag = props.as || "div";
  const $root = useRef<HTMLElement>(null);
  const $item = useRef<HTMLSpanElement>(null);
  const $boundary = useRef<HTMLSpanElement>(null);

  const rootBound = useRef<DOMRect>();
  const state = useRef<State>({ isTouching: false, isMouseEnter: false }).current;

  function setState(s: Partial<State>) {
    Object.assign(state, s);
  }

  const amplitude = useRef<{ x: number; y: number }>({ x: 0, y: 0 }).current;

  function move(x: number, y: number, speed?: number, ease?: string) {
    gsap.to($item.current, {
      y,
      x,
      force3D: true,
      overwrite: true,
      ease,
      duration: speed,
    });
  }
  function moveInner(x: number, y: number, speed?: number, ease?: string) {
    gsap.to($item.current, {
      y,
      x,
      force3D: true,
      overwrite: true,
      ease,
      duration: speed,
    });
  }

  function setScaleBoundary(scale: number) {
    gsap.set($boundary.current, { scale });
  }

  const handleMouseEnter = (e: MouseEvent | TouchEvent) => {
    setState({ isMouseEnter: true });

    rootBound.current = $root.current!.getBoundingClientRect();

    amplitude.x =
      typeTollerance === "fixed" ? tollerance * 2 : (rootBound.current.width * tollerance) / 100;
    amplitude.y =
      typeTollerance === "fixed" ? tollerance * 2 : (rootBound.current.height * tollerance) / 100;

    scale > 1 && setScaleBoundary(scale);
    onMouseEnter?.(e);
  };
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!state.isMouseEnter) return;
    const root = $root.current!;
    if (!rootBound.current) return;
    const { width, height, top, left } = rootBound.current!;

    // cursor position in screen
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const y = "touches" in e ? e.touches[0].clientY : e.clientY;

    // Max range

    const newX = gsap.utils.mapRange(
      0,
      width * scale,
      -amplitude.x,
      amplitude.x,
      x - rootBound.current!.x + (width * scale - width) / 2
    );
    const newY = gsap.utils.mapRange(
      0,
      height * scale,
      -amplitude.y,
      amplitude.y,
      y - rootBound.current!.y + (width * scale - width) / 2
    );

    // const newX = 0;
    move(newX, newY, 0.5);
    reverseInner && moveInner(-newX / 2, -newY / 2, 0.5);
  };
  const handleMouseLeave: MouseEventHandler = function (e) {
    if (!state.isMouseEnter) return;
    gsap.killTweensOf($item.current);

    move(0, 0, 1.2, "elastic.out(1.1, .4)");
    moveInner(0, 0, 1.2, "elastic.out(1.1, .4)");
    setScaleBoundary(1);
    rootBound.current = undefined;
    onMouseLeave?.(e, scale);
  };

  const [firstChild, ...othersChild] = Array.isArray(children) ? children : [children];

  const childrenElement = React.Children.only(firstChild) as JSX.Element;
  const childrenWithProps = React.cloneElement(childrenElement, { ref: $item });

  function handleTouchStart() {}
  function handleTouchLeave(e: MouseEvent) {
    e.preventDefault();
  }

  return (
    <Element
      {...rest}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      //
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchLeave}
      // onTouchStart={handleMouseEnter}
      // onTouchMove={handleMouseMove}
      // onTouchEnd={handleMouseLeave}
      className={clsx(styles.container, className)}
      ref={$root}
    >
      <span className={styles.boundary} ref={$boundary} />
      {childrenWithProps}
      {othersChild}
    </Element>
  );
}

export default Magnetic;
