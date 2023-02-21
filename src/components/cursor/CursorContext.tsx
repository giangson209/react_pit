import { voidFunc } from "@utils/func";
import { browser } from "@utils/os";
import dynamic from "next/dynamic";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Cursor, { CursorRefType } from "./Cursor";

import CursorDefault, { CursorStyle, CursorVariant } from "./CursorDefault";

type Props = {
  children?: React.ReactNode;
};
type CursorDataSet = {
  cursorVariant: CursorVariant;
  cursorTheme: CursorStyle;
  cursorStretch: string;
  cursorMixblend: string;
  cursorText: string;
};

const CursorContext = createContext<{
  cursorVariant: CursorVariant;
  cursorStyle: CursorStyle;
  isCursorStretch: boolean;
  onMouseEnter: React.MouseEventHandler<HTMLElement>;
  onMouseLeave: React.MouseEventHandler<HTMLElement>;

  cursorRef: React.RefObject<CursorRefType> | null;
  mouseEventWithPrevious: {
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
  };
}>(null as any);

const CursorProvider = (props: Props) => {
  const cursorRef = useRef<CursorRefType>(null);
  const [isClient, setIsClient] = useState(false);

  const [cursorVariant, setCursorVariant] = useState(CursorVariant.Default);
  const [cursorStyle, setCursorStyle] = useState(CursorStyle.Dark);
  const [cursorStick, setCursorStick] = useState<{ x: number; y: number } | null>(null);
  const [cursorMixBlend, setCursorMixBlend] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isCursorStretch, setIsCursorStretch] = useState(false);

  const state = useRef<{
    cursorVariant: CursorVariant;
    cursorStyle: CursorStyle;
    cursorStick: { x: number; y: number } | null;
  }>({
    cursorVariant: CursorVariant.Default,
    cursorStyle: CursorStyle.Dark,
    cursorStick: null,
  });

  const { current: cachedCursor } = useRef({
    cursorVariant,
    cursorStyle,
    cursorStretch: isCursorStretch,
  });

  function setStick(target: EventTarget & HTMLElement) {
    if (!target.dataset.cursorStick) return;
    const bound = target.getBoundingClientRect();
    state.current.cursorStick = {
      y: bound.top + target.scrollHeight / 2,
      x: bound.left + target.scrollWidth / 2,
    };
    setCursorStick(state.current.cursorStick);
  }

  function removeStick() {
    setCursorStick((state.current.cursorStick = null));
  }

  const cache = useCallback(
    function (e: React.MouseEvent<HTMLElement, MouseEvent>) {
      const target = e.currentTarget;
      let {
        cursorVariant = CursorVariant.Default,
        cursorMixblend,
        cursorStretch,
        cursorTheme = CursorStyle.Dark,
        cursorText,
      } = target.dataset as CursorDataSet;

      cachedCursor.cursorStyle = cursorTheme;
      cachedCursor.cursorVariant = cursorVariant;
      cachedCursor.cursorStretch = cursorStretch ? true : false;
    },
    [cachedCursor]
  );

  const onMouseEnterRoot: React.MouseEventHandler<HTMLElement> = useCallback((e) => {
    const target = e.currentTarget;
    let {
      cursorVariant = CursorVariant.Default,
      cursorMixblend,
      cursorStretch,
      cursorTheme = CursorStyle.Dark,
      cursorText,
    } = target.dataset as CursorDataSet;

    setStick(target);
    setCursorVariant(cursorVariant);
    cursorText && setCursorText(cursorText);
    setIsCursorStretch(cursorStretch ? true : false);

    if (cursorMixblend) {
      setCursorMixBlend(true);
      setCursorStyle(CursorStyle.White);
    } else {
      setCursorMixBlend(false);
      setCursorStyle(cursorTheme);
    }
  }, []);

  const onMouseEnter: React.MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      onMouseEnterRoot(e);
      cache(e);
    },
    [cache, onMouseEnterRoot]
  );
  const onMouseLeave: React.MouseEventHandler<HTMLElement> = useCallback((e) => {
    setCursorVariant(CursorVariant.Default);
    const theme = e.currentTarget.dataset["out"] as CursorStyle;
    if (theme) setCursorStyle(theme);
    removeStick();
  }, []);

  const mouseEventWithPrevious = useMemo(
    () => ({
      onMouseEnter: onMouseEnterRoot,
      onMouseLeave() {
        removeStick();
        setCursorStyle(cachedCursor.cursorStyle);
        setCursorVariant(cachedCursor.cursorVariant);
        setCursorMixBlend(false);
        setIsCursorStretch(cachedCursor.cursorStretch);
      },
    }),
    [cachedCursor, onMouseEnterRoot]
  );

  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  return (
    <CursorContext.Provider
      value={{
        cursorStyle,
        cursorVariant,
        isCursorStretch,
        cursorRef,
        onMouseEnter: browser.mobile ? voidFunc : onMouseEnter,
        onMouseLeave: browser.mobile ? voidFunc : onMouseLeave,
        mouseEventWithPrevious: browser.mobile
          ? { onMouseEnter: voidFunc, onMouseLeave: voidFunc }
          : mouseEventWithPrevious,
      }}
    >
      {props.children}
      {!browser.mobile && (
        <Cursor
          ref={cursorRef}
          size={cursorVariant !== CursorVariant.Default ? 128 : undefined}
          stick={cursorStick}
          data-mode={cursorStyle}
          stretch={isCursorStretch}
          state={state.current}
          mixBend={cursorMixBlend}
        >
          {({ isActive }) => (
            <CursorDefault
              cursorStyle={cursorStyle}
              cursorVariant={cursorVariant}
              isActive={isActive}
              text={cursorText}
            />
          )}
        </Cursor>
      )}
    </CursorContext.Provider>
  );
};

export default CursorProvider;
export const useCursor = () => useContext(CursorContext);
