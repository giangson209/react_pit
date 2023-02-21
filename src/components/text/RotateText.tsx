import clsx from "clsx";
import React from "react";
import { CustomElement, CustomElementProps, ReactTag } from "src/types/element.d";
import styles from "./RotateText.module.scss";

type Props = {
  hover?: boolean;
  active?: boolean;
  rotate?: boolean;
  rotateDirect?: "up" | "down";
  onceOnly?: boolean;
};

const RotateText = <T extends ReactTag>({
  as: E,
  children,
  hover = true,
  active,
  rotateDirect,
  rotate,
  onceOnly,
  ...rest
}: React.PropsWithChildren<CustomElementProps<T, Props>>) => {
  const Element = E || "div";

  const [text1, text2, text3] = Array.isArray(children) ? children : [children, children];
  return (
    <Element
      {...rest}
      className={clsx(styles.container, rest.className, {
        [styles.hover]: hover,
        [styles.active]: active,
        [styles.rotate]: rotate,
        [styles["rotate__" + rotateDirect]]: rotateDirect,
      })}
    >
      <span className={styles.items}>
        {onceOnly ? (
          <span>{children}</span>
        ) : (
          <>
            <span>{text1}</span>
            <span>{text2}</span>
            {text3 && <span>{text2}</span>}
          </>
        )}
      </span>
    </Element>
  );
};

export default RotateText;
