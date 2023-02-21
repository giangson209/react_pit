import LottieServicesCat from "@components/lottie/LottieServicesCat";
import LottieServicesFlax from "@components/lottie/LottieServicesFlax";
import React from "react";

import styles from "./SectionBenefit.module.scss";
type Props = {};

const SectionBenefit = (props: Props) => {
  return (
    <section className={styles.container}>
      <div className="relative w-full min-h-[100%] h-screen">
        <div className="absolute top-0 left-0 w-full h-full">
          <LottieServicesCat />
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <LottieServicesFlax />
        </div>
      </div>
    </section>
  );
};

export default SectionBenefit;
