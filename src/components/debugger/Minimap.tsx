import dynamic from "next/dynamic";
const Minimap = dynamic(() => import("./MinimapInner"), { ssr: false });
export default Minimap;
