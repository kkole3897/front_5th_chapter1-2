class NotFoundListenerError extends Error {
  static MESSAGE = "NotFoundListenerError";

  constructor() {
    super(NotFoundListenerError.MESSAGE);
  }
}

class DuplicatedEventTypeError extends Error {
  static MESSAGE = "DuplicatedEventTypeError";

  constructor() {
    super(DuplicatedEventTypeError.MESSAGE);
  }
}

class NotFoundRegisteredHandlerError extends Error {
  static MESSAGE = "NotFoundRegisteredHandlerError";

  constructor() {
    super(NotFoundRegisteredHandlerError.MESSAGE);
  }
}

const listeners = new Map();

const createHandler = (element, handler) => {
  return (e) => {
    if (e.target === element) {
      handler(e);
    }
  };
};

const noop = () => {};

export function setupEventListeners(root) {
  for (const listener of listeners.values()) {
    for (const eventType of Object.keys(listener)) {
      const createdHandler = createHandler(
        listener[eventType].element,
        listener[eventType].handler,
      );
      listener[eventType].add(root, createdHandler);
      listener[eventType].remove = () => {
        root.removeEventListener(eventType, createdHandler);
        delete listener[eventType];
      };
      listener[eventType].add = noop;
    }
  }
}

export function addEvent(element, eventType, handler) {
  if (!listeners.has(element)) {
    listeners.set(element, {
      [eventType]: {
        element,
        handler,
        add: (root, handler) => root.addEventListener(eventType, handler),
        remove: noop,
      },
    });
    return;
  }

  const listener = listeners.get(element);

  if (listener[eventType]) {
    throw new DuplicatedEventTypeError();
  }

  listener[eventType] = {
    element,
    handler,
    add: (root, handler) => root.addEventListener(eventType, handler),
    remove: noop,
  };
}

export function removeEvent(element, eventType, handler) {
  if (!listeners.has(element)) {
    throw new NotFoundListenerError();
  }

  const listener = listeners.get(element);
  const registeredHandler = listener[eventType];

  if (
    !registeredHandler ||
    registeredHandler.handler !== handler ||
    registeredHandler.element !== element
  ) {
    throw new NotFoundRegisteredHandlerError();
  }

  registeredHandler.remove();
}
