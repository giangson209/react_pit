import React, { useRef, useState } from "react";
import Lottie from "react-lottie";

import data from "./Services-ServiceFlax.json";
import { LottieCustomProps } from "./type";

const LottieServicesFlax = (props: LottieCustomProps) => {
  return (
    <Lottie
      ref={props.elRef}
      options={{
        animationData: data,
        loop: true,
        autoplay: true,
        rendererSettings: {
          preserveAspectRatio: "xMidYMax slice",
        },
      }}
      isClickToPauseDisabled
      isPaused
    />
  );
};

export default LottieServicesFlax;
