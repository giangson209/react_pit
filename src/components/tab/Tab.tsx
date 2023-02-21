import clsx from "clsx";
import React from "react";

import styles from "./Tab.module.scss";

type DefaultProps = { children: React.ReactNode; active?: boolean };
type Props = DefaultProps & React.HTMLAttributes<HTMLButtonElement>;

const Tab = ({ active, ...props }: Props) => {
  return <button {...props} className={clsx(styles.tab, active && styles.active)} />;
};

export default Tab;
