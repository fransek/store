export type Store<TState extends object, TActions extends object> = {
  get: () => TState;
  set: (stateModifier: StateModifier<TState>) => TState;
  reset: () => TState;
  subscribe: (listener: () => void) => () => void;
  actions: TActions;
};

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
  /** Optional callback that is invoked whenever the state changes. Receives the new state and a setter function. */
  onStateChange?: (state: TState, set: SetState<TState>) => void;
  /** Optional flag indicating whether the state should reset when the last listener unsubscribes. */
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
  { onStateChange, resetOnDetach = false }: StoreOptions<TState> = {},
): Store<TState, TActions> => {
  let state = initialState;
  let listeners: (() => void)[] = [];

  const dispatch = () => {
    onStateChange?.(state, setSilently);
    listeners.forEach((listener) => listener());
  };

  const get: GetState<TState> = () => state;

  const setSilently: SetState<TState> = (stateModifier) => {
    const newState =
      typeof stateModifier === "function"
        ? stateModifier(state)
        : stateModifier;
    state = { ...state, ...newState };
    return state;
  };

  const set: SetState<TState> = (stateModifier: StateModifier<TState>) => {
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
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
      if (listeners.length === 0 && resetOnDetach) {
        reset();
      }
    };
  };

  const actions = defineActions ? defineActions(set, get) : ({} as TActions);

  return { get, set, reset, subscribe, actions };
};
