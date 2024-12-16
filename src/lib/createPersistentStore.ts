import superjson from "superjson";
import { createStore, DefineActions, Store, StoreOptions } from "./createStore";

type StorageType = "local" | "session";

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
  {
    storage: storageType = "local",
    ...options
  }: PersistentStoreOptions<TState> = {},
): Store<TState, TActions> => {
  const store = createStore(initialState, defineActions, options);

  if (typeof window === "undefined") {
    return store;
  }

  const storage = storageType === "local" ? localStorage : sessionStorage;
  const stateKey = `store_${key}`;
  const initialStateKey = `init_${key}`;
  const initialStateSnapshot = storage?.getItem(initialStateKey);
  const initialStateString = superjson.stringify(initialState);

  if (initialStateSnapshot !== initialStateString) {
    storage?.setItem(initialStateKey, initialStateString);
    storage?.removeItem(stateKey);
  }

  const updateSnapshot = (newState: TState) => {
    const currentSnapshot = storage?.getItem(stateKey);
    const newSnapshot = superjson.stringify(newState);

    if (newSnapshot !== currentSnapshot) {
      storage?.setItem(stateKey, newSnapshot);
    }
  };

  const updateState = () => {
    const currentSnapshot = storage?.getItem(stateKey);

    if (
      currentSnapshot &&
      currentSnapshot !== superjson.stringify(store.get())
    ) {
      store.set(superjson.parse<TState>(currentSnapshot));
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
