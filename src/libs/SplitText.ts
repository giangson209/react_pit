// @ts-nocheck
// import { default as SplitText } from "gsap/SplitText";

function defineProperty(t, e) {
  for (var n = 0; n < e.length; n++) {
    var i = e[n];
    (i.enumerable = i.enumerable || !1),
      (i.configurable = !0),
      "value" in i && (i.writable = !0),
      Object.defineProperty(t, i.key, i);
  }
}
function Gh(t: any) {
  return (Gh =
    "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
      ? function (t: any) {
          return typeof t;
        }
      : function (t: { constructor: SymbolConstructor & Function }) {
          return t &&
            "function" == typeof Symbol &&
            t.constructor === Symbol &&
            t !== Symbol.prototype
            ? "symbol"
            : typeof t;
        })(t);
}
var Kh: number,
  Jh = /(?:\r|\n|\t\t)/g,
  tf = /(?:\s\s+)/g,
  isArray = Array.isArray,
  rf = [].slice,
  getElements = function (elements: any, e?: undefined) {
    var n;
    return isArray(elements)
      ? elements
      : "string" === (n = Gh(elements)) && !e && elements
      ? rf.call(document.querySelectorAll(elements), 0)
      : elements && "object" === n && "length" in elements
      ? rf.call(elements, 0)
      : elements
      ? [elements]
      : [];
  },
  sf = function (t: { position: string; absolute: boolean }) {
    return "absolute" === t.position || !0 === t.absolute;
  },
  af = function (t: string, e: string | any[]) {
    for (var n, i = e.length; --i > -1; )
      if (((n = e[i]), t.substr(0, n.length) === n)) return n.length;
  },
  createElementWithOptionalClass = function (className = "", elementType = "div") {
    //we check if the className contains a '++'
    const incrementClassName = className.includes("++");
    let incrementNumber = 1;

    return () => {
      let classes = "";

      //add className if provided, adding a number to the end if '++' was present
      if (className) {
        classes += `${className}${incrementClassName ? incrementNumber++ : ""}`;
      }

      //always add 'style="position:relative;display:inline-block";'
      return `<${elementType} style="position:relative;display:inline-block;" ${
        classes ? `class="${classes}"` : ""
      }>`;
    };
  },
  cf = function t(
    e: { nodeType: any; firstChild: any; nextSibling: any; nodeValue: string },
    n: string,
    i: string
  ) {
    var r = e.nodeType;
    if (1 === r || 9 === r || 11 === r) for (e = e.firstChild; e; e = e.nextSibling) t(e, n, i);
    else (3 !== r && 4 !== r) || (e.nodeValue = e.nodeValue.split(n).join(i));
  },
  hf = function (t: any[], e: string | any[]) {
    for (var n = e.length; --n > -1; ) t.push(e[n]);
  },
  ff = function (
    t: { _next: any; nextSibling: any; parentNode: any; _parent: any },
    e: any,
    n: any
  ) {
    for (var i; t && t !== e; ) {
      if ((i = t._next || t.nextSibling)) return i.textContent.charAt(0) === n;
      t = t.parentNode || t._parent;
    }
  },
  pf = function t(e: {
    childNodes: any;
    removeChild: (arg0: any) => any;
    insertBefore: (arg0: any, arg1: any) => any;
  }) {
    var n,
      i,
      r = getElements(e.childNodes),
      o = r.length;
    for (n = 0; n < o; n++)
      (i = r[n])._isSplit
        ? t(i)
        : n && i.previousSibling && 3 === i.previousSibling.nodeType
        ? ((i.previousSibling.nodeValue += 3 === i.nodeType ? i.nodeValue : i.firstChild.nodeValue),
          e.removeChild(i))
        : 3 !== i.nodeType && (e.insertBefore(i.firstChild, i), e.removeChild(i));
  },
  df = function (t: string, e: { [x: string]: string }) {
    return parseFloat(e[t]) || 0;
  },
  vf = function (
    t: {
      style: {
        display: string;
        cssText: string;
        height: string;
        width: string;
        removeProperty: (arg0: string) => any;
      };
      getElementsByTagName: (arg0: string) => any;
      appendChild: (arg0: any) => any;
      offsetLeft: any;
      removeChild: (arg0: any) => void;
      firstChild: any;
      clientHeight: number;
      clientWidth: number;
    },
    e: {
      lineThreshold: any;
      wordDelimiter: string;
      tag: any;
      span: any;
      type: any;
      split: any;
      linesClass: any;
    },
    n: any,
    i: any,
    r: any,
    o: number,
    s: number
  ) {
    var a,
      u,
      l,
      c,
      h,
      f,
      p: any[],
      d,
      v,
      g,
      m,
      y,
      b = getComputedStyle(t),
      w = df("paddingLeft", b),
      x = -999,
      _ = df("borderBottomWidth", b) + df("borderTopWidth", b),
      D = df("borderLeftWidth", b) + df("borderRightWidth", b),
      C = df("paddingTop", b) + df("paddingBottom", b),
      E = df("paddingLeft", b) + df("paddingRight", b),
      T = df("fontSize", b) * (e.lineThreshold || 0.2),
      k = b.textAlign,
      S = [],
      A = [],
      O = [],
      F = e.wordDelimiter || " ",
      M = e.tag ? e.tag : e.span ? "span" : "div",
      P = e.type || e.split || "chars,words,lines",
      j = r && ~P.indexOf("lines") ? [] : null,
      R = ~P.indexOf("words"),
      L = ~P.indexOf("chars"),
      I = sf(e),
      B = e.linesClass,
      N = ~(B || "").indexOf("++"),
      z = [],
      q = "flex" === b.display,
      H = t.style.display;
    for (
      N && (B = B.split("++").join("")),
        q && (t.style.display = "block"),
        l = (u = t.getElementsByTagName("*")).length,
        h = [],
        a = 0;
      a < l;
      a++
    )
      h[a] = u[a];
    if (j || I)
      for (a = 0; a < l; a++)
        ((f = (c = h[a]).parentNode === t) || I || (L && !R)) &&
          ((y = c.offsetTop),
          j &&
            f &&
            Math.abs(y - x) > T &&
            ("BR" !== c.nodeName || 0 === a) &&
            ((p = []), j.push(p), (x = y)),
          I && ((c._x = c.offsetLeft), (c._y = y), (c._w = c.offsetWidth), (c._h = c.offsetHeight)),
          j &&
            (((c._isSplit && f) ||
              (!L && f) ||
              (R && f) ||
              (!R && c.parentNode.parentNode === t && !c.parentNode._isSplit)) &&
              (p.push(c), (c._x -= w), ff(c, t, F) && (c._wordEnd = !0)),
            "BR" === c.nodeName &&
              ((c.nextSibling && "BR" === c.nextSibling.nodeName) || 0 === a) &&
              j.push([])));
    for (a = 0; a < l; a++)
      if (((f = (c = h[a]).parentNode === t), "BR" !== c.nodeName))
        if (
          (I &&
            ((v = c.style),
            R || f || ((c._x += c.parentNode._x), (c._y += c.parentNode._y)),
            (v.left = c._x + "px"),
            (v.top = c._y + "px"),
            (v.position = "absolute"),
            (v.display = "block"),
            (v.width = c._w + 1 + "px"),
            (v.height = c._h + "px")),
          !R && L)
        )
          if (c._isSplit)
            for (
              c._next = u = c.nextSibling, c.parentNode.appendChild(c);
              u && 3 === u.nodeType && " " === u.textContent;

            )
              (c._next = u.nextSibling), c.parentNode.appendChild(u), (u = u.nextSibling);
          else
            c.parentNode._isSplit
              ? ((c._parent = c.parentNode),
                !c.previousSibling && c.firstChild && (c.firstChild._isFirst = !0),
                c.nextSibling &&
                  " " === c.nextSibling.textContent &&
                  !c.nextSibling.nextSibling &&
                  z.push(c.nextSibling),
                (c._next = c.nextSibling && c.nextSibling._isFirst ? null : c.nextSibling),
                c.parentNode.removeChild(c),
                h.splice(a--, 1),
                l--)
              : f ||
                ((y = !c.nextSibling && ff(c.parentNode, t, F)),
                c.parentNode._parent && c.parentNode._parent.appendChild(c),
                y && c.parentNode.appendChild(document.createTextNode(" ")),
                "span" === M && (c.style.display = "inline"),
                S.push(c));
        else
          c.parentNode._isSplit && !c._isSplit && "" !== c.innerHTML
            ? A.push(c)
            : L && !c._isSplit && ("span" === M && (c.style.display = "inline"), S.push(c));
      else
        j || I
          ? (c.parentNode && c.parentNode.removeChild(c), h.splice(a--, 1), l--)
          : R || t.appendChild(c);
    for (a = z.length; --a > -1; ) z[a].parentNode.removeChild(z[a]);
    if (j) {
      for (
        I &&
          ((g = document.createElement(M)),
          t.appendChild(g),
          (m = g.offsetWidth + "px"),
          (y = g.offsetParent === t ? 0 : t.offsetLeft),
          t.removeChild(g)),
          v = t.style.cssText,
          t.style.cssText = "display:none;";
        t.firstChild;

      )
        t.removeChild(t.firstChild);
      for (d = " " === F && (!I || (!R && !L)), a = 0; a < j.length; a++) {
        for (
          p = j[a],
            (g = document.createElement(M)).style.cssText =
              "display:block;text-align:" + k + ";position:" + (I ? "absolute;" : "relative;"),
            B && (g.className = B + (N ? a + 1 : "")),
            O.push(g),
            l = p.length,
            u = 0;
          u < l;
          u++
        )
          "BR" !== p[u].nodeName &&
            ((c = p[u]),
            g.appendChild(c),
            d && c._wordEnd && g.appendChild(document.createTextNode(" ")),
            I &&
              (0 === u && ((g.style.top = c._y + "px"), (g.style.left = w + y + "px")),
              (c.style.top = "0px"),
              y && (c.style.left = c._x - y + "px")));
        0 === l
          ? (g.innerHTML = "&nbsp;")
          : R || L || (pf(g), cf(g, String.fromCharCode(160), " ")),
          I && ((g.style.width = m), (g.style.height = c._h + "px")),
          t.appendChild(g);
      }
      t.style.cssText = v;
    }
    I &&
      (s > t.clientHeight &&
        ((t.style.height = s - C + "px"), t.clientHeight < s && (t.style.height = s + _ + "px")),
      o > t.clientWidth &&
        ((t.style.width = o - E + "px"), t.clientWidth < o && (t.style.width = o + D + "px"))),
      q && (H ? (t.style.display = H) : t.style.removeProperty("display")),
      hf(n, S),
      R && hf(i, A),
      hf(r, O);
  },
  gf = function (
    t: { parentNode: any; nodeValue: any; outerHTML: string },
    e: {
      tag: any;
      span: any;
      type: any;
      split: any;
      wordDelimiter: string;
      specialChars: any;
      reduceWhiteSpace: boolean;
    },
    n: () => string,
    i: () => string
  ) {
    var r,
      o,
      s,
      a,
      u,
      l,
      c,
      h,
      f = e.tag ? e.tag : e.span ? "span" : "div",
      p = ~(e.type || e.split || "chars,words,lines").indexOf("chars"),
      d = sf(e),
      v = e.wordDelimiter || " ",
      g = " " !== v ? "" : d ? "&#173; " : " ",
      m = "</" + f + ">",
      y = 1,
      b = e.specialChars ? ("function" == typeof e.specialChars ? e.specialChars : af) : null,
      w = document.createElement("div"),
      x = t.parentNode;
    for (
      x.insertBefore(w, t),
        w.textContent = t.nodeValue,
        x.removeChild(t),
        c =
          -1 !==
          (r = (function t(e) {
            var n = e.nodeType,
              i = "";
            if (1 === n || 9 === n || 11 === n) {
              if ("string" == typeof e.textContent) return e.textContent;
              for (e = e.firstChild; e; e = e.nextSibling) i += t(e);
            } else if (3 === n || 4 === n) return e.nodeValue;
            return i;
          })((t = w))).indexOf("<"),
        !1 !== e.reduceWhiteSpace && (r = r.replace(tf, " ").replace(Jh, "")),
        c && (r = r.split("<").join("{{LT}}")),
        u = r.length,
        o = (" " === r.charAt(0) ? g : "") + n(),
        s = 0;
      s < u;
      s++
    )
      if (((l = r.charAt(s)), b && (h = b(r.substr(s), e.specialChars))))
        (l = r.substr(s, h || 1)),
          (o += p && " " !== l ? i() + l + "</" + f + ">" : l),
          (s += h - 1);
      else if (l === v && r.charAt(s - 1) !== v && s) {
        for (o += y ? m : "", y = 0; r.charAt(s + 1) === v; ) (o += g), s++;
        s === u - 1 ? (o += g) : ")" !== r.charAt(s + 1) && ((o += g + n()), (y = 1));
      } else
        "{" === l && "{{LT}}" === r.substr(s, 6)
          ? ((o += p ? i() + "{{LT}}</" + f + ">" : "{{LT}}"), (s += 5))
          : (l.charCodeAt(0) >= 55296 && l.charCodeAt(0) <= 56319) ||
            (r.charCodeAt(s + 1) >= 65024 && r.charCodeAt(s + 1) <= 65039)
          ? ((a = ((r.substr(s, 12).split(Vh) || [])[1] || "").length || 2),
            (o += p && " " !== l ? i() + r.substr(s, a) + "</" + f + ">" : r.substr(s, a)),
            (s += a - 1))
          : (o += p && " " !== l ? i() + l + "</" + f + ">" : l);
    (t.outerHTML = o + (y ? m : "")), c && cf(x, "{{LT}}", "<");
  },
  mf = function t(
    e: { childNodes: any; nodeType: number; _isSplit: boolean },
    n: { absolute: boolean },
    i: () => string,
    r: () => string
  ) {
    var o,
      s,
      a = getElements(e.childNodes),
      u = a.length,
      l = sf(n);
    if (3 !== e.nodeType || u > 1) {
      for (n.absolute = !1, o = 0; o < u; o++)
        ((s = a[o])._next = s._isFirst = s._parent = s._wordEnd = null),
          (3 !== s.nodeType || /\S+/.test(s.nodeValue)) &&
            (l &&
              3 !== s.nodeType &&
              "inline" === getComputedStyle(s).display &&
              ((s.style.display = "inline-block"), (s.style.position = "relative")),
            (s._isSplit = !0),
            t(s, n, i, r));
      return (n.absolute = l), void (e._isSplit = !0);
    }
    gf(e, n, i, r);
  };

// declare class CustomSplitText {
//   constructor(target: gsap.DOMTarget, vars?: SplitText.Vars);
// }
// const CustomSplitText2 = (function () {
//   function SplitText(e: gsap.DOMTarget, n?: SplitText.Vars) {
//     !(function (t, e) {
//       if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
//     })(this, SplitText),
//       Kh || ((document = document), (Qh = window), (Kh = 1)),
//       (this.elements = getElements(e)),
//       (this.chars = []),
//       (this.words = []),
//       (this.lines = []),
//       (this._originals = []),
//       (this.vars = n || {}),
//       this.split(n);
//   }

//   var e, n, i;
//   return (
//     (e = SplitText),
//     (i = [
//       {
//         key: "create",
//         value: function (e: any, n: any) {
//           return new SplitText(e, n);
//         },
//       },
//     ]),
//     (n = [
//       {
//         key: "split",
//         value: function (t: { tag: any; span: any; wordsClass: any; charsClass: any }) {
//           this.isSplit && this.revert(),
//             (this.vars = t = t || this.vars),
//             (this._originals.length =
//               this.chars.length =
//               this.words.length =
//               this.lines.length =
//                 0);
//           for (
//             var e,
//               n,
//               i,
//               r = this.elements.length,
//               o = t.tag ? t.tag : t.span ? "span" : "div",
//               s = createElementWithOptionalClass(t.wordsClass, o),
//               a = createElementWithOptionalClass(t.charsClass, o);
//             --r > -1;

//           )
//             (i = this.elements[r]),
//               (this._originals[r] = i.innerHTML),
//               (e = i.clientHeight),
//               (n = i.clientWidth),
//               mf(i, t, s, a),
//               vf(i, t, this.chars, this.words, this.lines, n, e);
//           return (
//             this.chars.reverse(),
//             this.words.reverse(),
//             this.lines.reverse(),
//             (this.isSplit = !0),
//             this
//           );
//         },
//       },
//       {
//         key: "revert",
//         value: function () {
//           var t = this._originals;
//           if (!t) throw "revert() call wasn't scoped properly.";
//           return (
//             this.elements.forEach(function (e: { innerHTML: any }, n: string | number) {
//               return (e.innerHTML = t[n]);
//             }),
//             (this.chars = []),
//             (this.words = []),
//             (this.lines = []),
//             (this.isSplit = !1),
//             this
//           );
//         },
//       },
//     ]) && defineProperty(e.prototype, n),
//     i && defineProperty(e, i),
//     SplitText
//   );
// })();

// const SplitText = SplitText as unknown as SplitText2;

class CustomSplitText {
  readonly chars: Element[];
  readonly lines: Element[];
  readonly words: Element[];
  readonly selector: string | Function;

  private isSplit = false;
  private _originals = [];
  public chars = [];
  public words = [];
  public lines = [];
  public elements: any = [];

  public vars: SplitText.Vars = {};

  constructor(target: gsap.DOMTarget, vars?: SplitText.Vars) {
    this.vars = vars || {};
    this.elements = getElements(target);
    this.split(this.vars);
  }

  static create(target: gsap.DOMTarget, vars?: SplitText.Vars) {
    return new SplitText(target, vars);
  }

  split(vars: SplitText.Vars): SplitText {
    this.isSplit && this.revert();
    this.vars = vars = vars || this.vars;
    this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;

    for (
      var height,
        width,
        el,
        totalElements = this.elements.length,
        tag = vars.tag ? vars.tag : vars.span ? "span" : "div",
        s = createElementWithOptionalClass(vars.wordsClass, tag),
        a = createElementWithOptionalClass(vars.charsClass, tag);
      --totalElements > -1;

    ) {
      el = this.elements[totalElements];
      this._originals[totalElements] = el.innerHTML;
      height = el.clientHeight;
      width = el.clientWidth;
      mf(el, vars, s, a);
      vf(el, vars, this.chars, this.words, this.lines, width, height);
    }

    this.chars.reverse();
    this.words.reverse();
    this.lines.reverse();
    this.isSplit = true;

    return this;
  }

  revert() {
    var t = this._originals;
    if (!t) throw "revert() call wasn't scoped properly.";
    this.elements.forEach(function (element: { innerHTML: any }, index: string | number) {
      return (element.innerHTML = t[index]);
    });

    this.chars = [];
    this.words = [];
    this.lines = [];
    this.isSplit = !1;

    return this;
  }
}
export { CustomSplitText };
