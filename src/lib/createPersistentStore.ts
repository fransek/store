import superjson from "superjson";
import { createStore, DefineActions, Store, StoreOptions } from "./createStore";

type StorageType = "local" | "session";

const getStorage = (storage: StorageType) => {
  if (typeof window === "undefined") {
    return null;
  }

  switch (storage) {
    case "local":
      return localStorage;
    case "session":
      return sessionStorage;
  }
};

const registerStoreListener = (storeKey: string, listener: () => void) => {
  if (!window.__store_listeners) {
    window.__store_listeners = new Set();
  }

  window.__store_listeners.add(storeKey);
  window.addEventListener("focus", listener);
};

const unregisterStoreListener = (storeKey: string, listener: () => void) => {
  window.__store_listeners?.delete(storeKey);
  window.removeEventListener("focus", listener);
};

interface PersistentStoreOptions<TState extends object>
  extends StoreOptions<TState> {
  /** The type of storage to use ("local" or "session"). Defaults to "local". */
  storage?: StorageType;
}

/**
 * Creates a store that persists its state in local or session storage.
 * Defaults to local storage but this can be changed in the options.
 * (The state must be superjson serializable. https://github.com/flightcontrolhq/superjson)
 *
 * @param {string} key - A unique key to identify the store in storage.
 * @param {TState} initialState - The initial state of the store.
 * @param {DefineActions<TState, TActions> | null} [defineActions=null] - A function to define actions for the store.
 * @param {PersistentStoreOptions<TState>} [options={}] - Additional options for the persistent store.
 *
 * @returns {Store<TState, TActions>} The created store.
 */
export const createPersistentStore = <
  TState extends object,
  TActions extends object = Record<never, never>,
>(
  key: string,
  initialState: TState,
  defineActions: DefineActions<TState, TActions> | null = null,
  { storage = "local", ...options }: PersistentStoreOptions<TState> = {},
): Store<TState, TActions> => {
  const selectedStorage = getStorage(storage);
  const isBrowser = typeof window !== "undefined";

  const initialStateKey = `store_init_${key}`;
  const initialStateSnapshot = isBrowser
    ? selectedStorage?.getItem(initialStateKey)
    : null;
  const initialStateString = superjson.stringify(initialState);

  const stateKey = `store_${key}`;

  if (initialStateSnapshot !== initialStateString) {
    selectedStorage?.setItem(initialStateKey, initialStateString);
    selectedStorage?.removeItem(stateKey);
  }

  const stateString = isBrowser ? selectedStorage?.getItem(stateKey) : null;
  const state = stateString
    ? superjson.parse<TState>(stateString)
    : initialState;
  const store = createStore(state, defineActions, options);

  if (isBrowser) {
    const updateSnapshot = (newState: TState) => {
      const currentSnapshot = selectedStorage?.getItem(stateKey);
      const newSnapshot = superjson.stringify(newState);

      if (newSnapshot !== currentSnapshot) {
        selectedStorage?.setItem(stateKey, newSnapshot);
      }
    };

    const updateState = () => {
      const currentSnapshot = selectedStorage?.getItem(stateKey);
      const currentState = superjson.stringify(store.get());

      if (currentSnapshot && currentSnapshot !== currentState) {
        store.set(superjson.parse<TState>(currentSnapshot));
      }
    };

    store.addEventListener("attach", () => {
      updateState();
      store.addEventListener("change", updateSnapshot);
      registerStoreListener(key, updateState);
    });

    store.addEventListener("detach", () => {
      store.removeEventListener("change", updateSnapshot);
      unregisterStoreListener(key, updateState);
    });
  }

  const reset = () => store.set(initialState);

  return { ...store, reset };
};
