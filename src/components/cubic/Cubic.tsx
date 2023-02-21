import clsx from "clsx";
import React from "react";
import styles from "./Cubic.module.scss";

type Props = {};

const Cubic3D = (props: Props) => {
  return (
    <div className={styles.container}>
      <span className={styles.items}>
        <span className={clsx(styles.cube__face, styles.cube__face_front)}>front</span>
        {/* <span className={clsx(styles.cube__face, styles.cube__face_back)}>back</span> */}
        {/* <span className={clsx(styles.cube__face, styles.cube__face_right)}>right</span>
        <span className={clsx(styles.cube__face, styles.cube__face_left)}>left</span> */}
        <span className={clsx(styles.cube__face, styles.cube__face_top)}>top</span>
        <span className={clsx(styles.cube__face, styles.cube__face_bottom)}>bottom</span>
      </span>
    </div>
  );
};

export default Cubic3D;
