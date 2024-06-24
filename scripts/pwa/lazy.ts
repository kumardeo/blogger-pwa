export type EventType = 'localStorage' | 'keydown' | 'mouseover' | 'touchmove' | 'touchstart' | 'scroll' | 'click';

export interface LazyDetails {
  type: EventType;
}

const windowEvents = ['keydown', 'mouseover', 'touchmove', 'touchstart', 'scroll', 'click'];

let promise: {
  reject(error: unknown): void;
  resolve(data: LazyDetails): void;
} = {
  reject() {},
  resolve() {},
};

/** A promise which resolves on user interaction based on localStorage */
// @ts-expect-error define properties
export const lazy: Promise<LazyDetails> & {
  lazied: boolean;
  localKey: string;
  localValue: string;
} = new Promise((resolve, reject) => {
  promise = { resolve, reject };
});

Object.assign(lazy, {
  localKey: '__is_lazied',
  localValue: String(true),
});

Object.defineProperties(lazy, {
  lazied: {
    get(this: typeof lazy) {
      try {
        return localStorage.getItem(this.localKey) === String(this.localValue);
      } catch (e) {
        return true;
      }
    },
    set(this: typeof lazy, v) {
      try {
        if (v) {
          localStorage.setItem(this.localKey, String(this.localValue));
        } else {
          localStorage.removeItem(this.localKey);
        }
      } catch (e) {
        // do nothing
      }
    },
  },
});

const attach = (eventLike: { type: string }) => {
  lazy.lazied = true;
  promise.resolve({ type: eventLike.type } as LazyDetails);
  for (const type of windowEvents) {
    window.removeEventListener(type, attach);
  }
};

if (lazy.lazied) {
  promise.resolve({ type: 'localStorage' });
} else {
  if (document.documentElement.scrollTop !== 0 || (document.body && document.body.scrollTop !== 0)) {
    attach({ type: 'scroll' });
  }

  for (const type of windowEvents) {
    window.addEventListener(type, attach);
  }
}
