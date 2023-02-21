// import { ButtonIcon } from "@components/buttons";
import { ButtonWithIcon } from "@components/buttons";
import { CursorStyle } from "@components/cursor/CursorDefault";
import ElementWithCursor from "@components/cursor/ElementWithCursor";
import IconDribbble from "@components/icons/IconDribbble";
import IconLink from "@components/icons/IconLink";
import { Tab } from "@components/tab";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AnimeShow } from "src/libs/animation/show3d";
import { Routers } from "src/routers";

import styles from "./styles";

type Props = {
  tabs: string[];
};

const SectionCover = (props: Props) => {
  const [active, setActive] = useState(0);
  const router = useRouter();
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const animeshow = new AnimeShow();
    Array.from(headingRef.current.children).forEach((e, i) => animeshow.add(e, { delay: i * 100 }));
    animeshow.play();
    return () => {
      animeshow.destroy();
    };
  }, []);

  const isProject = router.asPath.startsWith(Routers.PROJECTS);

  return (
    <ElementWithCursor theme={CursorStyle.White} as="section">
      <div className="container">
        <div className={styles.title__container} style={{ perspective: 300 }} ref={headingRef}>
          <div>
            <Link
              href={Routers.PROJECTS}
              className={clsx(styles.title, isProject ? styles.active : undefined)}
            >
              <span>Project</span>
            </Link>
          </div>
          <div>
            <Link
              href={Routers.INSPRIRATION}
              style={{ animationDelay: "0.1s" }}
              className={clsx(styles.title, !isProject ? styles.active : undefined)}
            >
              <span> Inspiration</span>
            </Link>
          </div>
        </div>
        <div className={styles.tabs}>
          <div className={styles.tabs__container}>
            {props.tabs.map((title, i) => {
              return (
                <Tab key={title} active={active === i} onClick={() => setActive(i)}>
                  {title}
                </Tab>
              );
            })}
          </div>
          <div className={styles.tabs__btn}>
            {!isProject && (
              <ButtonWithIcon
                as={Link}
                href="/"
                btnStyle="secondary"
                border
                IconLeading={<IconDribbble size={32} />}
                IconTrail={<IconLink size={32} />}
              >
                VIEW MORE
              </ButtonWithIcon>
            )}
          </div>
        </div>
      </div>
    </ElementWithCursor>
  );
};

export default SectionCover;
