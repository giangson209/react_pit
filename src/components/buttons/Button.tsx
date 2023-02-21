import clsx from "clsx";
import React from "react";

import styles from "./Button.module.scss";

type Props = {};

const Button = ({ ...rest }: Props) => {
  return <button className={clsx(styles.button)} {...rest} />;
};

export default Button;
