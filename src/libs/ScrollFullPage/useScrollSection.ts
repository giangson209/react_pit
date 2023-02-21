import { RefObject, useEffect } from "react";
import { Options } from "./Context";
import { useScrollContext } from "./useScrollContext";

export const useScrollSection = <T extends HTMLElement>(
  ref: RefObject<T>,
  index: number,
  options?: Options
) => {
  const scrollContext = useScrollContext();
  useEffect(() => {
    if (!ref.current) return;
    scrollContext.register(ref.current, index, options);
    return () => scrollContext.unregister(index);
  }, [index, options, ref, scrollContext]);
};
