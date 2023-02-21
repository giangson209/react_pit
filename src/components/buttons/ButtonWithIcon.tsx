import clsx from "clsx";
import React from "react";
import { ButtonSize } from "./enum";
import styles from "./Button.module.scss";
import { ButtonProps } from "./type";
import { CustomElementProps, ReactTag } from "src/types/element.d";

type Props = ButtonProps<{
  IconLeading?: React.ElementType | React.ReactNode;
  IconTrail?: React.ElementType | React.ReactNode;
  border?: boolean;
}>;

const ButtonWithIcon = <T extends ReactTag>({
  as: E,
  size = ButtonSize.Medium,
  className,
  children,
  IconLeading,
  IconTrail,
  btnStyle,

  border,
  fill,
  ...props
}: CustomElementProps<T, Props>) => {
  const Element = E || "button";
  return (
    <Element
      {...props}
      className={clsx(
        styles.btn__icon,
        styles["btn__" + btnStyle],
        size && styles[size],
        border && styles.default_outline,
        fill && styles.fill,
        className
      )}
    >
      {typeof IconLeading === "function" ? (
        <span className={styles.btn__icon_left}>
          <IconLeading />
        </span>
      ) : (
        IconLeading && <span className={styles.btn__icon_left}>{IconLeading}</span>
      )}
      {children}
      {typeof IconTrail === "function" ? (
        <span className={styles.btn__icon_right}>
          <IconTrail />
        </span>
      ) : (
        IconTrail && <span className={styles.btn__icon_right}>{IconTrail}</span>
      )}
    </Element>
  );
};

export default ButtonWithIcon;
