import "../styles/globals.scss";
import type { AppProps } from "next/app";
import localFont from "@next/font/local";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import "src/libs/logger/global";

gsap.registerPlugin(ScrollTrigger);
export const PitStudio = localFont({
  src: [
    {
      path: "../src/fonts/AeonikPro/AeonikPro-Air.otf",
      weight: "50",
      style: "normal",
    },
    { path: "../src/fonts/AeonikPro/AeonikPro-AirItalic.otf", weight: "50", style: "italic" },

    { path: "../src/fonts/AeonikPro/AeonikPro-Light.otf", weight: "100", style: "normal" },
    { path: "../src/fonts/AeonikPro/AeonikPro-LightItalic.otf", weight: "100", style: "italic" },

    { path: "../src/fonts/AeonikPro/AeonikPro-Thin.otf", weight: "300", style: "normal" },
    { path: "../src/fonts/AeonikPro/AeonikPro-ThinItalic.otf", weight: "300", style: "italic" },

    { path: "../src/fonts/AeonikPro/AeonikPro-Regular.otf", weight: "400", style: "normal" },
    { path: "../src/fonts/AeonikPro/AeonikPro-RegularItalic.otf", weight: "400", style: "italic" },

    { path: "../src/fonts/AeonikPro/AeonikPro-Medium.otf", weight: "500", style: "normal" },
    { path: "../src/fonts/AeonikPro/AeonikPro-MediumItalic.otf", weight: "500", style: "italic" },

    { path: "../src/fonts/AeonikPro/AeonikPro-Bold.otf", weight: "800", style: "normal" },
    { path: "../src/fonts/AeonikPro/AeonikPro-BoldItalic.otf", weight: "800", style: "italic" },

    { path: "../src/fonts/AeonikPro/AeonikPro-Black.otf", weight: "900", style: "normal" },
    { path: "../src/fonts/AeonikPro/AeonikPro-BlackItalic.otf", weight: "900", style: "italic" },
  ],
  display: "swap",
  variable: "--pit-studio",
  declarations: [{ prop: "ascent-override", value: "95%" }],
});
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
