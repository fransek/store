export type Store<TState extends object, TActions extends object> = {
    get: () => TState;
    set: (stateModifier: StateModifier<TState>) => TState;
    reset: () => TState;
    subscribe: (listener: () => void) => () => void;
    actions: TActions;
};

export type Setter<TState extends object> = (
    stateModifier: StateModifier<TState>,
) => TState;

export type Getter<TState extends object> = () => TState;

export type StateModifier<TState extends object> =
    | Partial<TState>
    | ((state: TState) => Partial<TState>);

export type DefineActions<TState extends object, TActions> = (
    set: (setter: StateModifier<TState>) => TState,
    get: () => TState,
) => TActions;

export type StoreOptions<TState extends object> = {
    onStateChange?: (state: TState, set: Setter<TState>) => void;
    resetOnDetach?: boolean;
};

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

    const dispatch = () => listeners.forEach((listener) => listener());

    const get: Getter<TState> = () => state;

    const setSilently: Setter<TState> = (setter) => {
        const newState = typeof setter === "function" ? setter(state) : setter;
        state = { ...state, ...newState };
        return state;
    };

    const set: Setter<TState> = (setter) => {
        const newState = typeof setter === "function" ? setter(state) : setter;
        state = { ...state, ...newState };
        onStateChange?.(state, setSilently);
        dispatch();
        return state;
    };

    const reset = () => {
        state = initialState;
        onStateChange?.(state, setSilently);
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
