import anime from "animejs";

const ANIME_ARGS = { translateY: ["130%", "0%"], rotateX: ["-40deg", 0], opacity: [0, 1] };

type AnimeShowOptions = {
  delay: number;
};
/**
 * Container of element must have style property `perspective` to show rotate 3d
 *
 * @example
 * function(){
 *  return <div style={{perspective:100}}>
 *   <p>This is a sample</p>
 *  </div>
 * }
 */
class AnimeShow {
  public animetl!: anime.AnimeTimelineInstance;

  private _options: AnimeShowOptions = { delay: 100 };
  constructor(options?: Partial<AnimeShowOptions>) {
    options && Object.assign(this._options, options);
    this.init();
  }
  init() {
    this.animetl = anime.timeline({
      easing: "easeOutExpo",
      duration: 1000,
      autoplay: false,
      delay: this._options.delay,
    });
    return this.animetl;
  }

  destroy() {
    this.animetl.pause();
  }

  add(el: HTMLElement | NodeListOf<ChildNode> | Element | null, options?: AnimeShowOptions) {
    this.animetl.add(
      { targets: el, ...ANIME_ARGS },
      options?.delay ? this._options.delay + options.delay : this._options.delay
    );
  }
  play() {
    this.animetl.play();
  }
}
export { AnimeShow };
