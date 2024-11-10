# fransek-store

A tiny state management library for React.

## Getting started

1. Install the package:

```sh
npm i fransek-store
```

2. Create a store:

```ts
// todoStore.ts
import { createStore, useStore } from "fransek-store";

type Todo = {
    text: string;
    completed: boolean;
};

interface TodoState {
    input: string;
    todos: Todo[];
}

const initialState: TodoState = {
    input: "",
    todos: [],
};

const todoStore = createStore(initialState, (set) => ({
    setInput: (input: string) => set({ input }),
    addTodo: (text: string) =>
        set((state) => {
            const newTodos = [...state.todos, { text, completed: false }];
            return {
                todos: newTodos,
                input: "",
            };
        }),
    toggleTodo: (index: number) =>
        set((state) => {
            const newTodos = [...state.todos];
            newTodos[index].completed = !newTodos[index].completed;
            return {
                todos: newTodos,
            };
        }),
}));

export const useTodoStore = () => useStore(todoStore);
```

3. Use the store:

```tsx
// Todos.tsx
import { useTodoStore } from "./todoStore";

export const Todos = () => {
    const { state, actions } = useTodoStore();

    return (
        <div>
            <h1>Todos</h1>
            <input
                type="text"
                value={state.input}
                onChange={(e) => actions.setInput(e.target.value)}
            />
            <button onClick={() => actions.addTodo(state.input)}>Add</button>
            <ul>
                {state.todos.map((todo, index) => (
                    <li>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => actions.toggleTodo(index)}
                        />
                        <span>{todo.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
```

## Example usage with React Context

Useful when you need to initialize the state using component props.

```ts
// todoStore.ts
import { createStore, useStore } from "fransek-store";
import { createContext, useContext } from "react";

type Todo = {
    text: string;
    completed: boolean;
};

export interface TodoState {
    input: string;
    todos: Todo[];
}

export const createTodoStore = (initialState: TodoState) => {
    return createStore(initialState, (set) => ({
        setInput: (input: string) => set({ input }),
        addTodo: (text: string) =>
            set((state) => {
                const newTodos = [...state.todos, { text, completed: false }];
                return {
                    todos: newTodos,
                    input: "",
                };
            }),
        toggleTodo: (index: number) =>
            set((state) => {
                const newTodos = [...state.todos];
                newTodos[index].completed = !newTodos[index].completed;
                return {
                    todos: newTodos,
                };
            }),
    }));
};

export const TodoStoreContext = createContext<ReturnType<
    typeof createTodoStore
> | null>(null);

export const useTodoStore = () => {
    const store = useContext(TodoStoreContext);
    if (!store) {
        throw new Error("useTodoStore must be used within a TodoStoreContext");
    }
    return useStore(store);
};
```

```tsx
// TodoStoreProvider.tsx
import { FC, ReactNode, useMemo } from "react";
import { createTodoStore, TodoState, TodoStoreContext } from "./todoStore";

export const TodoStoreProvider: FC<{
    initialState: TodoState;
    children: ReactNode;
}> = ({ initialState, children }) => {
    const store = useMemo(() => createTodoStore(initialState), [initialState]);
    return (
        <TodoStoreContext.Provider value={store}>
            {children}
        </TodoStoreContext.Provider>
    );
};
```

## Actions are optional

```tsx
// Count.tsx
import { createStore, useStore } from "fransek-store";
import React from "react";

export const countStore = createStore({ count: 0 });

export const Count = () => {
    const { state, set, reset } = useStore(countStore);
    return (
        <div>
            <div>Count: {state.count}</div>
            <button
                onClick={() => set((state) => ({ count: state.count + 1 }))}
            >
                +
            </button>
            <button
                onClick={() => set((state) => ({ count: state.count - 1 }))}
            >
                -
            </button>
            <button onClick={reset}>Reset</button>
        </div>
    );
};
```
