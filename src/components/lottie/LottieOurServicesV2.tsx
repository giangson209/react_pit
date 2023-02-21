import React, { useRef, useState } from "react";
import Lottie from "react-lottie";

import data from "./Home-OurServices-v2.json";
import { LottieCustomProps } from "./type";

export const markers = data.markers;

const LottieOurServicesV2 = (props: LottieCustomProps) => {
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
      isPaused
    />
  );
};

export default LottieOurServicesV2;
