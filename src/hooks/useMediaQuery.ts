import { useCallback, useEffect, useState } from "react";
export enum MediaScreen {
  SmallPortrait,
  XXXLarge,
  XXLarge,
  XLarge,
  Large,
  Medium,
  SmallLandscape,
}
const screenSize = {
  h: "320px",
  g: "568px",
  e: "480px",
  d: "480px",
  b: "768px",
  j: "1024px",
  l: "1366px",
  n: "1920px",
  f: "(min-width: 568px) and (max-height: 480px)",
  c: "(min-width: 768px) and (min-height: calc(480px + 1px))",
  a: "(min-width: 1024px) and (min-height: calc(480px + 1px))",
  i: "(min-width: 1440px) and (min-height: calc(480px + 1px))",
  k: "(min-width: 1920px) and (min-height: calc(480px + 1px))",
  m: "(min-width: 2560px) and (min-height: calc(480px + 1px))",
};
const matchesScreen = () =>
  "undefined" === typeof window || "undefined" === typeof window.matchMedia
    ? MediaScreen.SmallPortrait
    : window.matchMedia(screenSize.m).matches
    ? MediaScreen.XXXLarge
    : window.matchMedia(screenSize.k).matches
    ? MediaScreen.XXLarge
    : window.matchMedia(screenSize.i).matches
    ? MediaScreen.XLarge
    : window.matchMedia(screenSize.a).matches
    ? MediaScreen.Large
    : window.matchMedia(screenSize.c).matches
    ? MediaScreen.Medium
    : window.matchMedia(screenSize.f).matches
    ? MediaScreen.SmallLandscape
    : MediaScreen.SmallPortrait;

function useMediaQuery(): MediaScreen {
  const [state, setState] = useState(() => matchesScreen());
  const n = useCallback(() => {
    setState(matchesScreen);
  }, []);

  useEffect(() => {
    const mediaQuerySmallLandscape = window.matchMedia(screenSize.f),
      mediaQueryMedium = window.matchMedia(screenSize.c),
      mediaQueryLarge = window.matchMedia(screenSize.a),
      mediaQueryXLarge = window.matchMedia(screenSize.i),
      mediaQueryXXLarge = window.matchMedia(screenSize.k),
      mediaQueryXXXLarge = window.matchMedia(screenSize.m);
    if (mediaQuerySmallLandscape.addEventListener)
      return (
        mediaQuerySmallLandscape.addEventListener("change", n),
        mediaQueryMedium.addEventListener("change", n),
        mediaQueryLarge.addEventListener("change", n),
        mediaQueryXLarge.addEventListener("change", n),
        mediaQueryXXLarge.addEventListener("change", n),
        mediaQueryXXXLarge.addEventListener("change", n),
        () => {
          mediaQuerySmallLandscape.removeEventListener &&
            (mediaQuerySmallLandscape.removeEventListener("change", n),
            mediaQueryMedium.removeEventListener("change", n),
            mediaQueryLarge.removeEventListener("change", n),
            mediaQueryXLarge.removeEventListener("change", n),
            mediaQueryXXLarge.removeEventListener("change", n),
            mediaQueryXXXLarge.removeEventListener("change", n));
        }
      );
  }, [n]);

  return state;
}

export default useMediaQuery;
