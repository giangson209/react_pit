import ButtonGhostTertiary from "@components/buttons/ButtonGhostTertiary";
import { ButtonSize } from "@components/buttons/enum";
import IconLink from "@components/icons/IconLink";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useState } from "react";

import styles from "styles/Home.module.scss";

const LottieHeroBannerOne = dynamic(() => import("@components/lottie/LottieHeroBannerOne"), {
  ssr: false,
});
const LottieHeroBannerTwo = dynamic(() => import("@components/lottie/LottieHeroBannerTwo"), {
  ssr: false,
});

type Props = {
  isDark?: boolean;
  onMouseEnterImage?(): void;
  onMouseLeaveImage?(): void;
} & JSX.IntrinsicElements["div"];

const HeroBanner = ({ isDark, ...rest }: Props) => {
  const [isPaused, setIsPaused] = useState(isDark);
  return (
    <div className={clsx(styles.bannerContainer, styles.hasAnimation)}>
      <div
        className={styles.bannerImage}
        onAnimationEnd={isDark ? () => setIsPaused(false) : undefined}
        {...rest}
      >
        {isDark ? <LottieHeroBannerTwo isPaused={isPaused} /> : <LottieHeroBannerOne />}
      </div>
      <div>
        <h2 className={styles.bannerTitle}>
          <span>Transforming</span>
          <br />
          <span>Digital Product</span>
        </h2>
        <div className={styles.bannerInfo}>
          <div className={styles.bannerDescription}>Lets us help you do</div>
          <div className={styles.bannerService}>
            <span>UX/UI Design</span>
            <span>Web, App Development</span>
          </div>
        </div>
        <div className={styles.bannerWork}>
          <ButtonGhostTertiary
            ghostTertiaryProps={{
              id: "icon",
              style: { animationDelay: "1000ms" },
              className: "bg-primary-600",
            }}
            animation
            className="font-bold"
            size={ButtonSize.Small}
          >
            Work with Us
          </ButtonGhostTertiary>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
