import clsx from "clsx";
import React from "react";
import { ButtonSize } from "./enum";
import styles from "./Button.module.scss";
import { ButtonProps } from "./type";

type Props = ButtonProps<{
  ghostTertiaryProps?: JSX.IntrinsicElements["div"];
  animation?: boolean;
}>;

const ButtonGhostTertiary = ({
  size = ButtonSize.Medium,
  className,
  children,
  ghostTertiaryProps,
  animation,
  ...props
}: Props) => {
  const classStyle = size && styles[size];
  return (
    <button
      {...props}
      className={clsx(styles.button, classStyle, styles.ghost__tertiary_container, className)}
    >
      <span className="pl-4">{children}</span>
      <div
        {...ghostTertiaryProps}
        className={clsx(
          styles.ghost__tertiary,
          animation && styles.ghost__tertiary_animation,
          ghostTertiaryProps?.className
        )}
      >
        <div className={clsx(styles.button, classStyle, className)}>
          <span className="pl-4">{children}</span>
        </div>
      </div>
    </button>
  );
};

export default ButtonGhostTertiary;
