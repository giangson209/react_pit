import IconChevronLeft from "@components/icons/IconChevronLeft";
import IconLink from "@components/icons/IconLink";
import IconPlay from "@components/icons/IconPlay";
import clsx from "clsx";
import React from "react";

import styles from "./Cursor.module.scss";

export enum CursorVariant {
  Default = "0",
  Text = "1",
  PlayButton = "2",

  Video = "3",
  Project = "4",
  Drag = "5",
}

export enum CursorStyle {
  Primary = "primary",
  Dark = "dark",
  White = "white",
}

export const colorByStyle = {
  [CursorStyle.Primary]: "#13AF88",
  [CursorStyle.Dark]: "#181818",
  [CursorStyle.White]: "#FFFFFF",
};

type Props = {
  cursorVariant: CursorVariant;
  cursorStyle: CursorStyle;
  isActive?: boolean;
  text?: string;
};

const CursorDefault = (props: Props) => {
  const { cursorStyle, cursorVariant, isActive, text } = props;

  return cursorVariant === CursorVariant.Text ? (
    <div className="absolute" data-cursor="text">
      <div
        className={clsx(
          "text-center",
          cursorStyle === CursorStyle.White ? "text-neutral-900" : "text-neutral-0"
        )}
        dangerouslySetInnerHTML={{ __html: text! }}
      />
    </div>
  ) : cursorVariant === CursorVariant.PlayButton ? (
    <div className="absolute text-neutral-0" data-cursor="play">
      <IconPlay size={48} />
    </div>
  ) : cursorVariant === CursorVariant.Drag ? (
    <div
      key={"drager_" + cursorStyle}
      className={clsx(
        styles.draggerWrap,
        styles[cursorStyle],
        isActive ? styles.draggerDragging : ""
      )}
      data-cursor="drag"
      data-mode={cursorStyle}
    >
      <div className={styles.draggerHandle}>
        <IconChevronLeft />
      </div>
      <div>
        <div className={clsx(styles.draggerCenter, styles.draggerText)}>Drag</div>
        <div className={clsx(styles.draggerCenter, styles.draggerPoint)}></div>
      </div>
      <div className={clsx(styles.draggerHandle, "rotate-180")}>
        <IconChevronLeft />
      </div>
    </div>
  ) : cursorVariant === CursorVariant.Project ? (
    <div className="absolute text-neutral-0">
      <IconLink size={48} />
    </div>
  ) : null;
};

export default CursorDefault;
