import React, { useRef, useState } from "react";
import Lottie from "react-lottie";

import data from "./Home-OurServices-v2.json";
import { LottieCustomProps } from "./type";

export const TOTAL_FRAMES = 1796;

const LottieOurServices = (props: LottieCustomProps) => {
  return (
    <Lottie
      ref={props.elRef}
      options={{
        animationData: data,
        loop: false,
        autoplay: false,
        rendererSettings: {
          preserveAspectRatio: "xMidYMax meet",
        },
      }}
      isClickToPauseDisabled
      isPaused
    />
  );
};

export default LottieOurServices;
