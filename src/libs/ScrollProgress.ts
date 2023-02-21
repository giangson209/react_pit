import { off, on } from "@utils/listener";
import { EventEmitter } from "src/libs/eventEmiiter";
import { getRange, RangePosition } from "src/libs/scroll/utils";

export class ScrollProgress extends EventEmitter<
  "enter" | "scroll" | "leave" | "leaveBack" | "enterBack"
> {
  public element: HTMLElement;
  public data = { top: 0, bottom: 0, root: { top: 0, bottom: 0 } };

  public options = {};

  public isStarted = false;
  public isEnded = false;

  constructor(element: HTMLElement, options: { start?: RangePosition; end?: RangePosition } = {}) {
    super();
    this.element = element;
    this.options = options;

    this._unbindEvents = this._unbindEvents.bind(this);
    this._handleScroll = this._handleScroll.bind(this);
    this._handleResize = this._handleResize.bind(this);
    this.destroy = this.destroy.bind(this);
  }
  init() {
    this._handleResize();
    this._handleScroll();
    this._bindEvents();
  }
  destroy() {
    this._unbindEvents();
  }

  _bindEvents() {
    on(window, "resize", this._handleResize);
    on(window, "scroll", this._handleScroll);
  }
  _unbindEvents() {
    off(window, "resize", this._handleResize);
    off(window, "scroll", this._handleScroll);
  }
  _handleResize() {
    Object.assign(this.data, getRange(this.element, this.options));
  }
  _handleScroll() {
    if (!this.element) return;
    const y = scrollY;
    // const vh = innerHeight;

    const range = this.data;
    const limit = range.bottom - range.top;
    const distance = Math.min(limit, Math.max(0, range.bottom - y));

    let progress;
    if (distance >= limit) {
      progress = 0;
      this._onLeave(progress);
    } else if (distance <= 0) {
      progress = 1;
      this._onLeave(progress);
    } else {
      progress = 1 - distance / limit;
      this._onEnter();
    }

    this.emit("scroll", progress);
  }

  _onEnter() {
    if (!this.isStarted) this.emit("enter"), (this.isEnded = false);
    else if (this.isEnded) this.emit("enterBack"), (this.isEnded = false);
    this.isStarted = true;
  }

  _onLeave(progress: number) {
    if (!progress) this.emit("leaveBack"), ((this.isEnded = false), (this.isStarted = false));
    else this.emit("leave"), (this.isEnded = true);
  }
}
