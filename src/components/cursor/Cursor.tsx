import gsap from "gsap";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useInstance } from "src/hooks/useInstance";
import { useTicker } from "src/hooks/useTicker";

import { on, off } from "@utils/listener";
import styles from "./Cursor.module.scss";
import { AnimateNode } from "src/libs/AnimateNode";
import clsx from "clsx";
import { CursorStyle, CursorVariant } from "./CursorDefault";
import { getAngle, getScale } from "src/features/home/components/Showreel";
import { useCursor } from "./CursorContext";

type CursorCommonProps = {
  cursorRef?: React.Ref<CursorRefType>;
  elRef?: React.Ref<HTMLDivElement>;

  size?: number;
  stretch?: boolean;
  mixBend?: boolean;
  cursorStyle?: CursorStyle;
  stick?: { x: number; y: number } | null;
  children?: React.ReactNode | React.ElementType<{ isActive?: boolean }>;

  state: {
    cursorVariant: CursorVariant;
    cursorStyle: CursorStyle;
    cursorStick: { x: number; y: number } | null;
  };
};
type CursorProps = CursorCommonProps &
  Omit<JSX.IntrinsicElements["div"], keyof CursorCommonProps | "ref">;

type EventListener = (ev: MouseEvent) => void;
type RemoveListener = () => void;
type AddEventListener = (type: keyof WindowEventMap, listener: EventListener) => RemoveListener;
type EventControler = Map<keyof WindowEventMap, Set<EventListener>> | null;

const speed = 0.13;
const DEFAULT_CURSOR_SIZE = 10;
export type CursorRefType = {
  addEventListener: AddEventListener;
  /**
   * Position mouse relative to screen
   */
  position: {
    x: number;
    y: number;
  };
};

const Cursor = forwardRef<CursorRefType, CursorProps>(function CursorR(props, ref) {
  const {
    children: Children,
    size = DEFAULT_CURSOR_SIZE,
    cursorStyle,
    stretch,
    stick,
    state,
    mixBend,
    ...rest
  } = props;
  const { cursorVariant } = useCursor();
  const pos = useInstance(() => ({ x: 0, y: 0 }));
  const mouse = useInstance(() => ({ x: pos.x, y: pos.y }));
  const deltaStretch = useInstance(() => ({ x: pos.x, y: pos.y }));
  const set = useInstance<Record<"x" | "y" | "r" | "rt" | "sx" | "sy" | "width", Function>>();

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorWrapper = useRef<HTMLDivElement>(null);
  const cursorContainer = useRef<HTMLDivElement>(null);

  const eventControlers = useRef<EventControler>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const _ref = useRef<CursorRefType>();

  if (!_ref.current) {
    _ref.current = {
      addEventListener: (type, fn) => {
        eventControlers.current ||= new Map([[type, new Set<EventListener>()]]);
        const controler = eventControlers.current.get(type)!;
        controler.add(fn);
        return () => {
          controler?.delete(fn);
        };
      },
      position: pos,
    };
  }
  useImperativeHandle(props.elRef, () => cursorWrapper as any, [cursorWrapper]);
  useImperativeHandle(ref, () => _ref.current as any, []);

  const triggerEvent = (type: keyof WindowEventMap, e: MouseEvent) => {
    if (!eventControlers.current) return;
    eventControlers.current?.get(type)?.forEach((fn) => fn(e));
  };

  const loop = useCallback(() => {
    // adjust speed for higher refresh monitors
    const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());

    let dtX = mouse.x - pos.x;
    let dtY = mouse.y - pos.y;

    dtX = Math.abs(dtX) < 0.001 ? 0 : dtX;
    dtY = Math.abs(dtY) < 0.001 ? 0 : dtY;

    pos.x += dtX * dt;
    pos.y += dtY * dt;

    // Set GSAP quick setter Values on Loop Function
    set.x(pos.x);
    set.y(pos.y);

    if (stretch) {
      deltaStretch.x = dtX;
      deltaStretch.y = dtY;
    } else if (deltaStretch.x !== 0 && deltaStretch.y !== 0) {
      dtX = deltaStretch.x * dt;
      dtY = deltaStretch.y * dt;
      dtX = Math.abs(dtX) < 0.001 ? 0 : dtX;
      dtY = Math.abs(dtY) < 0.001 ? 0 : dtY;

      deltaStretch.x -= dtX;
      deltaStretch.y -= dtY;
    }

    const scale = getScale(deltaStretch.x, deltaStretch.y, 735, 0.25);
    const rotation = getAngle(deltaStretch.x, deltaStretch.y);
    set.r(rotation);
    set.sx(1 + scale);
    set.sy(1 - scale);
  }, [set, pos, mouse, stretch, deltaStretch]);

  /**
   * Set position
   */
  useLayoutEffect(() => {
    if (!cursorWrapper.current || !cursorContainer.current) return;
    set.x = gsap.quickSetter(cursorWrapper.current, "x", "px");
    set.y = gsap.quickSetter(cursorWrapper.current, "y", "px");

    set.r = gsap.quickSetter(cursorContainer.current, "rotate", "deg");
    set.sx = gsap.quickSetter(cursorContainer.current, "scaleX");
    set.sy = gsap.quickSetter(cursorContainer.current, "scaleY");
  }, [set]);
  /**
   *  Cursor events
   */
  useLayoutEffect(() => {
    if (!cursorWrapper) return;
    const handleMouseDown = async (e: MouseEvent) => {
      setIsMouseDown(true);
      triggerEvent("mousedown", e);
    };

    const handleMouseUp = async (e: MouseEvent) => {
      try {
        setIsMouseDown(false);
        triggerEvent("mouseup", e);
      } catch (error) {}
    };

    function handleClick(e: MouseEvent) {
      triggerEvent("click", e);
    }
    function handleMouseEnter(e: MouseEvent) {
      setIsVisible(true);
    }
    function handleMouseLeave(e: MouseEvent) {
      if (!e.relatedTarget) setIsVisible(false);
    }
    function mouseMove(ev: MouseEvent) {
      setIsVisible(true);

      mouse.x = state.cursorStick
        ? state.cursorStick.x - (state.cursorStick.x - ev.x) * 0.15
        : ev.x;
      mouse.y = state.cursorStick
        ? state.cursorStick.y - (state.cursorStick.y - ev.y) * 0.15
        : ev.y;
    }

    on(window, "click", handleClick);
    on(window, "mousedown", handleMouseDown);
    on(window, "mouseup", handleMouseUp);
    on(window, "mouseout", handleMouseLeave);
    on(window, "mousemove", mouseMove);
    on(document.body, "mouseenter", handleMouseEnter);

    return () => {
      off(window, "click", handleClick);
      off(window, "mousedown", handleMouseDown);
      off(window, "mouseup", handleMouseUp);
      off(window, "mouseout", handleMouseLeave);
      off(window, "mousemove", mouseMove);
      off(document.body, "mouseenter", handleMouseEnter);
    };
  }, [cursorWrapper, mouse, state]);

  useTicker(loop, !cursorWrapper.current || !cursorContainer.current);

  /**
   * Animation when change variant
   */
  useEffect(() => {
    if (!containerRef.current) return;
    const animateNode = new AnimateNode(containerRef.current);
    return () => {
      animateNode.disconect();
    };
  }, []);

  return createPortal(
    <div
      ref={cursorWrapper}
      className={styles.cursor}
      data-mix-blend={mixBend ? true : undefined}
      {...rest}
    >
      <div className={clsx(styles.cursorContainer, isVisible && styles.visible)}>
        {/* Description */}
        <span className="sr-only">Cursor</span>
        {/* Color */}

        <div
          data-variant={cursorVariant}
          className={clsx(styles.cursorBackgroundContainer, isMouseDown && styles.active)}
        >
          <div
            ref={cursorContainer}
            className={clsx(styles.cursorBackground, cursorStyle && styles[cursorStyle])}
            style={{ width: size, height: size }}
          />
        </div>
        {/* Text */}
        <div className={styles.cursorChildren} ref={containerRef}>
          {typeof Children === "function" ? <Children isActive={isMouseDown} /> : Children}
        </div>
      </div>
    </div>,
    document.body
  );
});
const CursorClient = forwardRef<CursorRefType, CursorProps>(function CursorR(props, ref) {
  const [isClient, setIsClient] = useState(() => false);
  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  return isClient ? <Cursor ref={ref} {...props} /> : null;
});

export default CursorClient;
