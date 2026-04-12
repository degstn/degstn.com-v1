/**
 * Node can expose a half-broken `globalThis.localStorage` when
 * `--localstorage-file` is set without a valid path (see Node warning).
 * Next’s dev overlay checks `typeof localStorage !== "undefined"` and then
 * calls `getItem`, which throws if `getItem` is not a function.
 */
export function register() {
  if (typeof globalThis === "undefined") return;

  const g = globalThis as typeof globalThis & { localStorage?: Storage };
  const ls = g.localStorage;
  if (ls == null) return;

  let ok = false;
  try {
    ok = typeof ls.getItem === "function";
  } catch {
    ok = false;
  }
  if (ok) return;

  const map = new Map<string, string>();
  const impl: Storage = {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(String(key)) ?? null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(String(key));
    },
    setItem(key: string, value: string) {
      map.set(String(key), String(value));
    },
  };

  try {
    Object.defineProperty(g, "localStorage", {
      value: impl,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } catch {
    g.localStorage = impl;
  }
}
