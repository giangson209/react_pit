import ElementWithCursor from "@components/cursor/ElementWithCursor";
import clsx from "clsx";
import React, { useState } from "react";
import styles from "./styles";

import products from "src/data/products.json";
import {
  ObserveFn,
  useIntersectionObserver,
  useOnIntersect,
} from "src/hooks/useIntersectionObserver";
import { CursorStyle, CursorVariant } from "@components/cursor/CursorDefault";
import Link from "next/link";
import { Routers } from "src/routers";

type Props = {};

const SectionListProjects = (props: Props) => {
  const { observer } = useIntersectionObserver();

  return (
    <ElementWithCursor theme={CursorStyle.White}>
      <div className={clsx(styles.list__project, "container")}>
        <div className={styles.list_container_2}>
          {products.map(({ id, title, tags, thumbnail: { src } }, i) => {
            return (
              <ProjectItem
                observer={observer}
                key={id}
                title={title}
                src={src}
                tags={tags}
                delay={i % 2 ? true : false}
                id={id}
              />
            );
          })}
        </div>
      </div>
    </ElementWithCursor>
  );
};

interface ProjectItemProps {
  title: string;
  tags: string[];
  src: string;
  observer: ObserveFn;
  delay?: boolean;
  id: string | number;
}
const ProjectItem = ({ src, tags, title, observer, delay, id }: ProjectItemProps) => {
  const [show, setShow] = useState(false);
  const { ref } = useOnIntersect(
    observer,
    function (e) {
      if (e.isIntersecting) setShow(true);
    },
    { onceOnly: true }
  );
  return (
    <ElementWithCursor
      variant={CursorVariant.Project}
      theme={CursorStyle.Primary}
      className={styles.list__item_2}
      backable
    >
      <Link className={styles.project} href={Routers.PROJECT_DETAIL(id)}>
        <div className={styles.project__container}>
          <div className={styles.project__content}>
            <div className={styles.project__title}>{title}</div>
            <ol className={styles.project__tags}>
              {tags.map((tag) => {
                return (
                  <li className={styles.project__tag} key={tag}>
                    {tag.toLowerCase()}
                  </li>
                );
              })}
            </ol>
          </div>
          <div className={styles.project__thumnail}>
            <img ref={ref} src={src} alt={title} />
            <div
              className={clsx(
                show ? "h-0" : "h-full",
                delay && "delay-200",
                "transition-all duration-1000 w-full bg-black absolute top-0 ease-out"
              )}
            ></div>
          </div>
        </div>
      </Link>
    </ElementWithCursor>
  );
};

export default SectionListProjects;
