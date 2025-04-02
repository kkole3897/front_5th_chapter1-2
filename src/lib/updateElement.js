import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, originNewProps, originOldProps) {
  if (!originNewProps && !originOldProps) {
    return;
  }

  if (!originNewProps && originOldProps) {
    for (const key of Object.keys(originOldProps)) {
      if (key.startsWith("on")) {
        removeEvent(target, key, originOldProps[key]);
      } else if (key === "className") {
        target.removeAttribute("class");
      } else {
        target.removeAttribute(key);
      }
    }
  }

  if (originNewProps && !originOldProps) {
    for (const key of Object.keys(originNewProps)) {
      if (key.startsWith("on")) {
        addEvent(target, key, originNewProps[key]);
      } else if (key === "className") {
        target.className = originNewProps[key];
      } else {
        target.setAttribute(key, originNewProps[key]);
      }
    }
  }

  for (const [key, value] of Object.entries(originNewProps)) {
    if (Object.keys(originOldProps).includes(key)) {
      if (originOldProps[key] !== value) {
        if (key.startsWith("on")) {
          removeEvent(target, key, originOldProps[key]);
          addEvent(target, key, value);
        } else if (key === "className") {
          target.className = value;
        } else {
          target.setAttribute(key, value);
        }
      }
    } else {
      if (key.startsWith("on")) {
        addEvent(target, key, value);
      } else if (key === "className") {
        target.className = value;
      } else {
        target.setAttribute(key, value);
      }
    }
  }

  for (const key of Object.keys(originOldProps)) {
    if (!Object.keys(originNewProps).includes(key)) {
      if (key.startsWith("on")) {
        removeEvent(target, key, originOldProps[key]);
      } else {
        target.removeAttribute(key);
      }
    }
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  if (oldNode != null && newNode == null) {
    parentElement.removeChild(parentElement.children[index]);
    return;
  }

  if (oldNode == null && newNode != null) {
    const element = createElement(newNode);
    parentElement.appendChild(element);
    return;
  }

  if (typeof newNode === "string" || typeof newNode === "number") {
    if (newNode !== oldNode) {
      parentElement.textContent = newNode;
    }
    return;
  }

  if (oldNode.type !== newNode.type) {
    const element = createElement(newNode);
    parentElement.replaceChild(element, parentElement.children[index]);
    return;
  }

  const element = parentElement.children[index];
  const { props: newProps, children: newChildren } = newNode;
  const { props: oldProps, children: oldChildren } = oldNode;

  updateAttributes(element, newProps, oldProps);

  if (!Array.isArray(newChildren)) {
    if (Array.isArray(oldChildren)) {
      for (const child of oldChildren) {
        updateElement(element, null, child);
      }
    }
    return;
  }

  if (!Array.isArray(oldChildren)) {
    for (const child of newChildren) {
      updateElement(element, child, null);
    }
    return;
  }

  for (let i = 0; i < newChildren.length; i++) {
    updateElement(element, newChildren[i], oldChildren[i], i);
  }
}
