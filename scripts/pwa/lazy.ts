const localKey = 'IS_LAZIED';
const localValue = String(true);
const windowEvents = ['keydown', 'mouseover', 'touchmove', 'touchstart', 'scroll', 'click'] as const;

export type EventType = (typeof windowEvents)[number] | 'local' | 'scroll';

export const lazy = new Promise<{ type: EventType }>((resolve) => {
  function getLazied() {
    try {
      return localStorage.getItem(localKey) === localValue;
    } catch (_) {
      return true;
    }
  }
  function setLazied(lazied = true) {
    try {
      if (lazied) {
        localStorage.setItem(localKey, localValue);
      } else {
        localStorage.removeItem(localKey);
      }
    } catch (_) {
      // do nothing
    }
  }
  function execute(data: { type: string }) {
    setLazied(true);
    resolve({ type: data.type.toLowerCase() as EventType });
    for (const type of windowEvents) {
      window.removeEventListener(type, execute);
    }
  }
  if (getLazied()) {
    resolve({ type: 'local' });
  } else {
    if (document.documentElement.scrollTop !== 0 || (document.body && document.body.scrollTop !== 0)) {
      execute({ type: 'scroll' });
    }

    for (const type of windowEvents) {
      window.addEventListener(type, execute);
    }
  }
});
