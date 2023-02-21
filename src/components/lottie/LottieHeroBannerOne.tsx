import React from "react";
import Lottie from "react-lottie";

import data from "./Home-HeroBanner-1.json";

type Props = {};

const LottieHeroBannerOne = (props: Props) => {
  return (
    <Lottie
      options={{
        animationData: data,
        loop: true,
        autoplay: true,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      }}
      isClickToPauseDisabled
      speed={0.5}
    />
  );
};

export default LottieHeroBannerOne;
