import { useCursor } from "@components/cursor/CursorContext";
import { CursorVariant } from "@components/cursor/CursorDefault";
import ElementWithCursor from "@components/cursor/ElementWithCursor";
import Magnetic from "@components/cursor/Magnetic";
import IconLink from "@components/icons/IconLink";
import Parallax from "@components/parallax/Parallax";
import RotateText from "@components/text/RotateText";
import clsx from "clsx";
import gsap from "gsap";
import Link from "next/link";
import { useRef, useState } from "react";

import Cubic3D from "@components/cubic/Cubic";

import styles from "./SectionFooter.module.scss";
import styles2 from "src/layouts/main/MainLayout.module.scss";

type Props = {
  withParallax?: boolean;
};

const socials = [
  { id: 0, title: "Dribble", href: "#" },
  { id: 1, title: "Behance", href: "#" },
  { id: 2, title: "linkedin", href: "#" },
  { id: 3, title: "instagram", href: "#" },
  { id: 4, title: "facebook", href: "#" },
];

const MAX_OFFSET = 500;
const MAX_MULTIPLIER = 50;
const mapRange = gsap.utils.mapRange(0, MAX_OFFSET * 2, 0, MAX_MULTIPLIER);

const offset = 0.01;
function getAxisPosition(e: React.MouseEvent<HTMLElement>, includeOffset?: boolean) {
  const { left, top, height, width } = e.currentTarget.getBoundingClientRect();
  const { pageX, pageY, clientX, clientY } = e;
  const x = clientX - left - width / 2,
    y = clientY - top - height / 2;
  if (includeOffset)
    return { x: x + x + (x > 0 ? 1 : -1) * offset * x, y: y + (y > 0 ? 1 : -1) * offset * y };
  return { x, y };
}

const TIMING = 0.3;

const SectionFooter = (props: Props) => {
  const {
    mouseEventWithPrevious: { onMouseLeave: onMouseLeave2, onMouseEnter: onMouseEnter2 },
  } = useCursor();
  const textRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const innerTextRef = useRef<HTMLDivElement>(null);
  const [multiplierX, setMultiplierX] = useState(MAX_MULTIPLIER);
  const [multiplierY, setMultiplierY] = useState(MAX_MULTIPLIER);

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const { clientX, clientY } = e;

    const { width, height, top, left } = textRef.current!.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = mapRange(centerX - clientX);
    const y = mapRange(centerY - clientY);

    if (x < MAX_MULTIPLIER && x > 0) {
      setMultiplierX(x);
    }
    if (y < MAX_MULTIPLIER && y > 0) {
      setMultiplierY((y * innerWidth) / innerHeight);
    }
  };
  const handleMouseEnter: React.MouseEventHandler<HTMLElement> = (e) => {
    const { x, y } = getAxisPosition(e, false);

    setIsHovering(true);
    gsap.set(hoverRef.current, {
      x: x * 1.2,
      y: y * 1.2,
    });
    gsap.set(innerTextRef.current, {
      x: -x * 0.8,
      y: -y * 0.8,
    });
    gsap.to(hoverRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: TIMING,
      ease: "power3.easeIn",
    });
    gsap.to(innerTextRef.current, {
      x: 0,
      y: 0,
      duration: TIMING,
      ease: "power3.easeIn",
    });

    onMouseEnter2(e);
  };
  const handleMouseLeave = (e: React.MouseEvent<Element, MouseEvent>, scale: number) => {
    const { x, y } = getAxisPosition(e as any);
    setIsHovering(false);
    gsap.to(hoverRef.current, {
      x: x * 0.7,
      y: y * 0.7,
      duration: TIMING,
      ease: "power3.easeIn",
    });
    gsap.to(innerTextRef.current, {
      x: -x * 0.5,
      y: -y * 0.5,
      duration: TIMING,
      ease: "power3.easeIn",
    });

    onMouseLeave2(e as any);
  };
  const size =
    Math.max(Math.sqrt(Math.pow(multiplierX, 2) + Math.pow(multiplierY, 2)) / 2.5 - 5, 0) + "%";

  const Container = props.withParallax ? Parallax.Container : ElementWithCursor;
  const Child = props.withParallax ? Parallax.Child : "div";

  const _props = props.withParallax ? { as: ElementWithCursor, tag: "section" } : {};

  return (
    <Container
      {..._props}
      tag="section"
      className={styles.footer}
      onMouseMove={handleMouseMove}
      content="Work<br> with us"
      variant={CursorVariant.Text}
      stretch
    >
      <Child
        className={styles.footer__container}
        start={["top", "-100%"]}
        end={["bottom", "-100%"]}
        {...(props.withParallax
          ? {
              translateY: ["0%", "-50%"],
              debug: true,
            }
          : {})}
      >
        <div className={styles.footer__content}>
          <div className={styles.footer__content_container}>
            <div className="lg:mr-9 text-center">
              <span>
                Start your <span className="inline lg:block xl:hidden">idea</span>
              </span>
            </div>
            <div className={styles.footer__btn_wrapper}>
              <Magnetic
                as="div"
                scale={1.5}
                tollerance={10}
                typeTollerance="percent"
                className={clsx(styles.footer__btn_container, styles.footer__btn_size)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-full h-full rounded-full text-neutral-0">
                  <div className="hidden xl:block absolute inset-0 rotate-[15deg] rounded-full">
                    <div
                      style={{
                        transformOrigin: "center left",
                        width: size,
                        height: size,
                        zIndex: -1,
                      }}
                    >
                      {[1, 2, 3, 4].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            marginLeft: (i + 1) * 50 + "%",
                          }}
                        >
                          <div
                            className={clsx(
                              styles.footer__btn_size,
                              "absolute border-2 border-neutral-800 rounded-full z-0 bg-white"
                            )}
                            style={{
                              zIndex: 4 - i,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div ref={textRef} className={styles.footer__btn}>
                    <div className={styles.footer__btn_content}>
                      {["idea", "business", "project"].map((title) => {
                        return (
                          <div key={title} className={styles.footer__btn_text}>
                            <span>{title}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.footer__btn_nav} ref={hoverRef}>
                      <div className={clsx(styles.footer__nav_bg, isHovering && styles.active)}>
                        <div
                          className={clsx(
                            styles.footer__btn_size,
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          )}
                          ref={innerTextRef}
                        >
                          <div className="flex flex-col text-center w-full h-full items-center justify-center text-neutral-800 text-base xl:text-h8 lg:text-lg font-medium">
                            <IconLink className="w-12 h-12 md:w-[72px] md:h-[72px] xl:w-24 xl:h-24" />
                            <span>Work With Us</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Magnetic>
            </div>
          </div>
        </div>
        <div className={styles.footer__bottom}>
          <div className={styles.footer__bottom_left}>WE ARE FROM HANOI, VIETNAM</div>
          <div className={styles.footer__bottom_center}>
            <ul className={styles.footer__social_container}>
              {socials.map(({ href, title, id }) => {
                return (
                  <li key={id}>
                    <ElementWithCursor backable>
                      <Link href={href}>
                        <RotateText className="translate-z-2">{title}</RotateText>
                      </Link>
                    </ElementWithCursor>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.footer__bottom_right}>
            © 2023
            <span className="px-5" />
            PIT STUDIO — DIGITAL PRODUCT STUDIO
          </div>
        </div>
      </Child>
    </Container>
  );
};

export default SectionFooter;
