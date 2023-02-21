/// <reference path="node_modules/.pnpm/@types+react-lottie@1.2.6/node_modules/@types/react-lottie/index.d.ts" />
// import * as React from "react";

/**
 * Lottie allows you to render an animation from a JSON structure exported from Adobe After Effects using the Bodymovin plugin
 */

declare module "react-lottie" {
  interface Anim {
    // _cbs: Array []
    // _completedLoop: boolean
    // _idle: boolean
    animType: "svg";
    // animationData: Object { v: "4.8.0", fr: 60, ip: 240, … }
    animationID: string;
    assets: any[];
    assetsPath?: undefined;
    // audioController: Object { audios: [], _volume: 1, _isMuted: false, … }
    autoloadSegments: boolean;
    autoplay: boolean;
    configAnimation: AnyToVoidFunction;
    currentFrame: number;
    currentRawFrame: number;
    // drawnFrameEvent: Object { type: "drawnFrame", currentTime: 0, totalTime: 0, … }
    firstFrame: number;
    frameModifier: number;
    frameMult: number;
    frameRate: number;
    // imagePreloader: Object { totalImages: 0, totalFootages: 0, loadedAssets: 0, … }
    initialSegment: undefined;
    isLoaded: boolean;
    isPaused: boolean;
    isSubframeEnabled: boolean;
    loop: boolean;
    markers: { time: number; duration: number; payload: number }[];
    name: string;
    onSegmentComplete: AnyToVoidFunction;
    onSetupError: AnyToVoidFunction;
    goToAndStop: AnyToVoidFunction;
    path: string;
    playCount: number;
    playDirection: number;
    playSpeed: number;
    // projectInterface: function _thisProjectFunction(name)​
    // renderer: Object { animationItem: {…}, renderedFrame: 302.985482, destroyed: false, … }
    segmentPos: number;
    segments: Array<any>;
    timeCompleted: number;
    totalFrames: number;
    wrapper: HTMLElement;
  }

  export interface Options {
    /**
     * Defines if the animation should play only once or repeatedly in an endless loop
     * or the number of loops that should be completed before the animation ends
     */
    loop?: boolean | number | undefined;
    /**
     * Defines if the animation should immediately play when the component enters the DOM
     */
    autoplay?: boolean | undefined;
    /**
     * The JSON data exported from Adobe After Effects using the Bodymovin plugin
     */
    animationData: any;
    rendererSettings?:
      | {
          preserveAspectRatio?: string | undefined;
          /**
           * The canvas context
           */
          context?: any;
          scaleMode?: any;
          clearCanvas?: boolean | undefined;
          /**
           * Loads DOM elements when needed. Might speed up initialization for large number of elements. Only with SVG renderer.
           */
          progressiveLoad?: boolean | undefined;
          /**
           * Hides elements when opacity reaches 0. Only with SVG renderer.
           * @default boolean
           */
          hideOnTransparent?: boolean | undefined;
          className?: string | undefined;
        }
      | undefined;
  }

  export interface EventListener {
    /**
     * The event sent by Lottie
     */
    eventName:
      | "complete"
      | "loopComplete"
      | "enterFrame"
      | "segmentStart"
      | "config_ready"
      | "data_ready"
      | "loaded_images"
      | "DOMLoaded"
      | "destroy";
    /**
     * A callback that will be executed when the given eventName is received
     */
    callback: () => void;
  }

  export interface LottieProps {
    /**
     * Object representing animation settings
     */
    options: Options;
    /**
     * Height size in pixels
     * @default '100%'
     */
    height?: number | string | undefined;
    /**
     * Width size in pixels
     * @default '100%'
     */
    width?: number | string | undefined;
    /**
     * Describes if the animation must be in stopped mode
     */
    isStopped?: boolean | undefined;
    /**
     * Describes if the animation must be in paused mode
     */
    isPaused?: boolean | undefined;
    /**
     * Array of objects containing eventName and a callback function that will be registered as eventListeners on the animation object.
     * Refer to Lottie documentation for a list of available events.
     */
    eventListeners?: ReadonlyArray<EventListener> | undefined;
    segments?: ReadonlyArray<number> | undefined;
    speed?: number | undefined;
    direction?: number | undefined;
    ariaRole?: string | "button" | undefined;
    ariaLabel?: string | "animation" | undefined;
    isClickToPauseDisabled?: boolean | undefined;
    title?: string | undefined;
    style?: React.CSSProperties | undefined;
  }
  export default class Lottie extends React.Component<LottieProps, any> {
    anim: Anim;
  }
}
