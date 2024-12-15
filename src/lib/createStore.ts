export type Store<TState extends object, TActions extends object> = {
  get: () => TState;
  set: (stateModifier: StateModifier<TState>) => TState;
  reset: () => TState;
  subscribe: (listener: () => void) => () => void;
  listeners: (() => void)[];
  actions: TActions;
  addEventListener: (
    event: StoreEvent,
    listener: StoreListener<TState>,
  ) => void;
  removeEventListener: (
    event: StoreEvent,
    listener: StoreListener<TState>,
  ) => void;
};

export type StoreEvent = "attach" | "detach" | "change" | "load";

export type StoreListener<TState extends object> = (
  state: TState,
  set: SetState<TState>,
) => void;

export type SetState<TState extends object> = (
  stateModifier: StateModifier<TState>,
) => TState;

export type GetState<TState extends object> = () => TState;

export type StateModifier<TState extends object> =
  | Partial<TState>
  | ((state: TState) => Partial<TState>);

export type DefineActions<TState extends object, TActions> = (
  set: (stateModifier: StateModifier<TState>) => TState,
  get: () => TState,
) => TActions;

export type StoreOptions<TState extends object> = {
  /** Invoked when the store is created. */
  onLoad?: StoreListener<TState>;
  /** Invoked when the store is subscribed to. */
  onAttach?: StoreListener<TState>;
  /** Invoked when the store is unsubscribed from. */
  onDetach?: StoreListener<TState>;
  /** Invoked whenever the state changes. */
  onStateChange?: StoreListener<TState>;
  /** Whether to reset the state to the initial state when the store is detached. */
  resetOnDetach?: boolean;
};

/**
 * Creates a store with state management capabilities.
 *
 * @param {TState} initialState - The initial state of the store.
 * @param {DefineActions<TState, TActions> | null} [defineActions=null] - A function that defines actions that can modify the state.
 * @param {StoreOptions<TState>} [options] - Additional options for the store.
 *
 * @returns {Store<TState, TActions>} The created store with state management methods.
 */
export const createStore = <
  TState extends object,
  TActions extends object = Record<never, never>,
>(
  initialState: TState,
  defineActions: DefineActions<TState, TActions> | null = null,
  {
    onLoad,
    onAttach,
    onDetach,
    onStateChange,
    resetOnDetach = false,
  }: StoreOptions<TState> = {},
): Store<TState, TActions> => {
  let state = initialState;
  let listeners: (() => void)[] = [];

  const eventListeners: Record<StoreEvent, StoreListener<TState>[]> = {
    load: [],
    attach: [],
    detach: [],
    change: [],
  };

  const addEventListener = (
    event: StoreEvent,
    listener: StoreListener<TState>,
  ) => {
    eventListeners[event].push(listener);
  };

  const removeEventListener = (
    event: StoreEvent,
    listener: StoreListener<TState>,
  ) => {
    eventListeners[event] = eventListeners[event].filter((l) => l !== listener);
  };

  const dispatchEvent = (event: StoreEvent, silent = false) => {
    eventListeners[event].forEach((listener) =>
      listener(state, silent ? setSilently : set),
    );
  };

  if (onLoad) {
    addEventListener("load", onLoad);
  }
  if (onAttach) {
    addEventListener("attach", onAttach);
  }
  if (onDetach) {
    addEventListener("detach", onDetach);
  }
  if (onStateChange) {
    addEventListener("change", onStateChange);
  }

  const get = () => state;

  const setSilently = (stateModifier: StateModifier<TState>) => {
    const newState =
      typeof stateModifier === "function"
        ? stateModifier(state)
        : stateModifier;
    state = { ...state, ...newState };
    return state;
  };

  const dispatch = () => {
    dispatchEvent("change", true);
    listeners.forEach((listener) => listener());
  };

  const set = (stateModifier: StateModifier<TState>) => {
    setSilently(stateModifier);
    dispatch();
    return state;
  };

  const reset = () => {
    state = initialState;
    dispatch();
    return state;
  };

  const subscribe = (listener: () => void) => {
    if (listeners.length === 0) {
      dispatchEvent("attach");
    }

    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);

      if (listeners.length === 0) {
        dispatchEvent("detach");

        if (resetOnDetach) {
          reset();
        }
      }
    };
  };

  const actions = defineActions ? defineActions(set, get) : ({} as TActions);

  dispatchEvent("load");

  return {
    get,
    set,
    reset,
    subscribe,
    listeners,
    actions,
    addEventListener,
    removeEventListener,
  };
};
