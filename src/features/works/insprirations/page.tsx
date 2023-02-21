import Head from "next/head";

// components
import CursorProvider from "@components/cursor/CursorContext";
import { PitStudio } from "pages/_app";
import MainHeader from "src/layouts/main/MainHeader";
import SectionFooter from "../../home/components/SectionFooter";
import SectionCover from "../components/SectionCover";
import SectionListShots from "../components/SectionListShots";

export default function Inspriration() {
  return (
    <CursorProvider>
      {/* <DebuggerFrontEnd /> */}
      <Head>
        <title>Pit Studio</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
      <main className={PitStudio.className}>
        <MainHeader data-mode="dark" />
        <SectionCover tabs={["ALL SHOTS", "ILLUSTRATION", "INTERACTION", "MOBILE", "WEB DESIGN"]} />
        <SectionListShots />
        <SectionFooter />
      </main>
    </CursorProvider>
  );
}
