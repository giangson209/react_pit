import React from "react";
import { useState } from "react";
import { useId } from "react";
import { useEffect } from "react";

let id = 0;
let element: HTMLElement;
type Props = {} & React.SVGProps<SVGUseElement>;

const genId = (): number => id++;

function createElement() {
  if (element) return element;
  element = document.createElement("div");
  element.style.display = "none";
  element.style.width = "0";
  element.style.height = "0";
  document.body.insertBefore(element, document.body.firstChild);
  return element;
}

const onLoadSVG = (id: string) =>
  function onLoadSVG(this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) {
    const element = createElement();
    // var body = document.body;
    var x = document.createElement("x");
    var svg;
    this.onload = null;
    x.innerHTML = this.responseText;
    svg = x.getElementsByTagName("svg")[0];
    if (svg) {
      svg.setAttribute("aria-hidden", "true");
      svg.style.position = "absolute";
      svg.style.width = "0";
      svg.style.height = "0";
      svg.style.overflow = "hidden";
      // svg.style.display = "none";
      svg.id = id;
      element.insertBefore(svg, element.firstChild);
    }
  };

function makeRequest(href?: string) {
  let url: string[];
  if (href && href.split) {
    url = href.split("#");
  } else {
    url = ["", ""];
  }
  const base = url[0],
    hash = url[1];
  let id = caches.get(base);
  if (!id) {
    id = ":" + genId();
    caches.set(base, id);
    const xhr = new XMLHttpRequest();
    xhr.onload = onLoadSVG(id);
    xhr.open("GET", base);
    xhr.send();
  }
  return id;
}
const caches: Map<string, string> = new Map();

const Use = (props: Props) => {
  const [id, setId] = useState<string>();
  useEffect(() => {
    const id = makeRequest(props.href || props.xlinkHref);
    setId(id);
  }, [props.href, props.xlinkHref]);

  return (
    <use
      {...props}
      href={props.href ? "#" + id : undefined}
      xlinkHref={props.xlinkHref ? "#" + id : undefined}
    />
  );
};

export default Use;
