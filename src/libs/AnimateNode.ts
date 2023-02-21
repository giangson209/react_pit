const DEL = "DEL_CURSOR";
let mutations: MutationObserver, root: HTMLElement;

/**
 * Animations that are currently running.
 */
const animations = new WeakMap<Element, Animation>();

const preExists = new Set<Element>();
/**
 * Siblings of elements that have been removed from the dom.
 */
const siblings = new WeakMap<Element, [prev: Node | null, next: Node | null]>();

const getElements = (mutations: MutationRecord[], observer: MutationObserver) => {
  const observedNodes = mutations.reduce((nodes: Node[], mutation) => {
    return [...nodes, ...Array.from(mutation.addedNodes), ...Array.from(mutation.removedNodes)];
  }, []);

  return mutations.reduce((elements: Set<Element> | false, mutation) => {
    if (elements === false) return false;
    if (!(mutation.target instanceof Element)) return elements;
    if (!elements.has(mutation.target)) {
      // elements.add(mutation.target);
      for (let i = 0; i < mutation.target.children.length; i++) {
        const child = mutation.target.children.item(i);
        if (!child) continue;
        if (DEL in child) return false;
        // target(mutation.target, child);
        elements.add(child);
      }
      if (mutation.removedNodes.length) {
        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const child = mutation.removedNodes[i];
          if (DEL in child) return false;
          if (child instanceof Element) {
            elements.add(child);
            // target(mutation.target, child);
            siblings.set(child, [mutation.previousSibling, mutation.nextSibling]);
          }
        }
      }
    }
    return elements;
  }, new Set<Element>());
};
if (typeof window !== "undefined") {
  root = document.documentElement;
  mutations = new MutationObserver(getElements);
  // mutations.observe(containerRef.current, { childList: true });
  // return () => mutations.disconnect();
}

export type EventType = "add" | "remove" | "finish";
export class AnimateNode {
  public container: Node;
  public mutations: MutationObserver;
  public config: { duration: number } = { duration: 150 };

  private eventControllers = new Map<"add" | "remove", Set<Function>>();

  constructor(container: Node) {
    this.container = container;
    this.mutations = new MutationObserver(this.handleMutations);
    this.init();
  }
  private init() {
    this.mutations.observe(this.container, { childList: true });
  }

  private handleMutations = (mutations: MutationRecord[], observer: MutationObserver) => {
    const elements = getElements(mutations, observer);
    if (elements) elements.forEach(this.animate);
  };

  public disconect() {
    this.mutations.disconnect();
  }

  private animate = (el: Element) => {
    const isMounted = root.contains(el);
    const preExisting = preExists.has(el);
    if (isMounted && preExisting) {
      // Already mounted
    } else if (!isMounted && preExisting) {
      // Remove element
      this.remove(el);
    } else {
      // Add element
      this.add(el);
    }
  };
  /**
   * Add element
   * @TODO
   * - add element to dom,
   * - add animation show up (fade in and scale in)
   */
  private add(el: Element) {
    if (preExists.has(el)) return;
    preExists.add(el);

    let animation: Animation;
    animation = el.animate(
      [
        { transform: "scale(0.5)", opacity: 0 },
        { transform: "scale(0.5)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 },
      ],
      { duration: this.config.duration, easing: "ease-out" }
    );
    animations.set(el, animation);
    animation.play();
    const e = this;
    this.getListeners("add")?.forEach((fn) => fn.bind(e)(el));
  }
  /**
   * Add element
   * @TODO
   * - add element to dom,
   * - add animation show up (fade in and scale in)
   */
  private remove(el: Element) {
    const e = this;
    this.getListeners("remove")?.forEach((fn) => fn.bind(e)(el));
    if (!siblings.has(el) || !preExists.has(el)) return;
    const [prev, next] = siblings.get(el)!;
    Object.defineProperty(el, DEL, { value: true });
    if (next && next.parentNode && next.parentNode instanceof Element) {
      // Clone element to prev parent
      next.parentNode.insertBefore(el, next);
    } else if (prev && prev.parentNode) {
      prev.parentNode.appendChild(el);
    } else {
      this.container.appendChild(el);
    }

    let animation: Animation;

    function cleanUp() {
      el.remove();
      preExists.delete(el);
    }
    animation = el.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(0.5)", opacity: 0 },
      ],
      { duration: this.config.duration, easing: "ease-out" }
    );

    animations.set(el, animation);
    animation.play();
    animation.addEventListener("finish", cleanUp);
  }

  public getListeners(type: "add" | "remove") {
    return this.eventControllers.get(type);
  }

  public addEventListener(type: "add" | "remove", fn: (this: this, el: Element) => void) {
    this.eventControllers.has(type) || this.eventControllers.set(type, new Set());
    this.eventControllers.get(type)?.add(fn);
    return () => this.eventControllers.get(type)?.delete(fn);
  }

  public removeEventListener(type: "add" | "remove", fn: (this: this, el: Element) => void) {
    this.eventControllers.get(type)?.delete(fn);
  }
}
