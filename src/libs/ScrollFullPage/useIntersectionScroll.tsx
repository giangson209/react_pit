import { off, on } from "@utils/listener";
import React, { useCallback } from "react";
import { ObserveFn, useOnIntersectRef } from "src/hooks/useIntersectionObserver";
import { getWheelScroll, WheelDirection } from "src/utils/wheel";
import { useScrollContext } from "../ScrollFullPage";

type Options = {
  direction: WheelDirection;
};

/**
 * attach wheel and keydown event when element interact
 *
 * fullPageScroll will be active or disable depending
 * on the direction of the scroll relaitve to the value of `options.direction`
 *
 * OR the arrow pressed is up to down
 */
const useActiveWheelDirection = (
  ref: React.RefObject<HTMLElement>,
  observer: ObserveFn,
  options: Options
) => {
  const { activeFullPage, disableFullPage } = useScrollContext();

  const handleWheelScroll = useCallback(
    function handleWheelScroll(e: WheelEvent & { wheelDeltaX: number; wheelDelta: number }) {
      const { delta, direction, wheelDelta } = getWheelScroll(e as any);
      const isScrollingVertically =
        Math.abs(e.wheelDeltaX || 0) < Math.abs(e.wheelDelta || 0) ||
        Math.abs(e.deltaX || 0) < Math.abs(e.deltaY || 0);

      if (!isScrollingVertically) return;
      if (direction === options.direction) {
        activeFullPage();
        e.preventDefault();
      } else disableFullPage();
    },
    [activeFullPage, disableFullPage, options.direction]
  );
  const handleKeyDown = useCallback(
    function handleKeyDown(e: KeyboardEvent) {
      const key = options.direction ? "ArrowUp" : "ArrowDown";
      if (e.key === key) e.preventDefault(), activeFullPage();
      else disableFullPage();
    },
    [activeFullPage, disableFullPage, options.direction]
  );
  function bindListeners() {
    on(window, "wheel", handleWheelScroll as any);
    on(window, "keydown", handleKeyDown);
  }
  function removeListeners() {
    off(window, "wheel", handleWheelScroll as any);
    off(window, "keydown", handleKeyDown);
  }

  useOnIntersectRef(ref, observer, (entry) => {
    const isInteraction = entry.isIntersecting;
    const currentY = entry.boundingClientRect.y;
    if (isInteraction) bindListeners();
    else removeListeners();
  });
};

export default useActiveWheelDirection;
