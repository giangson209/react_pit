import { CursorStyle } from "@components/cursor/CursorDefault";
import ElementWithCursor from "@components/cursor/ElementWithCursor";
import LottieOurServices, { TOTAL_FRAMES } from "@components/lottie/LottieOurServices";

import anime from "animejs";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";

import { ScrollFullPageElement } from "src/libs/ScrollFullPage/ScrollFullPageElement";

import { debounce } from "@utils/debouce";
import { off, on } from "@utils/listener";
import { getOffset, getTranslate } from "src/libs/scroll/utils";

import SectionFooter from "./SectionFooter";

import Use from "@components/icons/Use";
import { ScrollProgress } from "src/libs/ScrollProgress";
import styles from "styles/Home.module.scss";

function cssVarProxy<T extends Record<string, string>>(
  target: HTMLElement,
  object: T
): Record<keyof T, number> {
  // Declare object to proxy
  let proxyTarget: Record<keyof T, number> = {} as any;

  // Capture initial values
  Object.keys(object).forEach((varName: any) => {
    let value = getComputedStyle(target).getPropertyValue(varName);
    if (value.includes(object[varName]))
      value = value.substring(0, value.length - object[varName].length);
    (proxyTarget as any)[varName] = value;
  });

  return new Proxy(proxyTarget, {
    set: (targetObject, property: string, value) => {
      target.style.setProperty(property as string, value + object[property]);
      return true;
    },
  });
}

type Props = {};
const data = [
  {
    title: "UX/UI<br/>Design",
    desc: "We help you optimize user interface and user experience design on many digital products such as websites, mobile applications, or for car UX & automotive HMI with intuitive high-fidelity prototyping.",
  },
  {
    title: "Web, App<br/>Development",
    desc: "Turn your design idea into a real product. Build it by warm heart developers. You will have a wide choice of languages and platforms for both mobile app and website, comprehensive frontend and backend.",
  },
  {
    title: "Illustration<br/>Design",
    desc: "The stories and ideas for your products will be conveyed through more understandable and vivid illustrations. You can choose from many different styles, modern and impressive.",
  },
  {
    title: "Interaction<br/>Design",
    desc: "Your product will be more perfect than ever with the addition of motion interactive elements. You will experience design testing versions very similar to the final development version, helping to visualize your product.",
  },
];

const ELIPSE_RATIO = 5.6;
const MAX_ELIPSE_RADIUS = 1;

const DEFAULT_ELIPSE_SIZE = { rx: MAX_ELIPSE_RADIUS, ry: MAX_ELIPSE_RADIUS, cx: 0.5, cy: 0.5 };

/**
 * @todo
 * [] update position all item when `isFixed` is true
 *
 */
const SectionOurServices = (props: Props) => {
  // const { object, update, gui } = useGui("test", { progress: 0 });

  const [height, setHeight] = useState<number | undefined>(undefined);

  const ref = useRef<HTMLDivElement>(null);
  const sectionServiceRef = useRef<HTMLDivElement>(null);
  const sectionOurClientsRef = useRef<HTMLElement>(null);
  const titleTextRef = useRef<HTMLDivElement>(null);

  const lottieRef = useRef<Lottie>(null);

  const elemntsRef = useRef<HTMLElement[]>([]);
  const textInElementRef = useRef<HTMLElement[]>([]);
  const elipseElRef = useRef<HTMLElement[]>([]);
  const listContainerRef = useRef<HTMLUListElement>(null);

  const items = useRef<
    Array<{
      timeline: anime.AnimeInstance;
      timelinePosition: anime.AnimeInstance;
      element: HTMLElement;
      calc: null;
      /**
       * Top of element in screen;
       */
      top: number;
      /**
       * Bottom of element in screen;
       */
      bottom: number;

      /**
       * Offset of element
       * positive is offset inside
       * negative is offset outside
       */
      offset: number[];

      idleTime: number;
    }>
  >([]);

  const textItems = useRef<
    Array<{
      target: {
        "--height": string | number;
      };
      timelineOpacity: anime.AnimeInstance;
    }>
  >([]);

  const _data = useRef<{
    height: number;
    screenY: number;
    aspectRatio: number;
    minElipseSize: number;
    containerY: number;
    containerHeight: number | undefined;
    ourClient: { top: number; bottom: number };
  }>({
    height: 0,
    screenY: 0,
    aspectRatio: 1,
    minElipseSize: 0.01,
    containerY: 0,
    containerHeight: undefined,
    ourClient: { top: 0, bottom: 100 },
  });

  const [isHideOurServices, setIsHideOurservices] = useState(false);

  const [cx] = useState(DEFAULT_ELIPSE_SIZE.cx);
  const [cy, setCy] = useState(DEFAULT_ELIPSE_SIZE.cy);
  const [rx, setRx] = useState(DEFAULT_ELIPSE_SIZE.rx);
  const [ry, setRy] = useState(DEFAULT_ELIPSE_SIZE.ry);

  useEffect(() => {
    if (!ref.current) return;
    if (!lottieRef.current) return;

    const data = _data.current;

    const markers: Array<{ tm: number }> = [
      { tm: 240 }, // stop to
      { tm: 480 }, // run to
      { tm: 600 }, // stop to
      { tm: 840 }, // run to
      { tm: 960 }, // stop to
      { tm: 1200 }, // run to
      { tm: 1320 }, // stop to
      { tm: 1320 + 240 }, // end to
    ];

    const translateValue = -62.5 / 3;
    const keyframes: Array<{ value: number | string | (string | number)[]; duration: number }> = [];
    let current = 0;
    markers.forEach(({ tm }, i) => {
      const multiple = Math.ceil(i / 2);
      keyframes.push({
        duration: tm - current,
        value:
          i % 2
            ? [translateValue * (multiple - 1) + "%", translateValue * multiple + "%"]
            : translateValue * multiple + "%",
      });
      current = tm;
    });

    const lastOffsetTiming = markers[markers.length - 2].tm;
    const lastDuration = markers[markers.length - 1].tm - lastOffsetTiming;
    /**
     * ANIMATION IN
     */
    const serviceElipseSize = { ...DEFAULT_ELIPSE_SIZE };

    const anim = lottieRef.current.anim;
    const animtlOurservices = anime
      .timeline({
        targets: new Proxy(
          { progress: 0 },
          {
            set(targetObject, property: string, value: number) {
              // objectProgress.frame = value;
              anim.goToAndStop(value, true);
              return true;
            },
          }
        ),
        progress: [0, TOTAL_FRAMES],
        easing: "linear",
        autoplay: false,
        duration: TOTAL_FRAMES,
      })
      .add({
        targets: ref.current,
        translateX: keyframes,
        easing: "linear",
        duration: TOTAL_FRAMES,
      })
      .add(
        {
          targets: ref.current,
          opacity: [1, 0],
          duration: lastDuration / 3,
        },
        lastOffsetTiming + lastDuration / 3
      )
      .add(
        {
          targets: serviceElipseSize,
          cy: [0.5, 1],
          easing: "linear",
          duration: lastDuration * 0.9,
          update() {
            setCy(serviceElipseSize.cy);
          },
        },
        lastOffsetTiming
      );

    let id: number;
    const updateTimelineValue = debounce(
      () => {
        if (id) {
          const idx = (animtlOurservices as any).children.findIndex((p: any) => p.id === id);
          (animtlOurservices as any).children.splice(idx, 1);
        }
        const minRy = data.minElipseSize;
        const minRx = (data.minElipseSize / data.aspectRatio) * ELIPSE_RATIO;
        animtlOurservices.add(
          {
            targets: serviceElipseSize,
            easing: "linear",
            keyframes: [
              {
                rx: [1, 0.5],
                ry: [1, 0.5],
                duration: lastDuration * 0.5,
              },
              {
                rx: [0.5, minRx],
                ry: [0.5, minRy],
                duration: lastDuration * 0.4,
              },
              {
                rx: minRx,
                ry: minRy,
                duration: lastDuration * 0.1,
              },
            ],
            update() {
              setRx(serviceElipseSize.rx);
              setRy(serviceElipseSize.ry);
            },
          },
          lastOffsetTiming
        );
        const children: any[] = (animtlOurservices as any).children;
        id = children[children.length - 1].id;
      },
      50,
      true,
      true
    );

    function handleScroll(progress: number) {
      if (progress == 0 || progress === 1) return;
      animtlOurservices.seek(animtlOurservices.duration * progress);
    }
    const progressScroll = new ScrollProgress(sectionServiceRef.current!, {
      start: ["top", "-100%"],
      end: ["bottom", "-100%"],
    });
    progressScroll.on("scroll", handleScroll);
    updateTimelineValue();
    progressScroll.init();
    on(window, "resize", updateTimelineValue);
    return () => {
      off(window, "resize", updateTimelineValue);
      progressScroll.destroy();
    };
  }, []);

  const [isFixed, setIsFixed] = useState(false);
  const [isShow, setIsShow] = useState(false);

  /**
   * Our clients
   */
  useEffect(() => {
    if (!sectionOurClientsRef.current) return;

    const data = _data.current;

    // g.domElement.style.left = "0px";
    const elipsePosition = { y: 0 };
    const elipseSize = {
      opacity: 1,
      height: "100%",
      width: "100%",
      borderRadius: "100%",
      borderWidth: 2,
    };

    /**
     * ANIMATION OUT
     * [================] // total time
     * [====]             //
     *      [====]        // opacity, height, width of elipse
     *      [===========] // elipse position from bototm to top
     *    [=============] // elipse border radius
     */

    const totalElipseOutDuration = 3000;
    const offsetSize = 1000;
    const durationSize = 1000;
    const offsetBorder = 2000;
    const durationBorder = totalElipseOutDuration - offsetBorder;

    const elipseOutPositionParams: anime.AnimeAnimParams = {
      targets: elipsePosition,
      y: [0, 1],
      autoplay: false,
      duration: durationSize + offsetSize,
      update(anim) {
        if (elipsePosition.y === 1) setIsShow(true);
        else setIsShow(false);
      },
    };
    const elipseOutSizeParams: [anime.AnimeAnimParams, number] = [
      {
        targets: elipseElRef.current,
        autoplay: false,
        opacity: [1, 0.2],
        height: ["100%", "0%"],
        width: ["100%", "500%"],
        duration: durationSize * 1,
      },
      offsetSize,
    ];
    const elipseOutBorderParams: [anime.AnimeAnimParams, number] = [
      {
        targets: elipseElRef.current,
        autoplay: false,
        borderRadius: ["100%", "0%"],
        borderWidth: [2, 1],
        duration: durationBorder,
      },
      offsetBorder,
    ];

    const animeElipseOutTl = anime.timeline({
      easing: "linear",
      autoplay: false,
      update(anim) {
        if (animeElipseOutTl.progress === 100 || animeElipseOutTl.progress === 0) {
          setHeight(undefined);
          setIsFixed(false);
        } else {
          setHeight(data.containerHeight);
          setIsFixed(true);
        }

        if (animeElipseOutTl.progress === 0) setIsHideOurservices(false);
        else setIsHideOurservices(true);
      },
    });

    animeElipseOutTl
      // Elipse size
      .add(elipseOutPositionParams)
      // Elipse Position
      .add(...elipseOutSizeParams)
      // Elipse Border
      .add(...elipseOutBorderParams);

    const animtl = anime
      .timeline({
        autoplay: false,
      })
      .add(
        {
          targets: titleTextRef.current,
          translateY: [
            { value: ["0vh", "-90vh"], duration: 1000 },
            { value: "0", duration: 500 },
          ],
          opacity: [
            { value: 0, duration: 100 },
            { value: [0, 1], duration: 50 },
            { value: 1, duration: 600 },
            { value: [1, 0], duration: 150 },
          ],
          easing: "linear",
        },
        0
      )
      .add({}, 0);

    let isHided = true;
    function handleLinePositionWithElipse(progress: number) {
      const isProgresRest = progress >= 2 / 3;
      const _p = (progress - 2 / 3) * 3;

      const vh = innerHeight;
      const progressHeight = vh * _p;

      let prevV = 0;
      for (let i = 0; i < items.current.length; i++) {
        const item = items.current[i];
        const { timelinePosition, timeline, idleTime } = item;
        timeline.seek(idleTime);
        timelinePosition.seek(timelinePosition.duration * progress);

        const { target } = textItems.current[i];
        target["--height"] = prevV;
        prevV = timeline.animations[0].currentValue as unknown as number;
      }

      for (let i = 0; i < textItems.current.length; i++) {
        const item = textItems.current[i];
        if (isProgresRest) {
          const { element } = items.current[i];

          const { timelineOpacity } = item;
          const { top, height, bottom } = element.getBoundingClientRect();
          if (top >= vh) {
            timelineOpacity.seek(timelineOpacity.duration);
          } else {
            const progress = Math.max(
              0,
              Math.min(1, (progressHeight - top) / (Math.min(bottom, innerHeight) - top))
            );
            timelineOpacity.seek(timelineOpacity.duration * progress);
          }
        } else if (!isHided) {
          const { timelineOpacity } = item;
          timelineOpacity.seek(0);
        }
      }

      isHided = !isProgresRest;
      animtl.seek(progress * animtl.duration);
    }

    function handleLinePosition() {
      const y = scrollY;
      const vh = innerHeight;

      let prevV = 0;
      for (let i = 0; i < items.current.length; i++) {
        const item = items.current[i];
        const { timeline, calc, element, top, bottom } = item;
        let progress;

        /**
         * limit is total range of element show in screen
         */
        const limit = Math.min(bottom, vh - top + bottom); // bottom element in screen

        /**
         * Distance off bottom element to the top of screen
         */
        const distance = Math.min(limit, Math.max(0, bottom - y));
        progress = 1 - distance / limit;

        timeline.seek(timeline.duration * progress);
        const { target } = textItems.current[i];
        target["--height"] = prevV;
        prevV = timeline.animations[0].currentValue as unknown as number;
      }

      for (let i = 0; i < textItems.current.length; i++) {}
    }

    function handleScroll() {
      // Section Our Clients
      const y = scrollY;
      const vh = innerHeight;
      const { top, bottom } = data.ourClient;
      if (y <= bottom) {
        const limit = bottom - top + vh;
        const distance = Math.min(limit, Math.max(0, bottom - y));
        const progress = 1 - distance / limit;
        animeElipseOutTl.seek(progress * animeElipseOutTl.duration);
        handleLinePositionWithElipse(progress);
      } else {
        if (animeElipseOutTl.currentTime !== animeElipseOutTl.duration) {
          animeElipseOutTl.seek(animeElipseOutTl.duration);
          handleLinePositionWithElipse(1);
        }
        handleLinePosition();
      }
    }
    function bindEvents() {
      on(window, "scroll", handleScroll);
    }
    function unbindEvents() {
      off(window, "scroll", handleScroll);
    }

    setTimeout(() => animeElipseOutTl.seek(0), 0);

    handleScroll();
    bindEvents();
    return unbindEvents;
  }, []);

  /**
   * Init important variable to calculate effect when scroll
   */
  useEffect(() => {
    const TIMELINE_DEFAULTS = {
      easing: "linear",
      autoplay: false,
      duration: 1000,
    };

    const timelineArgs = {
      "--value": [
        { value: [200, 0], duration: 1000 },
        { value: 0, duration: 500 },
      ],
      easing: "easeOutCubic",
    };

    function updateElements() {
      const data = _data.current;
      const y = isFixed ? data.containerY : scrollY;
      const vh = innerHeight;
      items.current = elemntsRef.current.map((element, i) => {
        const offset = getOffset(element) || [0, 0];
        const translate = getTranslate(element);
        const bcr = element.getBoundingClientRect();
        let top: number, bottom: number;

        top = bcr.top - translate.y + y; // top off element in pageY
        bottom = Math.min(top + bcr.height, data.height); // compare bottom off element with scroll height
        top += offset[0]; // top lement in page
        bottom = Math.min(bottom - offset[1], data.height); // Bottom element in page

        let progress;
        const limit = Math.min(bottom, vh - top + bottom); // bottom element in screen
        const distance = Math.min(limit, Math.max(0, bottom - data.containerY));
        progress = 1 - distance / limit;

        const target = cssVarProxy(element, {
          "--value": "px",
          "--percent": "%",
          "--vh": "vh",
        });
        const timeline = anime({
          targets: target,
          ...TIMELINE_DEFAULTS,
          ...timelineArgs,
        });

        const timelinePosition = anime({
          targets: target,
          ...TIMELINE_DEFAULTS,
          "--percent": [
            { value: [100 * (i + 1), 0], duration: 1000 },
            { value: 0, duration: 500 },
          ],
          "--vh": [
            { value: [100, 0], duration: 1000 },
            { value: 0, duration: 500 },
          ],
          duration: 1500,
        });

        return {
          timeline,
          timelinePosition,
          element,
          calc: null,
          top,
          bottom,
          offset,
          idleTime: progress * timeline.duration,
        };
      });

      textItems.current = textInElementRef.current.map((element) => {
        const target = cssVarProxy(element, {
          "--height": "px",
        });

        return {
          target,
          timelineOpacity: anime({
            targets: element,
            ...TIMELINE_DEFAULTS,
            opacity: [0, 1],
          }),
        };
      });
    }
    function handleResize(ev?: UIEvent) {
      const sectionTop = sectionOurClientsRef.current?.getBoundingClientRect().top || 0;
      const sectionPadding = sectionOurClientsRef.current
        ? parseInt(getComputedStyle(sectionOurClientsRef.current).paddingTop, 10)
        : 0;
      const bcr = elemntsRef.current[0].children[1].children[0].getBoundingClientRect();
      Object.assign(_data.current, {
        height: document.body.scrollHeight - innerHeight,
        screenY: innerHeight,
        aspectRatio: innerWidth / innerHeight,
        minElipseSize: bcr.height / 2 / innerHeight,

        containerY: sectionTop + scrollY + sectionPadding,
        containerHeight: listContainerRef.current?.getBoundingClientRect().height || 0,
        ourClient: {
          top: sectionTop + scrollY,
          bottom: sectionTop + scrollY + sectionPadding,
        },
      });
      updateElements();
    }
    function bindEvents() {
      on(window, "resize", handleResize);
    }
    function unbindEvents() {
      off(window, "resize", handleResize);
    }
    handleResize();
    bindEvents();
    return unbindEvents;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ElementWithCursor as="section" className={styles.sectionOurService} ref={sectionServiceRef}>
        <ScrollFullPageElement className="h-[50vh] absolute w-full -z-10" index={10} />
        <div
          style={{
            height: 700 + "vh", // Decrease it if you want speedup
            opacity: isHideOurServices ? 0 : 1,
          }}
        >
          <svg className="w-0 h-0" viewBox="0 2.5 56 15">
            <defs>
              <clipPath id="clip-ellipse-2" clipPathUnits="objectBoundingBox">
                <ellipse
                  id="e"
                  // ref={clipRef}
                  fill="white"
                  rx={rx}
                  ry={ry}
                  cx={cx}
                  cy={cy}
                ></ellipse>
              </clipPath>
            </defs>
          </svg>
          <div
            className="sticky top-0 overflow-hidden bg-neutral-0 h-screen"
            style={{
              clipPath: "url(#clip-ellipse-2)",
            }}
          >
            <div className="absolute left-0 bottom-0 top-0" ref={ref}>
              <div className="absolute bottom-0 w-full z-0">
                <LottieOurServices elRef={lottieRef} loop={false} autoplay={false} />
              </div>
              <div className="relative flex flex-row flex-nowrap">
                <div className="w-screen">
                  <div className="container mt-36 flex">
                    <div className="w-1/2">
                      <div className="text-h2 font-bold">
                        Our
                        <br />
                        services.
                      </div>
                    </div>
                    <div className="w-1/2">
                      <h4
                        className="text-h4 font-medium"
                        dangerouslySetInnerHTML={{ __html: data[0].title }}
                      />
                      <p className="mt-8" style={{ width: 580 }}>
                        {data[0].desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ width: 12.5 + "vw" }}></div>
                {data.slice(1, 5).map(({ desc, title }, i) => (
                  <div key={i} style={{ width: 62.5 + "vw" }}>
                    <div className="flex mt-36">
                      <div className="w-1/2">
                        <h4
                          className="text-h4 font-medium"
                          dangerouslySetInnerHTML={{ __html: title }}
                        />
                        <p className="mt-8" style={{ width: 580 }}>
                          {desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ElementWithCursor>
      <ElementWithCursor
        as="section"
        className="min-h-screen text-white overflow-hidden bg-neutral-800 pt-[50vh]"
        ref={sectionOurClientsRef}
        theme={CursorStyle.White}
      >
        <div className="absolute">
          <div
            className={clsx(isFixed ? "fixed" : "hidden", "bottom-[100px] left-0 right-0")}
            ref={titleTextRef}
          >
            <div className="text-center text-h3 font-medium">
              <div>Our</div>
              <div>Clients</div>
            </div>
          </div>
        </div>
        <div style={{ height }}>
          <ul
            ref={listContainerRef}
            className={clsx(isFixed ? "fixed top-0 left-0 right-0" : "", "overflow-hidden pb-24")}
          >
            {[...dataClients, ...dataClients].map(({ desc, name }, i) => {
              return (
                <li
                  key={i}
                  className={styles.client__item_container}
                  data-scroll-offset="100%,-1"
                  ref={(ref) => (elemntsRef.current[i] = ref!)}
                >
                  <div ref={(ref) => (textInElementRef.current[i] = ref!)}>
                    <div className={styles.client__item}>
                      <div className={clsx(styles.client__item_content)}>
                        <div className={styles.client__item_left}>
                          <div>
                            <div className={styles.client__item_company}>
                              {name} {i * 2},{i * 2 + 1}
                            </div>
                            <svg
                              preserveAspectRatio="xMidYMid meet"
                              className={styles.client__item_logo}
                            >
                              <Use xlinkHref="/clients/thu-cuc.svg" />
                            </svg>
                          </div>
                        </div>
                        <div className={styles.client__item_right}>
                          <div>{desc}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0  w-full h-full flex justify-center pointer-events-none">
                    <div className={styles.separator}>
                      <div
                        className={clsx(styles.separatorContainer, !i && "bg-neutral-0")}
                        ref={(ref) => (elipseElRef.current[i] = ref!)}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <SectionFooter withParallax />
      </ElementWithCursor>
    </>
  );
};

export default SectionOurServices;

const dataClients = [
  {
    name: "Thu Cuc",
    desc: "Hospital specialized in cosmetology. Dermatology clinic.",
  },
  {
    name: "Vinmec",
    desc: "An academic health system invested and developed by Vingroup",
  },
  {
    name: "VinGroup",
    desc: "Vietnam's multi-industry corporation in service, technology,...",
  },
  {
    name: "FPT Telecom",
    desc: "Provider of telecommunications, internet, and TV service",
  },
  {
    name: "Thu Cuc",
    desc: "Hospital specialized in cosmetology. Dermatology clinic.",
  },
  {
    name: "Vinmec",
    desc: "An academic health system invested and developed by Vingroup",
  },
  {
    name: "VinGroup",
    desc: "Vietnam's multi-industry corporation in service, technology,...",
  },
  {
    name: "FPT Telecom",
    desc: "Provider of telecommunications, internet, and TV service",
  },
  {
    name: "Thu Cuc",
    desc: "Hospital specialized in cosmetology. Dermatology clinic.",
  },
  {
    name: "Vinmec",
    desc: "An academic health system invested and developed by Vingroup",
  },
  {
    name: "VinGroup",
    desc: "Vietnam's multi-industry corporation in service, technology,...",
  },
  {
    name: "FPT Telecom",
    desc: "Provider of telecommunications, internet, and TV service",
  },
  {
    name: "FPT Telecom",
    desc: "Provider of telecommunications, internet, and TV service",
  },
];
