export function normalizeVNode(vNode) {
  if (vNode == null || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return String(vNode);
  }

  if (typeof vNode.type === "function") {
    const { type, props, children } = vNode;

    return normalizeVNode(type({ ...props, children }));
  }

  const { type, props, children } = vNode;

  const normalizedChildren = children
    .map(normalizeVNode)
    .filter((child) => child != null && child !== false && child !== "");

  return {
    type,
    props,
    children: normalizedChildren,
  };
}
