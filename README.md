# @fransekman/store

A simple and lightweight state management library for React.

## Example usage

1. Create the store

```ts
import { createStore, useStore } from "@fransekman/store";

type Todo = {
    text: string;
    completed: boolean;
};

export interface TodoState {
    input: string;
    todos: Todo[];
}

const initialState: TodoState = {
    input: "",
    todos: [],
};

export const todoStore = createStore(initialState, (set) => ({
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

2. Use the store

```tsx
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
            <button onClick={() => actions.addTodo(state.input)}>
                Add Todo
            </button>
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

Useful when you want to initialize the state using props.

```ts
import { createStore, useStore } from "@fransekman/store";
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
