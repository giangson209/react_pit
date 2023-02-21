import clsx from "clsx";
import React from "react";
import { ButtonSize, ButtonStyle } from "./enum";
import styles from "./Button.module.scss";
import { ButtonProps } from "./type";

type Props = ButtonProps<{
  border?: boolean;
}>;

/**
 * Button for icon only
 */
const ButtonCircular = React.forwardRef<HTMLButtonElement, Props>(function ButtonCircular(
  {
    size = ButtonSize.Medium,
    className,
    children,
    border,
    btnStyle = ButtonStyle.Primary,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      {...props}
      className={clsx(
        styles.btn__circular,
        size && styles[size],
        styles["btn__" + btnStyle],
        className
      )}
    >
      <span className={styles.btn__circular_icon}>{children}</span>
    </button>
  );
});

export default ButtonCircular;
