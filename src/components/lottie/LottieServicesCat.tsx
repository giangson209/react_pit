import React, { useRef, useState } from "react";
import Lottie from "react-lottie";

import data from "./Services-Cat.json";
import { LottieCustomProps } from "./type";

const LottieServicesCat = (props: LottieCustomProps) => {
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
      isClickToPauseDisabled
      isPaused
    />
  );
};

export default LottieServicesCat;
