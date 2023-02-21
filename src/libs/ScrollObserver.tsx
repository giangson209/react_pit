import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

const ScrollContext = createContext({ scrollY: 0 });
const ScrollObserver: React.FC<Props> = (props) => {
  const [scrollY, setScrollY] = useState(0);
  const handleScrollY = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);
  useEffect(() => {
    document.addEventListener("scroll", handleScrollY, { passive: true });
    return () => document.removeEventListener("scroll", handleScrollY);
  }, [handleScrollY]);
  return <ScrollContext.Provider value={{ scrollY }}>{props.children}</ScrollContext.Provider>;
};

export default ScrollObserver;
export const useScrollY = () => useContext(ScrollContext);
