import LottieServicesBanner from "@components/lottie/LottieServicesBanner";
import React from "react";

import styles from "./SectionCover.module.scss";

type Props = {};

const Path = () => {
  return (
    <ellipse
      cx="0"
      cy="0"
      rx="0.48923474959"
      ry="0.22565698254"
      transform="matrix(0.9612616896629333,-0.55982161168,0.13571457724,0.9612616896629333,0.49983017317,0.51259110325)"
    />
  );
};

const SectionCover = (props: Props) => {
  return (
    <section className="container">
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.heading}>
            <div className={styles.banner__container}>
              <div className={styles.banner__vid}>
                <video autoPlay loop>
                  <source src="https://s3-figma-videos-production-sig.figma.com/video/1003851600940201121/TEAM/c1a4/6700/-ba8a-4af1-b2a6-c0acfebe64ff?Expires=1678060800&Signature=BtMUbRMjuZlVmdeIXbW6DgBuy3E9clgYrtdPgudQ2PbCMBlxD~LxC2~gmT3FnOdDkPN7KY6i-Xturr2adt8A1ei-bC5NlEmFhoxq2BqBYau0Hw~-wusLzhShI6TLqNaxKKaE0Isj1E~1bIrbihRRr~pWwr8l1yvoaxsUkPqJroqtE-uCZhrMlD7vbkuD59JzENUe7UD4Pgcfkayct-E0uyEgTNV9uG4KvaM~OspaHBB6xZiUYvSoiA7~WlbbKoDk~lzUepCldgadtJ3VPXGWqxmhzF2nwkHER7ONK8sHke4AHrEE3jXW3NvJqR-ahHRhBGgrWi~ie3R2pRqExR3mFA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4" />
                </video>
              </div>
              <div className="absolute">
                <LottieServicesBanner />
              </div>
            </div>
            <h1>Services</h1>
          </div>
        </div>
        <p className={styles.desc}>
          Creativity, Technology, and Understanding are our things for you and your story is our
          inspiration
        </p>
      </div>
      <div className="relative z-10 h-0">
        <svg width={0} height={0} viewBox="0 0 1048 516">
          <clipPath id="clipPath" clipPathUnits="objectBoundingBox">
            <Path />
          </clipPath>
        </svg>
      </div>
    </section>
  );
};

export default SectionCover;
