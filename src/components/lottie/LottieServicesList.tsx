import React, { useRef, useState } from "react";
import Lottie from "react-lottie";

import data from "./Services-ServiceListFull.json";
import { LottieCustomProps } from "./type";

const LottieServicesList = (props: LottieCustomProps) => {
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

export default LottieServicesList;
