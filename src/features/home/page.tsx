import Head from "next/head";
import { PitStudio } from "pages/_app";
import gsap from "gsap";
import { CustomSplitText } from "src/libs/SplitText";

// components
import CursorProvider from "@components/cursor/CursorContext";
import SectionFooter from "./components/SectionFooter";
import SectionHero from "./components/SectionHero";
import SectionOurHightLightProject from "./components/SectionOurHightLightProject";
import SectionOurServices from "./components/SectionOurServices";
import SectionProducts from "./components/SectionProducts";
import SectionShowReel from "./components/SectionShowReel";

import ScrollFullPageProvider from "src/libs/ScrollFullPage";
import Script from "next/script";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomSplitText);
}

export default function Home() {
  return (
    <CursorProvider>
      {/* <DebuggerFrontEnd /> */}
      <Head>
        <title>Pit Studio</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script src="/svguse.js" />
      <style jsx global>
        {`
          /* Hide scrollbar for Chrome, Safari and Opera */
          ::-webkit-scrollbar,
          #main::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for IE, Edge and Firefox */
          * {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        `}
      </style>
      <ScrollFullPageProvider as="main" className={PitStudio.className} id="main">
        {/* <Cubic /> */}
        <SectionHero /> {/* Scroll index = 0 */}
        <SectionShowReel />
        {/* Scroll index = 1 */}
        <SectionOurHightLightProject />
        {/* Scroll index = 2,3,4 */}
        <SectionProducts />
        {/* Scroll index = 5,6,7 */}
        <SectionOurServices />
        {/* <SectionFooter withParallax /> */}
      </ScrollFullPageProvider>
    </CursorProvider>
  );
}