import clsx from "clsx";
import React from "react";

import styles from "./SliderDots.module.scss";

type Props = {
  total: number;
  active: number;
};

const SliderDots = (props: Props) => {
  const { total, active } = props;
  return (
    <div className={styles.dots}>
      {Array.from({ length: total }).map((_, id) => {
        return (
          <div key={id} className={styles.dot__container}>
            <div className={clsx(styles.dot, active === id && styles.active)} />
          </div>
        );
      })}
    </div>
  );
};

export default SliderDots;
