Excellent — let’s go over how to **combine Zustand with React Context**, which is useful when you want:

* To **scope** a Zustand store (e.g., per user, per component tree)
* To **avoid a global store** when different parts of your app need isolated state
* Or to **inject dependencies** (like props or user data) when initializing a store

---

## ✅ 1. Why combine Zustand + Context?

Zustand stores are global by default:

```ts
const useStore = create((set) => ({ count: 0, increment: () => set(s => ({ count: s.count + 1 })) }))
```

Every component using `useStore` shares the same `count`.

If you want **separate store instances** for different contexts (e.g. each user, chat, project, or component tree), use **React Context** to provide a unique instance.

---

## ✅ 2. Example: Zustand + Context Pattern

Let’s build a small example step by step.

### ➤ `store.ts`

Create a Zustand store **factory** — not a single global store.

```ts
import { create } from "zustand";

export type CounterStore = {
  count: number;
  increment: () => void;
  reset: () => void;
};

export const createCounterStore = () =>
  create<CounterStore>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set({ count: 0 }),
  }));
```

---

### ➤ `CounterContext.tsx`

Create a Context that will **provide one Zustand store instance** per provider.

```tsx
import { createContext, useContext, ReactNode } from "react";
import { createCounterStore, CounterStore } from "./store";
import { useStore } from "zustand";

const CounterContext = createContext<ReturnType<typeof createCounterStore> | null>(null);

export const CounterProvider = ({ children }: { children: ReactNode }) => {
  const store = createCounterStore(); // new instance per provider
  return <CounterContext.Provider value={store}>{children}</CounterContext.Provider>;
};

// Hook for consuming store safely
export const useCounterStore = <T,>(selector: (state: CounterStore) => T): T => {
  const store = useContext(CounterContext);
  if (!store) throw new Error("useCounterStore must be used within a CounterProvider");
  return useStore(store, selector);
};
```

---

### ➤ `App.tsx`

You can now **wrap** different app parts with **independent providers** if needed.

```tsx
import { CounterProvider, useCounterStore } from "./CounterContext";

const Counter = () => {
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);
  const reset = useCounterStore((s) => s.reset);

  return (
    <div className="p-4">
      <h2>Count: {count}</h2>
      <button onClick={increment} className="px-4 py-2 bg-blue-600 text-white rounded">+</button>
      <button onClick={reset} className="ml-2 px-4 py-2 bg-gray-600 text-white rounded">Reset</button>
    </div>
  );
};

export default function App() {
  return (
    <div className="p-4 space-y-6">
      <CounterProvider>
        <h1>Counter A</h1>
        <Counter />
      </CounterProvider>

      <CounterProvider>
        <h1>Counter B (independent)</h1>
        <Counter />
      </CounterProvider>
    </div>
  );
}
```

Now both “Counter A” and “Counter B” have **isolated Zustand stores**, thanks to the Context wrapper.

---

## ✅ 3. When to Use This

* **Per-user or per-session state** (like different chat or editor states)
* **Modular apps** — reusable components that carry their own store
* **Server-side rendering** (you can inject a preloaded store per request)

---

## ✅ 4. Bonus — Injecting Props or Initial Data

You can pass props into the store like this:

```tsx
export const CounterProvider = ({ children, initialCount = 0 }: { children: ReactNode; initialCount?: number }) => {
  const store = useMemo(() => createCounterStore(initialCount), [initialCount]);
  return <CounterContext.Provider value={store}>{children}</CounterContext.Provider>;
};
```

and modify your store factory:

```ts
export const createCounterStore = (initialCount = 0) =>
  create<CounterStore>((set) => ({
    count: initialCount,
    increment: () => set((s) => ({ count: s.count + 1 })),
    reset: () => set({ count: initialCount }),
  }));
```


