import { useSyncExternalStore } from "react";

export type Store<TState extends object, TActions extends object> = {
    get: () => TState;
    set: (setter: Setter<TState>) => TState;
    reset: () => void;
    subscribe: (listener: () => void) => () => void;
    actions: TActions;
};

export type Setter<TState extends object> =
    | Partial<TState>
    | ((state: TState) => Partial<TState>);

export const createStore = <
    TState extends object,
    TActions extends object = Record<never, never>,
>(
    initialState: TState,
    createActions?: (
        set: (setter: Setter<TState>) => TState,
        get: () => TState,
    ) => TActions,
): Store<TState, TActions> => {
    let state = initialState;
    let listeners: (() => void)[] = [];

    const dispatch = () => listeners.forEach((listener) => listener());

    const get = () => state;

    const set = (setter: Setter<TState>) => {
        const newState = typeof setter === "function" ? setter(state) : setter;
        state = { ...state, ...newState };
        dispatch();
        return state;
    };

    const reset = () => {
        state = initialState;
        dispatch();
    };

    const subscribe = (listener: () => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    };

    const actions = createActions ? createActions(set, get) : ({} as TActions);

    return { get, set, reset, subscribe, actions };
};

export const useStore = <TState extends object, TActions extends object>({
    get,
    set,
    reset,
    subscribe,
    actions,
}: Store<TState, TActions>) => {
    const state = useSyncExternalStore(subscribe, get);
    return { state, actions, set, reset };
};
