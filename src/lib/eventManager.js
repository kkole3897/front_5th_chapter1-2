const eventListeners = new Map();
const cleanupListeners = new Map();

export function setupEventListeners(root) {
  for (const { eventType, handler } of eventListeners.values()) {
    root.addEventListener(eventType, handler);
    cleanupListeners.set(handler, () => {
      root.removeEventListener(eventType, handler);
    });
  }
}

const generateEventListenerKey = (element, eventType, handler) => {
  return JSON.stringify({ element, eventType, handler });
};

export function addEvent(element, eventType, handler) {
  const createdHandler = (e) => {
    if (e.target === element) {
      handler(e);
    }
  };

  const key = generateEventListenerKey(element, eventType, handler);

  eventListeners.set(key, { eventType, handler: createdHandler });
}

export function removeEvent(element, eventType, handler) {
  const key = generateEventListenerKey(element, eventType, handler);
  const matchedEventListener = eventListeners.get(key);
  let cleanup = null;
  if (matchedEventListener) {
    cleanup = cleanupListeners.get(matchedEventListener.handler);
    eventListeners.delete(key);
  }

  console.log(cleanup);

  if (cleanup) {
    cleanup();
    cleanupListeners.delete(matchedEventListener.handler);
  }
}
