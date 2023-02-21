import React, { createContext, forwardRef, useContext, useEffect } from "react";
import useForwardRef from "src/hooks/useForwardRef";
import { CustomElement, CustomElementProps, ReactTag } from "src/types/element.d";

import anime from "animejs";

import { ScrollProgress } from "src/libs/ScrollProgress";
import { RangePosition } from "src/libs/scroll/utils";

const ParallaxContext = createContext<{ container: React.RefObject<HTMLElement> }>({
  container: { current: null },
});

interface ParallaxContainerProps {
  tag?: ReactTag;
}
function ParallaxContainer<T extends ReactTag>(
  props: CustomElementProps<ReactTag, ParallaxContainerProps>,
  ref: React.ForwardedRef<HTMLElement>
) {
  const { as: asE, tag = "section", ...rest } = props;
  const Element = asE || tag;

  const innerRef = useForwardRef(ref);
  return (
    <ParallaxContext.Provider value={{ container: innerRef }}>
      <Element {...rest} tag={tag} ref={innerRef} />
    </ParallaxContext.Provider>
  );
}

type ParallaxItemProps = {
  children?: React.ReactNode;
  tag?: ReactTag;
  /**
   * Make sure parent is relative, and height is half of children
   * or at least less than children height
   */
  reverse?: boolean;
  debug?: boolean;

  start?: RangePosition;
  end?: RangePosition;

  translateY?: Array<string | number | { value: number | string; duration: number }>;
};

function ParallaxItem(
  props: CustomElementProps<ReactTag, ParallaxItemProps>,
  ref: React.ForwardedRef<HTMLElement>
) {
  const {
    as: Element = "div",
    reverse,
    debug,
    start,
    end,
    translateY = ["-50%", "0%"],
    ...rest
  } = props;
  const { container } = useContext(ParallaxContext);

  const parallaxElement = useForwardRef(ref);
  // Parallax
  useEffect(() => {
    if (!parallaxElement.current || !container.current) return;

    const animetl = anime({
      targets: parallaxElement.current,
      duration: 1,
      translateY,
      easing: "linear",
      autoplay: false,
    });

    function handleScroll(progress: number) {
      if (progress === 0) animetl.currentTime !== 0 && animetl.seek(progress);
      else if (progress === 1) animetl.currentTime !== 1 && animetl.seek(progress);
      else animetl.seek(progress);
    }

    const progressScroll = new ScrollProgress(container.current, { start, end });
    progressScroll.on("scroll", handleScroll);
    progressScroll.init();
    return progressScroll.destroy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container]);

  return <Element {...rest} ref={parallaxElement}></Element>;
}

function Parallax() {}
const ParallaxContainerWithRef: CustomElement<ParallaxItemProps> = forwardRef<any, any>(
  ParallaxContainer
);
const ParallaxItemWithRef: CustomElement<ParallaxItemProps> = forwardRef<any, any>(ParallaxItem);

Parallax.Container = ParallaxContainerWithRef;
Parallax.Child = ParallaxItemWithRef;

export default Parallax;
