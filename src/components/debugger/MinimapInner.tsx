import { off, on } from "@utils/listener";
import { useEffect, useState } from "react";

import styles from "./Minimap.module.scss";

type Props = {};
const mapWidth = 180;
const Minimap = (props: Props) => {
  const [height, setHeight] = useState(0);
  const [y, setY] = useState(0);
  const [pointerHeight, setPointerHeight] = useState(0);
  const [containerY, setContainerY] = useState(0);

  useEffect(() => {
    const target = "main";
    let mapContainer: HTMLElement | null;
    if (!target || !(mapContainer = document.getElementById(target)))
      return console.warn(`[Minimap] - No target detected`);
    const {
      height: containerHeight,
      width: containerWidth,
      top: containerTop,
    } = mapContainer.getBoundingClientRect();

    // const element = document.getElementById("__next");

    const scrollY = window.scrollY;
    const topScrollBorder = containerTop + scrollY;

    const { width, height } = getViewportSize();

    const windowAspectRatio = height / width;
    const containerAspectRatio = containerHeight / containerWidth;
    const mapHeight = Math.floor(mapWidth * containerAspectRatio);
    setHeight(mapHeight);

    const pointerHeight = (mapWidth + 2) * windowAspectRatio * (width / containerWidth);

    setPointerHeight(pointerHeight);
    setPointerPosition(scrollY);
    function handleScroll() {
      setPointerPosition(window.scrollY);
    }
    on(window, "scroll", handleScroll, { passive: true });

    function setPointerPosition(scrollY: number) {
      const pixelsScrolledIntoMain = scrollY - topScrollBorder;
      const scrolledIntoRatio = pixelsScrolledIntoMain / containerHeight;
      const transform = Math.floor(scrolledIntoRatio * mapHeight);

      if (scrolledIntoRatio > 0 && transform < mapHeight - pointerHeight + 16) {
        setY(transform);
      }

      const transformContainer =
        scrolledIntoRatio * mapHeight + pointerHeight * 2 - getViewportSize().height;
      if (transformContainer > 0) {
        setContainerY(-transformContainer);
      }
    }
    function setContainerPosition() {}
    function getViewportSize(el?: HTMLElement) {
      return window.visualViewport!;
    }
    return () => {
      off(window, "scroll", handleScroll, { passive: true });
    };
  }, []);

  return (
    <mini-map>
      <div className="fixed top-0 right-0 z-10 border-l-neutral-500 border-l">
        <div className="screen-image" style={{ transform: `translateY(${containerY}px)` }}>
          <div
            className={styles.pointer}
            style={{ height: pointerHeight, transform: `translateY(${y}px)` }}
          ></div>
          <div
            className="canvas"
            style={{
              width: mapWidth,
              height,
              background: "white -moz-element(#main) no-repeat scroll center center / contain",
            }}
          ></div>
        </div>
      </div>
    </mini-map>
  );
};
class ClassMiniMap extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define("mini-map", ClassMiniMap);
export default process.env.NEXT_PUBLIC_DEBUG ? Minimap : () => null;
