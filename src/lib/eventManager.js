export class NotFoundListenerError extends Error {
  static MESSAGE = "NotFoundListenerError";

  constructor() {
    super(NotFoundListenerError.MESSAGE);
  }
}

const listeners = {};

export function setupEventListeners(root) {
  for (const key in listeners) {
    const listener = listeners[key];
    listener.add(root);
    listener.remove = () => {
      root.removeEventListener(listener.eventType, listener.handler);
      delete listeners[key];
    };
  }
}

const generateEventListenerKey = (element, eventType, handler) => {
  return JSON.stringify({ element, eventType, handler });
};

const createHandler = (element, handler) => {
  return (e) => {
    if (e.target === element) {
      handler(e);
    }
  };
};

const noop = () => {};

export function addEvent(element, eventType, handler) {
  const createdHandler = createHandler(element, handler);

  const key = generateEventListenerKey(element, eventType, handler);

  listeners[key] = {
    eventType,
    handler: createdHandler,
    add: (root) => {
      root.addEventListener(eventType, createdHandler);
    },
    remove: noop,
  };
}

export function removeEvent(element, eventType, handler) {
  const key = generateEventListenerKey(element, eventType, handler);
  const listener = listeners[key];

  if (!listener) {
    throw new NotFoundListenerError();
  }

  listener.remove();
}
