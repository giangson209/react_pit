import { forwardRef } from "react";
import Lottie from "react-lottie";

import data from "./Home-OurHighlight.json";
import { LottieCustomProps } from "./type";

const LottieOurHightLight = forwardRef<Lottie, LottieCustomProps>(function LottieOurHightLight(
  props,
  ref
) {
  return (
    <Lottie
      ref={props.elRef}
      options={{
        animationData: data,
        loop: false,
        autoplay: false,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      }}
      isPaused
      isClickToPauseDisabled
      speed={0.5}
    />
  );
});

export default LottieOurHightLight;
