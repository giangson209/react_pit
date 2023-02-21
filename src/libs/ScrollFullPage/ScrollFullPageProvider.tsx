import { debounce } from "@utils/debouce";
import { off, on } from "@utils/listener";
import React, { useCallback, useEffect, useRef } from "react";
import { CustomElement } from "src/types/element.d";
import { easeInOutCubic } from "src/utils/transition";
import { getWheelScroll, WheelDirection } from "src/utils/wheel";
// import { innerGUI } from "../debug/gui";
// import { useGui } from "../debug/hooks";

import { Options, RegisterScroll, ScrollFullContext } from "./Context";

// const gui = innerGUI.addObject("FullPageDebug");
// const object: Record<string | number, any> = innerGUI.getObject("FullPageDebug");

type Props = {
  children?: React.ReactNode;
  scrollingSpeed?: number;
};

type State = {
  activeAnimation: boolean;
  wheelDirection?: WheelDirection;
  canScroll?: boolean;
  isScrollAllowed?: boolean;
  isScrolling: boolean;
};
const ScrollFullPageProvider: CustomElement<Props> = (props) => {
  const { as, scrollingSpeed = 700, ...rest } = props;
  const Element = as || "div";

  // const { gui, object } = useGui<Record<"nextTop" | "prevBottom" | "y", number>>("Scroll");

  const controllerRef = useRef<any>();
  const state = useRef<State>({
    activeAnimation: false,
    canScroll: true,
    isScrollAllowed: false,
    isScrolling: false,
  }).current;

  const disabled = useRef<boolean>(true);

  const isScrollAllowed = useRef<Record<"up" | "down" | "left" | "right", boolean>>({
    up: true,
    down: true,
    left: true,
    right: true,
  });

  const scrollings = useRef<Array<number>>([]);
  const prevTime = useRef<number>(Date.now());

  const currentAnimation = useRef<number>();

  const scrollRef = useRef<{
    sections: Map<number, { element: HTMLElement; options?: Options; top: number; bottom: number }>;
    activeSection: number;
  }>({
    sections: new Map(),
    activeSection: 0,
  }).current;

  const register: RegisterScroll = (element, position, options) => {
    if (!controllerRef.current) controllerRef.current = "";
    const idx = typeof position === "number" ? position : scrollRef.sections.size + 1;
    if (scrollRef.sections.has(idx))
      throw new Error(`[ScrollFullPageProvider] - Duplicate index element (${idx})`);

    const { top, bottom } = element.getBoundingClientRect();
    const offset = options?.offset || [0, 0];

    scrollRef.sections.set(idx, {
      element,
      options,
      top: top + scrollY + offset[0],
      bottom: bottom + scrollY - offset[1],
    });
    return () => unregister(idx);
  };

  function unregister(idx: number) {
    scrollRef.sections.delete(idx);
  }

  function getIsScrollAllowed() {
    return isScrollAllowed.current;
  }
  function setAllowScroll(...keys: Array<"up" | "down" | "left" | "right">) {
    keys.forEach((k) => {
      isScrollAllowed.current[k] = true;
    });
  }
  function setNotAllowScroll(...keys: Array<"up" | "down" | "left" | "right">) {
    keys.forEach((k) => {
      isScrollAllowed.current[k] = false;
    });
  }

  function setState(props: Partial<State>) {
    Object.assign(state, props);
  }
  function setScrolling(element: Window | HTMLElement, val: number) {
    element.scrollTo(0, val);
  }
  function scrollTo(to: number, duration: number, callback: AnyToVoidFunction = () => void 0) {
    let start = window.scrollY;
    const change = to - start;
    let startTime: number;
    const wasAnimationActive = state.activeAnimation;
    if (wasAnimationActive) return;
    setState({ activeAnimation: true });

    if (currentAnimation.current) window.cancelAnimationFrame(currentAnimation.current);

    function g_animateScroll(timestamp: number) {
      if (!startTime) {
        startTime = timestamp;
        start = scrollY;
      }

      const currentTime = Math.floor(timestamp - startTime);
      if (state.activeAnimation) {
        //in order to stope it from other function whenever we want
        let val = to;

        if (duration) {
          // @ts-ignore
          // val = win.fp_easings[getOptions().easing](currentTime, start, change, duration);

          // const t =easeIn()
          // const p = currentTime / duration;
          // val = lerp(start, change, p);
          val = easeInOutCubic(currentTime, start, to, duration);
        }

        if (currentTime <= duration) {
          setScrolling(window, val);
        }
        if (currentTime < duration) {
          currentAnimation.current = window.requestAnimationFrame(g_animateScroll);
        } else {
          callback();
          setState({
            activeAnimation: false,
          });
          // isCallbackFired = true;
        }
      } else if (!wasAnimationActive) {
        callback();
        setState({ activeAnimation: false });
      }
    }

    currentAnimation.current = window.requestAnimationFrame(g_animateScroll);
  }

  function getNextIndex(currentIndex: number, direction: WheelDirection): number | undefined {
    const idx = direction === WheelDirection.Up ? currentIndex - 1 : currentIndex + 1;
    if (Math.abs(currentIndex) > 20) return undefined;
    if (scrollRef.sections.has(idx)) return idx;
    return getNextIndex(idx, direction);
  }
  function scrollPage(direction: WheelDirection) {
    const sectionIdx = getNextIndex(scrollRef.activeSection, direction);
    if (typeof sectionIdx !== "number") return;
    setState({ canScroll: false, isScrolling: true });
    const { element: section, options: nextOptions = {} } = scrollRef.sections.get(sectionIdx)!;
    const { options: previousOptions = {} } = scrollRef.sections.get(scrollRef.activeSection)!;

    const top = nextOptions.getTopPosition?.(section) || getCoords(section).top;
    const speed =
      nextOptions[`speed${direction === WheelDirection.Down ? "In" : "Out"}`] ||
      previousOptions[`speed${direction === WheelDirection.Down ? "Out" : "In"}`] ||
      scrollingSpeed;

    scrollTo(top, speed, () => {
      afterSectionLoad();
      scrollRef.activeSection = sectionIdx;
    });
  }

  function afterSectionLoad() {
    setState({ canScroll: true, isScrolling: false });
  }
  function getCoords(elem: HTMLElement) {
    const box = elem.getBoundingClientRect();
    const de = document.documentElement;

    const scrollTop = window.pageYOffset || de.scrollTop;
    const scrollLeft = window.pageXOffset || de.scrollLeft;

    const clientTop = de.clientTop || 0;
    const clientLeft = de.clientLeft || 0;

    const top = box.top + scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  }

  function moveSectionUp() {
    scrollPage(WheelDirection.Up);
  }
  function moveSectionDown() {
    scrollPage(WheelDirection.Down);
  }

  function getAverage(elements: number[], number: number) {
    var sum = 0; //taking `number` elements from the end to make the average, if there are not enought, 1

    var lastElements = elements.slice(Math.max(elements.length - number, 1));

    for (var i = 0; i < lastElements.length; i++) {
      sum = sum + lastElements[i];
    }

    return Math.ceil(sum / number);
  }

  function checkScrolls(value: number, curTime: number) {
    const _scrollings = scrollings.current;
    if (_scrollings.length > 149) {
      _scrollings.shift();
    } //keeping record of the previous scrollings
    _scrollings.push(Math.abs(value)); //preventing to scroll the site on mouse wheel when scrollbar is present

    var timeDiff = curTime - prevTime.current;
    prevTime.current = curTime; //haven't they scrolled in a while?
    //(enough to be consider a different scrolling action to scroll another section)

    if (timeDiff > 200) {
      //emptying the array, we dont care about old scrollings for our averages
      scrollings.current = [];
    }
  }

  /**
   * Desktop only
   * Handle mouse wheel
   */
  const mouseWheelHandler = useCallback(
    function mouseWheelHandler(e: WheelEvent & { wheelDeltaX: number; wheelDelta: number }) {
      if (state.isScrolling) return e.preventDefault();
      const y = scrollY;
      const vh = innerHeight;
      const { wheelDelta, delta, direction } = getWheelScroll(e);

      const sectionIdx = getNextIndex(scrollRef.activeSection, direction);
      if (typeof sectionIdx !== "number") return;
      const section = scrollRef.sections.get(sectionIdx)!;
      if (direction === WheelDirection.Down) {
        if (y + vh < section.top) return;
      } else if (direction === WheelDirection.Up) {
        if (section.bottom < y) return;
      }
      const curTime = new Date().getTime();
      e.preventDefault();
      setState({ wheelDirection: direction });

      const isScrollingVertically =
        Math.abs(e.wheelDeltaX || 0) < Math.abs(e.wheelDelta || 0) ||
        Math.abs(e.deltaX || 0) < Math.abs(e.deltaY || 0);

      if (!getIsScrollAllowed().up && !getIsScrollAllowed().down) return false;
      checkScrolls(wheelDelta, curTime);

      if (state.canScroll && isScrollingVertically) {
        const averageEnd = getAverage(scrollings.current, 10);
        const averageMiddle = getAverage(scrollings.current, 70);
        const isAccelerating = averageEnd >= averageMiddle;

        if (isAccelerating) {
          delta < 0 ? moveSectionDown() : moveSectionUp();
        }
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Key down handler
   */
  const keydownHandler = useCallback(function keydownHandler(ev: KeyboardEvent) {
    if (disabled.current) return false;

    var key = ev.key;
    var isPressingHorizontalArrows = ["ArrowUp", "ArrowDown"].indexOf(key) > -1;
    if (isPressingHorizontalArrows) ev.preventDefault();
  }, []);

  useEffect(() => {
    function getCurrentActiveSection() {
      let lowestTop = 0;
      const vh = innerHeight;
      const y = scrollY;
      let idx!: number;
      Array.from(scrollRef.sections).forEach(([index, { element }]) => {
        const { top, bottom } = element.getBoundingClientRect();
        if (top > 0 && top < innerHeight / 2 && top <= lowestTop) {
          lowestTop = top;
          scrollRef.activeSection = index;
          idx = index;
        }
      });
      if (typeof idx !== "undefined") disabled.current = false;
      else disabled.current = true;
    }
    function scrollHandler(e: Event) {
      // DebuggerFrontEnd.events.add({ scroll: "yes" });
    }
    const resizeHandler = debounce(
      function (ev: UIEvent) {
        scrollRef.sections.forEach((section) => {
          const { top, bottom } = section.element.getBoundingClientRect();
          const offset = section.options?.offset || [0, 0];
          section.top = top + scrollY + offset[0];
          section.bottom = bottom + scrollY - offset[1];
        });
      },
      10,
      true,
      true
    );
    getCurrentActiveSection();
    on(window, "wheel", mouseWheelHandler as any, { passive: false }), // passive is important
      on(window, "scroll", scrollHandler, { passive: false }),
      on(window, "keydown", keydownHandler),
      on(window, "resize", resizeHandler);
    return () => {
      off(window, "wheel", mouseWheelHandler as any, { passive: false }), // passive is important
        off(window, "scroll", scrollHandler, { passive: false }),
        off(window, "keydown", keydownHandler),
        on(window, "resize", resizeHandler);
    };
  }, [mouseWheelHandler, keydownHandler, scrollRef.sections, scrollRef]);

  return (
    <ScrollFullContext.Provider
      value={{
        register,
        unregister,
        activeFullPage: () => (disabled.current = false),
        disableFullPage: () => {
          disabled.current = true;
        },
      }}
    >
      <Element className="h-full relative" {...rest}>
        {props.children}
      </Element>
    </ScrollFullContext.Provider>
  );
};

if (typeof window !== "undefined") {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
    window.scrollTo({ top: 0 });
  } else {
    window.scrollTo({ top: 0 });
  }
}
export default ScrollFullPageProvider;
