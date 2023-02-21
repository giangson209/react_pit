import { useMemo } from "react";
import { forwardRef } from "react";
import { useObserverContext } from "src/features/home/context/IntersectionObserverProvider";
import useForwardRef from "src/hooks/useForwardRef";
import { useOnIntersectRef } from "src/hooks/useIntersectionObserver";
import { CustomElement, CustomElementProps, ReactTag } from "src/types/element.d";
import { Options } from "./Context";
import { useScrollSection } from "./useScrollSection";

type Props = { index: number } & Options;
export const ScrollFullPageElement: CustomElement<Props> = forwardRef<
  HTMLElement,
  CustomElementProps<ReactTag, Props>
>(function ScrollFullPageElement(props, ref) {
  const { as: asElement, index, getTopPosition, speed, speedOut, speedIn, offset, ...rest } = props;
  const Element = asElement || "div";
  const innerRef = useForwardRef(ref);
  const options = useMemo(
    () => ({
      getTopPosition,
      speedOut,
      speedIn,
      offset,
    }),
    [getTopPosition, speedIn, speedOut]
  );
  useScrollSection(innerRef, index, options);
  // const { observer } = useObserverContext();
  // useOnIntersectRef(innerRef, observer);

  return <Element {...rest} ref={innerRef} data-scroll-index={index} />;
});
