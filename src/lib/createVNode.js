import { flattenDeep } from "./array/flatten-deep";

// TODO: jsdoc 추가
export function createVNode(type, props, ...children) {
  const flattenedChildren = flattenDeep(children).filter(
    (child) => child !== null && child !== undefined && child !== false,
  );

  return { type, props, children: flattenedChildren };
}
