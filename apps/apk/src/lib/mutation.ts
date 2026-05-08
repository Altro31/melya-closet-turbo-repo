import type { WritableDeep } from "@tanstack/react-db";

export function applyChanges(proxy: WritableDeep<any>, changes: any) {
  for (const key in changes) {
    const value = changes[key as keyof typeof changes];
    if (value) (proxy[key as keyof typeof proxy] as any) = value;
  }
}
