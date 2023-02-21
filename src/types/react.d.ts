/// <reference path="global.d.ts" />

import "react";
declare module "react" {
  export type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = ClassAttributes<T> &
    E & { test?: string };
}

import GUI from "lil-gui";
import { Logger } from "src/libs/logger";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mini-map": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }

  type test = 123;

  interface Window {
    _gui: GUI;
    object: any;
    logger: Logger;
  }

  var logger: Logger;

  module NodeJS {
    interface Global {
      logger: Logger;
    }
  }
  // namespace Window {
  //   export type gui = GUI;
  // }
}
