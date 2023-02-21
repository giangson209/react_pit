import React, { useRef, useState } from "react";
import Lottie from "react-lottie";

import data from "./Services-Banner.json";
import { LottieCustomProps } from "./type";

const LottieServicesBanner = (props: LottieCustomProps) => {
  return (
    <Lottie
      ref={props.elRef}
      options={{
        animationData: data,
        loop: true,
        autoplay: true,
        rendererSettings: {
          preserveAspectRatio: "xMidYMax meet",
        },
      }}
      // isClickToPauseDisabled
      isPaused
    />
  );
};

export default LottieServicesBanner;
