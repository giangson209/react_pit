import { useCallback, useEffect, useRef } from "react";
import Lottie from "react-lottie";

import ElementWithCursor from "@components/cursor/ElementWithCursor";
import LottieOurHightLight from "@components/lottie/LottieOurHightlight";
import Parallax from "@components/parallax/Parallax";

import { off, on } from "@utils/listener";
import anime from "animejs";
import { ScrollFullPageElement } from "src/libs/ScrollFullPage";

import styles from "styles/Home.module.scss";
import handler from "pages/api/hello";
import { useGui } from "src/libs/debug/hooks";
import { getRange } from "src/libs/scroll/utils";
import { ScrollProgress } from "src/libs/ScrollProgress";

type Props = {};

const SectionOurHightLightProject = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lottierRef = useRef<Lottie>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const y = scrollY;

    const animetl = anime
      .timeline({
        easing: "linear",
        autoplay: false,
      })
      .add(
        {
          targets: new Proxy(
            { frame: 0 },
            {
              set(target, p, newValue, receiver) {
                lottierRef.current?.anim.goToAndStop(newValue, true);
                return true;
              },
            }
          ),
          frame: [0, 270],
          duration: 3500,
        },
        0
      )
      .add(
        {
          targets: textRef.current,
          translateY: ["0%", "50%"],
          duration: 1000,
        },
        2500
      );

    Array.from(textRef.current?.children!).forEach((el, i) => {
      animetl.add(
        {
          targets: el,
          translateY: [-28, 0],
          opacity: [0, 1],
          duration: 200,
        },
        1000 + i * 100 * 1.5
      );
    });

    function handleScroll(progress: number) {
      animetl.seek(animetl.duration * progress);
    }

    const progressScroll = new ScrollProgress(parent, { start: ["top", "-150%"] });
    progressScroll.on("scroll", handleScroll);
    progressScroll.init();
    return progressScroll.destroy;
  }, []);

  const getTopPosition = useCallback((element: HTMLElement) => {
    return element.parentElement!.offsetTop + element.offsetTop;
  }, []);

  return (
    <ElementWithCursor as={Parallax.Container} className={styles.sectionProject}>
      <div className="h-[50vh] sticky top-[50vh] overflow-visible" ref={containerRef}>
        <div className="h-[200%]">
          <Parallax.Child
            start={["top", "-100%"]}
            end={["top", "-50%"]}
            translateY={["0%", "-50%"]}
            // debug
            className="relative h-full overflow-hidden"
          >
            <div className="flex relative h-full flex-col text-neutral-0">
              <div className={styles.project__title} ref={textRef}>
                <div className="-translate-y-7 opacity-0">Our</div>
                <div className="-translate-y-7 opacity-0">highlight</div>
                <div className="-translate-y-7 opacity-0">project</div>
              </div>
            </div>
            <div className="absolute h-full w-full top-0 bg-neutral-0 mix-blend-difference pointer-events-none">
              <LottieOurHightLight elRef={lottierRef} />
            </div>
            <div
              title=""
              role="button"
              aria-label="animation"
              className="pointer-events-none text-neutral-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 3840 1820"
                width="3840"
                height="1820"
                className="w-full h-full absolute inset-0"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs></defs>
                <g>
                  <g transform="matrix(1,0,0,1,1198,1264)" opacity="1">
                    <g transform="matrix(1,0,0,1,723,95)" opacity="1">
                      <g opacity="1" transform="matrix(2,0,0,2,0,0)">
                        <path
                          fill="currentColor"
                          fillOpacity="1"
                          d="M361.5 0C361.5 26.2153 199.5119 47.5 0 47.5-199.5119 47.5-361.5 26.2153-361.5 0L-361.5 250 361.5 250"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </Parallax.Child>
        </div>
      </div>
      <ScrollFullPageElement
        className="absolute w-full h-screen -z-10"
        style={{ top: 50 + "%" }}
        speedIn={1000}
        speedOut={1000}
        getTopPosition={getTopPosition}
        index={0}
      />
    </ElementWithCursor>
  );
};

export default SectionOurHightLightProject;
