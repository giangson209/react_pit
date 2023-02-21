import { off, on } from "@utils/listener";
import anime from "animejs";
import { EventEmitter } from "../eventEmiiter";

type EventListener = (y: number) => void;
export class SiteScroll {
  private _listeners: Set<EventListener>;

  constructor() {
    this._listeners = new Set();
  }

  public init() {}

  public on(fn: EventListener) {
    if ("function" != typeof fn)
      throw new TypeError("[Scroll] scrolling listener should be a function");
    this._listeners.add(fn);
  }
}
