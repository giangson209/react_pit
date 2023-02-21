import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";

type Props = { src: string };
const cacheSource = new Map<string, any>();

const RenderLottie = (props: Props) => {
  const [data, setData] = useState();
  useEffect(() => {
    import(props.src).then((data) => setData(data));
  }, [props.src]);
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
    />
  );
};

export default RenderLottie;
