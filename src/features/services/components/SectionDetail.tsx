import LottieServicesList from "@components/lottie/LottieServicesList";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import useMediaQuery, { MediaScreen } from "src/hooks/useMediaQuery";
import { useGui } from "src/libs/debug/hooks";
import { ScrollProgress } from "src/libs/ScrollProgress";

import styles from "./SectionDetail.module.scss";

import { browser } from "src/utils/os";
import SliderDots from "@components/slide/SliderDots";
import ButtonCircular from "@components/buttons/ButtonCircular";
import IconLink from "@components/icons/IconLink";
import { ButtonSize } from "@components/buttons/enum";

import services from "src/data/services.json";
import ElementWithCursor from "@components/cursor/ElementWithCursor";
import { CursorStyle, CursorVariant } from "@components/cursor/CursorDefault";

type Props = {};

const SectionDetail = (props: Props) => {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [isStart, setIsStart] = useState(false);
  const [y, setY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<Lottie>(null);

  const media = useMediaQuery();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(browser.mobile || !media || media > MediaScreen.Large);
  }, []);

  useEffect(() => {
    if (!ref.current || browser.mobile || !media || media > MediaScreen.Large) return;
    const progressScroll = new ScrollProgress(ref.current, { start: ["top", "-50%"] });
    const progressScroll2 = new ScrollProgress(ref.current, {
      start: "top",
      end: ["bottom", "-100%"],
    });

    progressScroll.on("scroll", function (progress: number) {
      setActive(Math.ceil(progress * 4));
    });

    function handleLeave(this: ScrollProgress) {
      const height = containerRef.current?.getBoundingClientRect().height || 0;
      const { top, bottom } = this.data.root;
      const y = bottom - top - height;
      setY(y);
    }
    function handleLeaveBack() {
      setIsStart(false);
      setY(0);
    }
    function handleEnter() {
      setIsStart(true);
      setY(0);
    }

    progressScroll2
      .on("scroll", function (progress: number) {
        lottieRef.current?.anim.goToAndStop(progress * lottieRef.current.anim.totalFrames, true);
        // assign({ progress });
      })
      .on("enter", handleEnter)
      .on("enterBack", handleEnter)
      .on("leave", handleLeave)
      .on("leaveBack", handleLeaveBack);

    progressScroll.init();
    progressScroll2.init();
    return () => {
      progressScroll2.destroy();
      progressScroll.destroy();
    };
  }, []);

  return (
    <section className={clsx(styles.container, "relative")} ref={ref}>
      {!isMobile && (
        <div
          className={clsx(
            isStart && !y ? "fixed top-0" : "absolute top-0 left-0 right-0",
            "container"
          )}
        >
          <div
            className={styles.lottie__container}
            ref={containerRef}
            style={{ transform: `translateY(${y}px)` }}
          >
            <div className={styles.lottie}>
              <LottieServicesList elRef={lottieRef} />
            </div>
          </div>
        </div>
      )}
      <div className={clsx(styles.wrapper, "container")}>
        <div className={styles.detail__container}>
          {services.map(({ description, title }, id) => {
            return (
              <div className={clsx(styles.detail__item, active === id && styles.show)} key={id}>
                <div className={styles.left}>
                  <div></div>
                </div>
                <ElementWithCursor
                  backable
                  variant={CursorVariant.Project}
                  theme={CursorStyle.Primary}
                  className={styles.right}
                >
                  <div className={styles.content}>
                    <div className={styles.title}>
                      <div>{title}</div>
                    </div>
                    <div>
                      <div className={styles.detail__thumb}>
                        <img src={`/images/services/list_${id + 1}.svg`} alt={title} />
                      </div>
                    </div>
                    <div className={styles.desc}>{description}</div>
                  </div>
                </ElementWithCursor>
              </div>
            );
          })}
        </div>
        <div className={styles.detail__footer}>
          <div>
            <ButtonCircular size={ButtonSize.Medium}>
              <IconLink size={32} />
            </ButtonCircular>
          </div>
          <div>
            <SliderDots total={4} active={0} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionDetail;
