import ButtonGhostTertiary from "@components/buttons/ButtonGhostTertiary";
import { useCursor } from "@components/cursor/CursorContext";
import { CursorStyle, CursorVariant } from "@components/cursor/CursorDefault";
import ElementWithCursor from "@components/cursor/ElementWithCursor";
import { on, off } from "@utils/listener";
import anime from "animejs";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { ScrollFullPageElement } from "src/libs/ScrollFullPage";
import styles from "styles/Home.module.scss";
import Baseline from "./Baseline";

import products from "src/data/products.json";
import Parallax from "@components/parallax/Parallax";
import { splitTextToLines } from "@utils/text";
import RotateText from "@components/text/RotateText";

import { CustomSplitText } from "src/libs/SplitText";
import { Browser } from "@utils/os";
import { ScrollProgress } from "src/libs/ScrollProgress";
import { useGui } from "src/libs/debug/hooks";

type Props = {};
type Data = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  thumbnail: { src: string };
};

const SectionProducts = (props: Props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { mouseEventWithPrevious } = useCursor();

  const refContainer = useRef<HTMLElement>(null);

  const refBaselineVertical = useRef<HTMLDivElement[]>([]);
  const refBaselineHorizontal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!refContainer.current) return;
    const TIMELINE_DEFAULTS = {
      duration: 1000,
      autoplay: false,
      easing: "linear",
    };
    const animetl = anime
      .timeline({
        autoplay: false,
      })
      .add(
        {
          targets: refBaselineHorizontal.current,
          delay: 400,
          ...TIMELINE_DEFAULTS,
          scaleX: [{ value: [0, 1], duration: 600 }],
        },
        0
      );
    refBaselineVertical.current.forEach((el) => {
      animetl.add(
        {
          targets: el,
          delay: 400,
          ...TIMELINE_DEFAULTS,
          scaleY: [{ value: [0, 1], duration: 600 }],
        },
        0
      );
    });

    function handleScroll(progress: number) {
      setCurrentPage(progress * products.length);

      const y = scrollY;
      const p = 0.5 - (progressScroll.data.top - y) / innerHeight;
      if (p > 1) return;
      animetl.seek(p * animetl.duration);
    }

    const progressScroll = new ScrollProgress(refContainer.current, {
      start: ["top", "-50%"],
      end: ["bottom", "-50%"],
    });
    progressScroll.on("scroll", handleScroll);
    progressScroll.init();
    return () => {
      progressScroll.destroy();
    };
  }, []);
  const isShow = currentPage >= 0.5;

  return (
    <ElementWithCursor
      ref={refContainer}
      as={Parallax.Container}
      tag="section"
      className={styles.sectionProducts}
      style={{ height: 100 * products.length + "vh" }}
      theme={CursorStyle.White}
    >
      <ElementWithCursor
        // as={Parallax.Child}
        // translateY={[-300, 0]}
        backable
        className="container w-full flex"
        theme={CursorStyle.Primary}
        variant={CursorVariant.Project}
      >
        <div className="w-1/2">
          <div className={styles.productWrapper}>
            <Baseline
              ref={(ref) => (refBaselineVertical.current[0] = ref!)}
              vertical
              position="left"
            />
            <div className="flex-1 relative">
              {products.map((data, i) => (
                <Tile key={i} index={i} currentPage={currentPage} {...data}></Tile>
              ))}
            </div>
            <Baseline
              ref={(ref) => (refBaselineVertical.current[1] = ref!)}
              vertical
              position="right"
            />
            <Baseline ref={refBaselineHorizontal} />
            <div className="py-8 text-center">
              <ButtonGhostTertiary
                {...mouseEventWithPrevious}
                ghostTertiaryProps={{ className: "bg-primary-600" }}
              >
                VIEW ALL CASES
              </ButtonGhostTertiary>
            </div>
          </div>
        </div>
        <div
          className="w-1/2 transition-all duration-1000 ease-out"
          style={{
            opacity: isShow ? 1 : 0,
            clipPath: isShow ? "inset(0 0 0 0)" : `inset(${(0.8 / products.length) * 100}% 0 0 0)`,
          }}
        >
          {products.map(({ thumbnail }, i) => {
            return (
              <ScrollFullPageElement
                key={i}
                className={styles.productItemRight}
                speedIn={1000}
                offset={i === 0 ? [200, 0] : undefined}
                speedOut={i === products.length - 1 ? 1000 : 1000}
                index={i + 1}
              >
                <div className="py-20 px-16 h-full">
                  <div className="bg-lime-400 h-full relative overflow-hidden">
                    <img
                      src={thumbnail.src}
                      alt={thumbnail.src}
                      className={clsx(
                        "w-full h-full object-cover transition-transform duration-700",
                        i === 0 ? (isShow ? "scale-100" : "scale-150") : undefined
                      )}
                    />
                  </div>
                </div>
              </ScrollFullPageElement>
            );
          })}
        </div>
      </ElementWithCursor>
    </ElementWithCursor>
  );
};

interface TileProps extends Data {
  index: number;
  currentPage: number;
}
const Tile = ({ index, currentPage, tags, title, description }: TileProps) => {
  const progress = Math.max(0, currentPage - index);
  const ref = useRef<HTMLDivElement>(null);
  const lines = useRef<CustomSplitText>();

  let opacity;
  if (progress > 0.85 && index < products.length) {
    opacity = Math.max(0, (1 - progress) * 4);
  } else opacity = Math.min(1, Math.max(0, progress * 4));
  const isShow = progress > 0 && progress < 1;

  useEffect(() => {
    if (!ref.current) return;
    if (!lines.current) lines.current = new CustomSplitText(ref.current, { type: "lines" });
    const TIMELINE_ARGS: any = {
      delay: 200,
      opacity: isShow ? [0, 1] : [1, 0],
      translateY: isShow ? ["130%", "0%"] : ["0%", "130%"],
    };
    if (!Browser.isSafari) TIMELINE_ARGS.rotateX = isShow ? ["-40deg", 0] : [0, "-40%"];

    const animetl = anime.timeline({
      easing: "easeOutExpo",
      duration: 750,
    });
    lines.current.lines.forEach((el, i) => {
      animetl.add(
        {
          targets: el,
          ...TIMELINE_ARGS,
        },
        i * 200
      );
    });
  }, [isShow]);

  return (
    <div
      className={clsx(
        styles.productItemLeft,
        progress <= 0 || progress >= 1 ? styles.hide : styles.show
      )}
    >
      <div className="px-16 pt-32">
        <div className={styles.productItemHead}>
          <RotateText
            as="h5"
            style={{ "--tw-translate-z": "0px" } as any}
            onceOnly
            hover={false}
            rotate
            rotateDirect={progress <= 0 ? "down" : progress >= 1 ? "up" : undefined}
          >
            {title}
          </RotateText>
        </div>
        <div className={styles.productItemDesc} ref={ref}>
          {description}
        </div>
        <ul className={styles.productItemTags}>
          {tags.map((_, i) => (
            <li key={i} className={styles.productItemTag}>
              {_}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SectionProducts;
