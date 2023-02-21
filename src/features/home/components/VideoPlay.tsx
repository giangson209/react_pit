import React, { useEffect, useRef, useState } from "react";
import Vimeo from "@vimeo/player";

type Props = {} & JSX.IntrinsicElements["iframe"];

const VideoPlay = ({ ...rest }: Props) => {
  const [iframe, setIframe] = useState<HTMLDivElement | null>();
  useEffect(() => {
    if (!iframe) return;
    const player = new Vimeo(iframe, {
      id: 19231868,
      width: 640,
    });
  }, [iframe]);
  return <iframe ref={setIframe} {...rest} />;
};

export default VideoPlay;
