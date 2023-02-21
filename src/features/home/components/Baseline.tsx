import clsx from "clsx";
import React from "react";

import styles from "./Baseline.module.scss";

type Props = {
  vertical?: boolean;
  position?: "left" | "right";
  className?: string;
};

const Baseline = React.forwardRef(function Baseline(
  props: Props,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={clsx(
        props.vertical ? styles.vertical : styles.horizontal,
        props.position === "right" ? "right-0" : "left-0",
        props.className
      )}
    />
  );
});

export default Baseline;
