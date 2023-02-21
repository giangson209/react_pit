export function getOffset(el: HTMLElement) {
  if (!el.hasAttribute("data-scroll-offset")) return null;
  const dataset = el.dataset as { scrollOffset: string };
  const offset = dataset.scrollOffset.split(",");
  return offset.map((v) =>
    v.includes("%") ? (el.clientHeight * parseInt(v, 10)) / 100 : Number(v)
  );
}

export function getTranslate(el: HTMLElement) {
  const translate: { x: number; y: number } = {} as any;
  if (!window.getComputedStyle) return { x: 0, y: 0 };

  const style = getComputedStyle(el);
  const transform = style.transform || style.webkitTransform || (style as any).mozTransform;

  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    translate.x = mat ? parseFloat(mat[1].split(", ")[12]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(", ")[13]) : 0;
  } else {
    mat = transform.match(/^matrix\((.+)\)$/);
    translate.x = mat ? parseFloat(mat[1].split(", ")[4]) : 0;
    translate.y = mat ? parseFloat(mat[1].split(", ")[5]) : 0;
  }
  return translate;
}

export type RangePosition = number | string | "top" | "bottom" | [number | string, number | string];
export function getRange(
  el: HTMLElement,
  options: {
    start?: RangePosition;
    end?: RangePosition;
  } = {}
) {
  const { start, end } = options;
  const bcr = el.getBoundingClientRect();
  const top = bcr.top + scrollY;
  const bottom = bcr.bottom + scrollY;
  const vh = innerHeight;

  let startOffset = top;
  if (start === "top") startOffset = top;
  else if (start === "bottom") startOffset = bottom;
  else if (typeof start === "number") startOffset = top + start;
  else if (typeof start === "string" && start.endsWith("%")) {
    const percentage = parseFloat(start) / 100;
    startOffset = top + bcr.height * percentage;
  } else if (Array.isArray(start) && start.length === 2) {
    const [position, offset] = start;
    if (typeof position === "number") startOffset = top + position;
    else if (position === "top") startOffset = top;
    else if (position === "bottom") startOffset = bottom;
    if (typeof offset === "number") startOffset += offset;
    else if (typeof offset === "string" && offset.endsWith("%")) {
      const percentage = parseFloat(offset) / 100;
      startOffset += vh * percentage;
    }
  }

  let endOffset = bottom;
  if (end === "top") endOffset = top;
  else if (end === "bottom") endOffset = bottom;
  else if (typeof end === "number") endOffset = top + end;
  else if (typeof end === "string" && end.endsWith("%")) {
    const percentage = parseFloat(end) / 100;
    endOffset = top + bcr.height * percentage;
  } else if (Array.isArray(end) && end.length === 2) {
    const [position, offset] = end;
    if (typeof position === "number") endOffset = top + position;
    else if (position === "top") endOffset = top;
    else if (position === "bottom") endOffset = bottom;
    if (typeof offset === "number") endOffset += offset;
    else if (typeof offset === "string" && offset.endsWith("%")) {
      const percentage = parseFloat(offset) / 100;
      endOffset += vh * percentage;
    }
  }

  return { top: startOffset, bottom: endOffset, root: { top, bottom } };
}
