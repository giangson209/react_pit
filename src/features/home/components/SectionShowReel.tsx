import { useCursor } from "@components/cursor/CursorContext";
import { CursorStyle, CursorVariant } from "@components/cursor/CursorDefault";
import ElementWithCursor from "@components/cursor/ElementWithCursor";
import Parallax from "@components/parallax/Parallax";
import React, { useRef } from "react";
import { useOnIntersectRef } from "src/hooks/useIntersectionObserver";
import { useScrollSection } from "src/libs/ScrollFullPage";

import styles from "styles/Home.module.scss";
import { useObserverContext } from "../context/IntersectionObserverProvider";
import Showreel from "./Showreel";
type Props = {};

const SectionShowReel = (props: Props) => {
  return (
    <Parallax.Container
      as={ElementWithCursor}
      className={styles.sectionShowReel}
      theme={CursorStyle.Primary}
      variant={CursorVariant.PlayButton}
    >
      <Showreel />
    </Parallax.Container>
  );
};

export default SectionShowReel;
