import { CursorStyle, CursorVariant } from "@components/cursor/CursorDefault";
import ElementWithCursor from "@components/cursor/ElementWithCursor";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import useThrottled from "src/hooks/useThrottle";
import MainHeader from "src/layouts/main/MainHeader";
import { randomUUID } from "src/utils/uuid";

import styles from "styles/Home.module.scss";
import HeroBanner from "./HeroBanner";

type Props = {};
type HeroListState = { id: number | string; position?: { x: number; y: number }; isDark?: boolean };

const HERO_SECTION_TRANSITION_DURATION = 1000; // ms

const RenderHeroSection = (
  props: {
    isMain?: boolean;
    x?: number;
    y?: number;
    isDark?: boolean;
    onMouseDown?: any;
    onMouseEnterImage?: any;
    onMouseLeaveImage?: any;
    elementRef?: React.Ref<HTMLDivElement>;
  } & JSX.IntrinsicElements["div"]
) => {
  const { isMain, isDark, onMouseDown, onMouseEnterImage, onMouseLeaveImage, elementRef, ...rest } =
    props;

  const [isClip, setIsClip] = useState(false);
  useEffect(() => {
    if (isMain) return;
    setTimeout(() => {
      setIsClip(true);
    }, 10);
  }, [isMain]);

  const clipPath = isMain
    ? undefined
    : isClip
    ? `circle(200% at ${props.x}px ${props.y}px)`
    : `circle(128px at ${props.x}px ${props.y}px)`;

  return (
    <div
      ref={elementRef}
      className={clsx(isMain ? "relative" : "absolute inset-0", "transition-all z-10")}
      style={{
        clipPath,
        transitionDuration: HERO_SECTION_TRANSITION_DURATION + "ms",
        animationDelay: "500ms",
      }}
      {...rest}
      data-mode={isDark ? "dark" : undefined}
    >
      <div className="bg-neutral-0 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-0 min-h-screen">
        <MainHeader animationDisable/>
        <ElementWithCursor
          as={HeroBanner}
          isDark={isDark}
          onMouseDown={onMouseDown}
          onMouseEnter={rest.onMouseEnter}
          onMouseLeave={rest.onMouseLeave}
          variant={CursorVariant.Text}
          theme={isDark ? CursorStyle.White : CursorStyle.Dark}
          content="Click me"
        />
      </div>
    </div>
  );
};

const SectionHero = (props: Props) => {
  const targetElement = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<Array<HeroListState>>(() => [{ id: Math.random() }]);
  const isPreThemeDark = useRef(false);
  const handleCreateClipPath = useThrottled(
    function (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      const { top, left } = targetElement.current!.getBoundingClientRect();
      const { clientX, clientY } = ev;
      const position = { x: clientX - left, y: clientY - top };
      isPreThemeDark.current = !isPreThemeDark.current;
      const id = randomUUID();

      setList((prev) => [...prev, { id, position, isDark: !prev[prev.length - 1].isDark }]);
    },
    [],
    1500,
    true,
    false
  );

  return (
    <section className={styles.sectionHero} ref={targetElement}>
      {list.map(({ id, position, isDark }, idx) => {
        return (
          <ElementWithCursor
            as={RenderHeroSection}
            isMain={idx === 0}
            {...position}
            isDark={isDark}
            onTransitionEnd={(e: any) => {
              if (idx !== 0) {
                const listCloned = [...list];
                listCloned.slice(idx);
                setList(listCloned.slice(idx));
              }
            }}
            data-cursor-theme={isDark ? CursorStyle.White : CursorStyle.Dark}
            onMouseDown={handleCreateClipPath}
            key={id}
          />
        );
      })}
    </section>
  );
};

export default SectionHero;
