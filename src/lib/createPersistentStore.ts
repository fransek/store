import { createStore, DefineActions, Store, StoreOptions } from "./createStore";

export type StorageType = "local" | "session";

export type PersistentStoreOptions<TState extends object> =
  StoreOptions<TState> & {
    /** The type of storage to use ("local" or "session"). Defaults to "local". */
    storage?: StorageType;
    /** The serializer to use for storing the state. Defaults to JSON. */
    serializer?: {
      stringify: (value: TState) => string;
      parse: (value: string) => TState;
    };
  };
/**
 * Creates a store that persists its state in local or session storage.
 * Defaults to local storage but this can be changed in the options.
 * (The state must be JSON serializable)
 *
 * @param {string} key - A unique key to identify the store in storage.
 * @param {TState} initialState - The initial state of the store.
 * @param {DefineActions<TState, TActions> | null} [defineActions=null] - A function to define actions for the store.
 * @param {PersistentStoreOptions<TState>} [options={}] - Additional options for the persistent store.
 *
 * @returns {Store<TState, TActions>} The created store.
 *
 * @example
 * import { createPersistentStore } from "fransek-store";
 *
 * const store = createPersistentStore("count", { count: 0 }, (set) => ({
 *   increment: () => set((state) => ({ count: state.count + 1 })),
 *   decrement: () => set((state) => ({ count: state.count - 1 })),
 *   reset: () => set({ count: 0 }),
 * }));
 */
export const createPersistentStore = <
  TState extends object,
  TActions extends object = Record<never, never>,
>(
  key: string,
  initialState: TState,
  defineActions: DefineActions<TState, TActions> | null = null,
  {
    storage: _storage = "local",
    serializer = JSON,
    ...options
  }: PersistentStoreOptions<TState> = {},
): Store<TState, TActions> => {
  const store = createStore(initialState, defineActions, options);

  if (typeof window === "undefined") {
    return store;
  }

  const storage = _storage === "local" ? localStorage : sessionStorage;
  const stateKey = `store_${key}`;
  const initialStateKey = `init_${key}`;
  const initialStateSnapshot = storage?.getItem(initialStateKey);
  const initialStateString = serializer.stringify(initialState);

  if (initialStateSnapshot !== initialStateString) {
    storage?.setItem(initialStateKey, initialStateString);
    storage?.removeItem(stateKey);
  }

  const updateSnapshot = (newState: TState) => {
    const currentSnapshot = storage?.getItem(stateKey);
    const newSnapshot = serializer.stringify(newState);

    if (newSnapshot !== currentSnapshot) {
      storage?.setItem(stateKey, newSnapshot);
    }
  };

  const updateState = () => {
    const currentSnapshot = storage?.getItem(stateKey);

    if (
      currentSnapshot &&
      currentSnapshot !== serializer.stringify(store.get())
    ) {
      store.set(serializer.parse(currentSnapshot));
    }
  };

  store.addEventListener("attach", () => {
    updateState();
    store.addEventListener("change", updateSnapshot);
    window.addEventListener("focus", updateState);
  });

  store.addEventListener("detach", () => {
    store.removeEventListener("change", updateSnapshot);
    window.removeEventListener("focus", updateState);
  });

  return store;
};
