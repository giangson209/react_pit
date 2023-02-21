import clsx from "clsx";
import React, { useEffect, useState } from "react";
import styles from "./LoadingOverlay.module.scss";

type Props = {
  isDark?: boolean;
};

const LoadingOverlay = (props: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => setIsVisible(false));
  }, []);

  return (
    <div
      className={clsx(styles.loader, isVisible && styles.visible, props.isDark && styles.dark)}
    />
  );
};

export default LoadingOverlay;
