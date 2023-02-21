import React from "react";
import Lottie from "react-lottie";

export type LottieCustomProps = {
  elRef?: React.ForwardedRef<Lottie>;
  autoplay?: boolean;
  loop?: boolean;
};
