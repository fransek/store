import superjson from "superjson";
import { createStore, DefineActions, Store, StoreOptions } from "./createStore";

type StorageType = "local" | "session";

const getStorage = (storage: StorageType) => {
  switch (storage) {
    case "local":
      return localStorage;
    case "session":
      return sessionStorage;
  }
};

const registerStoreListener = (storeKey: string) => {
  if (!window.__store_listeners) {
    window.__store_listeners = new Set();
  }

  window.__store_listeners.add(storeKey);
};

const isStoreListenerRegistered = (storeKey: string) => {
  return window.__store_listeners?.has(storeKey);
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
 * @param {string} storeKey - A unique key to identify the store in storage.
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
  storeKey: string,
  initialState: TState,
  defineActions: DefineActions<TState, TActions> | null = null,
  { storage = "local", ...options }: PersistentStoreOptions<TState> = {},
): Store<TState, TActions> => {
  const selectedStorage = getStorage(storage);
  const isBrowser = typeof window !== "undefined";

  const initialStateKey = `store_initial_${storeKey}`;
  const initialStateString = isBrowser
    ? selectedStorage.getItem(initialStateKey)
    : null;

  const key = `store_${storeKey}`;

  if (initialStateString !== superjson.stringify(initialState)) {
    selectedStorage.setItem(initialStateKey, superjson.stringify(initialState));
    selectedStorage.removeItem(key);
  }

  const stateString = isBrowser ? selectedStorage.getItem(key) : null;
  const state = stateString
    ? superjson.parse<TState>(stateString)
    : initialState;
  const store = createStore(state, defineActions, options);

  if (isBrowser) {
    store.subscribe(() => {
      const currentSnapshot = selectedStorage.getItem(key);
      const newSnapshot = superjson.stringify(store.get());

      if (newSnapshot !== currentSnapshot) {
        selectedStorage.setItem(key, newSnapshot);
      }
    });

    const sync = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        store.set(superjson.parse<TState>(event.newValue));
      }
    };

    if (!isStoreListenerRegistered(storeKey)) {
      window.addEventListener("storage", sync);
      registerStoreListener(storeKey);
    }
  }

  const reset = () => store.set(initialState);

  return { ...store, reset };
};
