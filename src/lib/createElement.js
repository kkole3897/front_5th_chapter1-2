import { addEvent } from "./eventManager";

class UnsupportedElementTypeError extends Error {
  static MESSAGE = "UnsupportedElementTypeError";

  constructor() {
    super(UnsupportedElementTypeError.MESSAGE);
  }
}

export function createElement(vNode) {
  if (
    typeof vNode === "undefined" ||
    typeof vNode === "boolean" ||
    vNode === null
  ) {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach((child) => {
      const $el = createElement(child);
      fragment.appendChild($el);
    });

    return fragment;
  }

  if (typeof vNode.type === "function") {
    throw new UnsupportedElementTypeError();
  }

  const { type, props, children } = vNode;
  const $el = document.createElement(type);

  if (props) {
    updateAttributes($el, props);
  }

  children.forEach((child) => {
    const $child = createElement(child);
    $el.appendChild($child);
  });

  return $el;
}

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      addEvent($el, key.slice(2).toLowerCase(), value);
    } else if (key === "className") {
      $el.className = value;
    } else {
      $el.setAttribute(key, value);
    }
  });
}
