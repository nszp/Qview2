import type { Ref, RefCallback } from "react";

type MutableRefList<T> = Array<Ref<T> | undefined | null>;

export function mergeRefs<T>(refs: MutableRefList<T>): RefCallback<T> {
  return (val: T) => {
    setRef(val, refs);
  };
}

export function setRef<T>(val: T, refs: MutableRefList<T>): void {
  for (const ref of refs) {
    if (typeof ref === "function") {
      ref(val);
    } else if (ref != null) {
      ref.current = val;
    }
  }
}
