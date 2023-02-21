import { CursorStyle, CursorVariant } from "@components/cursor/CursorDefault";
import ElementWithCursor from "@components/cursor/ElementWithCursor";
import clsx from "clsx";
import React from "react";

import data from "src/data/shots.json";
import styles from "./styles";

type Props = {};

const SectionListShots = (props: Props) => {
  return (
    <ElementWithCursor as="section" theme={CursorStyle.White}>
      <div className={clsx(styles.list__shot, "container")}>
        <div className={styles.list_container_3}>
          {data.map(({ tag, title }, id) => {
            return (
              <ElementWithCursor
                backable
                theme={CursorStyle.Primary}
                variant={CursorVariant.Project}
                key={id}
                className={styles.list__item_3}
              >
                <div className={styles.shot__item}>
                  <div className="flex flex-col h-full">
                    <div className={styles.shot__thumbnail}>
                      <img
                        src="/images/projects/hifpt_thumbnail.png"
                        className="h-full w-full object-cover"
                        alt="12"
                      />
                    </div>
                    <div className={styles.shot__content}>
                      <div className={styles.shot__title}>{title}</div>
                      <ol className={styles.shot__tags}>
                        <li>{tag}</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </ElementWithCursor>
            );
          })}
        </div>
      </div>
    </ElementWithCursor>
  );
};

export default SectionListShots;
