import React, { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";

import dataPreload from "./Home-HeroBanner-2.json";
import dataLoaded from "./Home-HeroBanner-2.1.json";

type Props = {
  isPaused?: boolean;
};

const LottieHeroBannerTwo = (props: Props) => {
  const ref = useRef<Lottie>(null);
  const [isReady, setIsReady] = useState(false);

  return (
    <Lottie
      ref={ref}
      options={{
        animationData: isReady ? dataLoaded : dataPreload,
        loop: isReady,
        autoplay: true,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      }}
      isPaused={props.isPaused}
      isClickToPauseDisabled
      eventListeners={[
        {
          eventName: "complete",
          callback() {
            setIsReady(true);
          },
        },
      ]}
    />
  );
};

export default LottieHeroBannerTwo;
